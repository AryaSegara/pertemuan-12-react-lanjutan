import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
