from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pickle
import os
import csv
import pandas as pd 

app = Flask(__name__)
CORS(app)

# Load model dan fitur dataset
model = load_model('efficientnet_model.h5')
with open('features.pkl', 'rb') as f:
    features, filenames = pickle.load(f)

# Muat data CSV sebagai DataFrame
CSV_PATH = 'nama_file.csv'
if os.path.exists(CSV_PATH):
    df_recipes = pd.read_csv(CSV_PATH)
else:
    df_recipes = pd.DataFrame()

def extract_feature(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    feature = model.predict(img_array)
    return feature[0]

def clean_title(filename):
    name = os.path.splitext(filename)[0]
    name = ''.join([c for c in name if not c.isdigit()])
    name = name.replace('_', ' ').replace('-', ' ')
    return name.strip().title()

@app.route('/api/scan', methods=['POST'])
def scan():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    upload_path = os.path.join('static', 'uploaded.jpg')
    file.save(upload_path)

    input_feature = extract_feature(upload_path)
    sims = cosine_similarity([input_feature], features)[0]
    top_indices = sims.argsort()[-5:][::-1]

    results = []
    for idx in top_indices:
        filename = os.path.basename(filenames[idx])
        base_filename = filename.rsplit('.', 1)[0]  # Tanpa ekstensi

        # Ambil baris dari CSV sesuai nama file
        if not df_recipes.empty:
            row = df_recipes[df_recipes['Image_Name'] == base_filename]
            if not row.empty:
                row = row.iloc[0]
                cleaned_ingredients = row.get('Cleaned_Ingredients', '')
                instructions_cleaned = row.get('Instructions_Cleaned', '')
                title = row.get('Title_Cleaned', clean_title(filename))
            else:
                cleaned_ingredients = ''
                instructions_cleaned = ''
                title = clean_title(filename)
        else:
            cleaned_ingredients = ''
            instructions_cleaned = ''
            title = clean_title(filename)

        results.append({
            'Image_Name': f'/static/images/FoodImages/{filename}',
            'Title_Cleaned': title,
            'Cleaned_Ingredients': cleaned_ingredients,
            'Instructions_Cleaned': instructions_cleaned
        })

    return jsonify({'recommendations': results})

# Route utama untuk test manual (bisa dihapus jika hanya pakai API)
@app.route('/', methods=['GET', 'POST'])
def index():
    return "API only"

if __name__ == '__main__':
    app.run(debug=True)
