const db = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

// Masukkan API Key SendGrid kamu di environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ error: true, message: "Passwords don't match" });

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], function (err) {
    if (err) return res.status(400).json({ error: true, message: "Email already exists" });
    res.json({ error: false, message: "User created" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (!user) return res.status(404).json({ error: true, message: "User not found" });

    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) return res.status(401).json({ error: true, message: "Wrong password" });

    const token = jwt.sign({ userId: user.id, name: user.name }, "SECRET_KEY");
    res.json({
      error: false,
      message: "success",
      loginResult: {
        userId: `user-${user.id}`,
        name: user.name,
        token: token,
      },
    });
  });
};

// Contoh fungsi forgotPassword di controller
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Cek apakah user ada di database (contoh pakai sqlite)
    const user = await dbGetUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    // Buat token reset (misal random string atau JWT, contoh sederhana):
    const resetToken = generateRandomToken();

    // Simpan token dan expire time di database (harus dibuat di db kamu)
    await saveResetToken(email, resetToken);

    // Buat URL reset password yang akan dikirim via email
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;

    // Buat email message
    const msg = {
      to: email,
      from: "anzzanafa@gmail.com", // email terverifikasi di SendGrid
      subject: "Reset Password - EcoRecipes",
      text: `Klik link berikut untuk reset password Anda: ${resetUrl}`,
      html: `<p>Klik link berikut untuk reset password Anda:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    // Kirim email via SendGrid
    await sgMail.send(msg);

    res.status(200).json({ message: "Link reset password telah dikirim ke email Anda." });
  } catch (error) {
    console.error("Error forgotPassword:", error);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// Fungsi contoh helper (ganti sesuai implementasi db kamu)
function generateRandomToken() {
  return require("crypto").randomBytes(32).toString("hex");
}

// Contoh async db function (ganti sesuai database kamu)
async function dbGetUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.get(query, [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function saveResetToken(email, token) {
  return new Promise((resolve, reject) => {
    // Simpan token dan expire (misal 1 jam) di kolom khusus di tabel users
    const expire = Date.now() + 3600000; // 1 jam dari sekarang
    const query = "UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE email = ?";
    db.run(query, [token, expire, email], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body; // cukup ini saja

  if (!newPassword) {
    return res.status(400).json({ message: "Password tidak boleh kosong" });
  }

  try {
    const user = await dbGetUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.reset_token !== token || !user.reset_token_expire || Date.now() > user.reset_token_expire) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await new Promise((resolve, reject) => {
      const query = `UPDATE users SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE email = ?`;
      db.run(query, [hashedPassword, email], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
