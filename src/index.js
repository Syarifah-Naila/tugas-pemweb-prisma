require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mahasiswaRoutes = require('./routes/mahasiswa');

const app = express();

// supaya bisa baca body JSON dari request
app.use(cors());
app.use(express.json());

// endpoint cek server hidup
app.get('/', (req, res) => {
  res.json({ message: 'API Mahasiswa aktif' });
});

// semua route mahasiswa diawali /mahasiswa
app.use('/mahasiswa', mahasiswaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
