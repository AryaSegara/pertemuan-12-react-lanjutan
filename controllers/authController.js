import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2"; 

// 🔹 REGISTER USER
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // 🔥 Hash password menggunakan Argon2
    const hashedPassword = await argon2.hash(password);

    // Simpan user ke database
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name , email, hashedPassword]
    );

    res.status(201).json({ message: "Registrasi berhasil!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 LOGIN USER
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek user berdasarkan email
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Email tidak ditemukan!" });
    }

    const userData = user.rows[0];

    // 🔥 Verifikasi password dengan Argon2
    const validPassword = await argon2.verify(userData.password, password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password salah!" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: userData.id, email: userData.email }, "JWT_SECRET_KEY", { expiresIn: "1h" });

    res.json({ message: "Login berhasil!", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
