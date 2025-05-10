const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

exports.register = async (req, res) => {
  console.log('📥 Request body:', req.body);  // <-- cek request masuk nggak
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword)
    return res.status(400).json({ error: 'Semua field wajib diisi' });

  if (password !== confirmPassword)
    return res.status(400).json({ error: 'Password tidak cocok' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Hashed password:', hashedPassword);  // <-- cek hasil hash

    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          console.error('❌ Error insert:', err); // <-- log error insert
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username atau email sudah digunakan' });
          }
          return res.status(500).json({ error: err.message });
        }
        console.log('✅ User berhasil dibuat dengan ID:', this.lastID); // <-- log sukses
        res.json({ id: this.lastID, username, email });
      }
    );
  } catch (err) {
    console.error('❌ Error di catch:', err); // <-- log error catch
    res.status(500).json({ error: 'Terjadi kesalahan saat registrasi' });
  }
};

exports.login = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'Username, email, dan password wajib diisi' });

  db.get(
    'SELECT * FROM users WHERE username = ? AND email = ?',
    [username, email],
    async (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(400).json({ error: 'Username atau email tidak cocok' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: 'Password salah' });

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: '1h',
      });

      res.json({ token, username: user.username });
    }
  );
};

