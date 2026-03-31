import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Fix ES module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Products Route
app.get('/api/products', (req, res) => {
  try {
    const filePath = path.resolve(__dirname, './data/products.json');

    const json = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(json);

    res.json(products);
  } catch (err) {
    console.error("PRODUCTS ERROR:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

// ✅ Other routes (auth, payment, address)
import addressRoutes from './routes/address.js';
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';

app.use('/api/address', addressRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

// ✅ Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});