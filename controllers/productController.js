import pool from "../config/db.js";


// Ini Relasi Antar Tabel One to Many
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.price, c.name as category 
      FROM products p 
      JOIN categories c ON p.category_id = c.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add product
export const createProduct = async (req, res) => {
  const { name, price, category_id } = req.body;
  try {
    const result = await pool.query(
    "INSERT INTO products (name, price, category_id) VALUES ($1, $2, $3) RETURNING *",
    [name, price, category_id]
  );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  ini untuk meng filter by category , min price , max price
export const getProductsByFilter = async (req, res) => {
    const { category, minPrice, maxPrice } = req.query;
    
    let query = 
    `SELECT p.id, p.name, p.price, c.name as category 
      FROM products p 
      JOIN categories c ON p.category_id = c.id
      WHERE 1=1`;
    
    let values = [];
    let index = 1;
  
    if (category) {
      query += ` AND c.name ILIKE $${index}`;
      values.push(`%${category}%`);
      index++;
    }
  
    if (minPrice) {
      query += ` AND p.price >= $${index}`;
      values.push(minPrice);
      index++;
    }
    if (maxPrice) {
      query += ` AND p.price <= $${index}`;
      values.push(maxPrice);
      index++;
    }
    try {
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
