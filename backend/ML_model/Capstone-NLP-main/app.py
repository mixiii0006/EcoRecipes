from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import numpy as np
import pandas as pd
import re
import ast
from fractions import Fraction
import textwrap
from pprint import pprint
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import pickle

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Load machine learning artifacts
model = load_model('best_ner_bilstm.h5')
tok2idx = pickle.load(open('tok2idx.pkl', 'rb'))
le = pickle.load(open('label_encoder.pkl', 'rb'))

MAXLEN = 50

# Load recipe dataset (update path if needed)
df_exploded = pd.read_csv(
    'nama_file.csv',
    converters={
        'Cleaned_Ingredients': lambda x: ast.literal_eval(x) if isinstance(x, str) else x
    }
)

UNIT_FACTORS = {
    'kg':1000, 'kilo':1000, 'g':1, 'gram':1,
    'l':1000, 'ml':1, 'pound':453.592, 'lb':453.592,
    'ounce':28.3495, 'oz':28.3495,
    'teaspoon':4.92892, 'tsp':4.92892,
    'tablespoon':14.7868, 'tbsp':14.7868,
    'cup':240, 'cups':240, 'quart':946.353, 'pt':473.176
}

def parse_number(q):
    q = q.strip().lower()
    if '/' in q:
        try:
            return float(Fraction(q))
        except:
            pass
    WORD2NUM = {'half':0.5, 'one':1, 'two':2, 'three':3, 'four':4}
    if q in WORD2NUM:
        return WORD2NUM[q]
    try:
        return float(q)
    except:
        return None

def parse_ingredients(text):
    toks = text.lower().replace(',', '').split()
    seq = [tok2idx.get(w, tok2idx['UNK']) for w in toks]
    pad = pad_sequences([seq], maxlen=MAXLEN, padding='post', value=tok2idx['PAD'])
    preds = model.predict(pad)[0]
    labs = le.inverse_transform(preds.argmax(-1))[:len(toks)]

    items = []
    cur_item = {'quantity': None, 'unit': None, 'ingredient': None}
    ent_tokens, ent_type = [], None

    for w, tag in zip(toks, labs):
        if tag != 'O':
            typ = tag.split('-',1)[1].lower()
            if ent_type != typ:
                if ent_tokens and ent_type:
                    cur_item[ent_type] = " ".join(ent_tokens)
                    ent_tokens = []
                ent_type = typ
                ent_tokens = [w]
            else:
                ent_tokens.append(w)
        else:
            if ent_tokens and ent_type:
                cur_item[ent_type] = " ".join(ent_tokens)
                ent_tokens = []
                ent_type = None
        if all(cur_item.values()):
            items.append(cur_item.copy())
            cur_item = {'quantity': None, 'unit': None, 'ingredient': None}

    if ent_tokens and ent_type:
        cur_item[ent_type] = " ".join(ent_tokens)
    if all(cur_item.values()):
        items.append(cur_item)

    return items

def recommend_recipes(text, top_n=5):
    items = parse_ingredients(text)
    if not items:
        return []

    title_sets = []
    for it in items:
        qty_num = parse_number(it['quantity'])
        unit = it['unit'].lower()
        ing = it['ingredient']
        mask_name = df_exploded['name'].str.contains(re.escape(ing), case=False, na=False)

        factor_in = UNIT_FACTORS.get(unit)
        factors = df_exploded['unit'].map(UNIT_FACTORS)
        if factor_in and qty_num is not None:
            avail = qty_num * factor_in
            mask_conv = mask_name & factors.notna() & ((df_exploded['quantity'] * factors) <= avail)
        else:
            mask_conv = pd.Series(False, index=df_exploded.index)

        if qty_num is not None:
            mask_fb = mask_name & \
                      (df_exploded['unit'].str.lower() == unit) & \
                      (df_exploded['quantity'] <= qty_num)
        else:
            mask_fb = pd.Series(False, index=df_exploded.index)

        mask = mask_conv | mask_fb
        titles = set(df_exploded.loc[mask, 'Title_Cleaned'])
        if titles:
            title_sets.append(titles)

    if not title_sets:
        return []

    common = set.intersection(*title_sets)
    if not common:
        return []

    df_meta = (
        df_exploded
        .drop_duplicates(subset=['Title_Cleaned'])
        .loc[:, ['Title_Cleaned', 'Instructions_Cleaned', 'Cleaned_Ingredients']]
    )

    results = df_meta[df_meta['Title_Cleaned'].isin(common)].head(top_n)

    # Convert results to list of dicts for JSON response
    return results.to_dict(orient='records')

@app.route('/api/recommend', methods=['POST', 'OPTIONS'])
def recommend():
    if request.method == 'OPTIONS':
        # Balas preflight request dengan status 200 OK
        return jsonify({'message': 'CORS preflight allowed'}), 200

    data = request.get_json()
    text = data.get('ingredients', '')
    if not text:
        return jsonify({'error': 'No ingredients provided'}), 400
    try:
        recommendations = recommend_recipes(text)
        return jsonify({'recommendations': recommendations})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)