const express = require('express');
const prisma = require('../prisma');

const router = express.Router();

// GET /mahasiswa -> menampilkan seluruh data mahasiswa
router.get('/', async (req, res) => {
  try {
    const data = await prisma.mahasiswa.findMany({
      orderBy: { id: 'asc' },
    });
    res.json({
      message: 'Berhasil mengambil data mahasiswa',
      total: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// POST /mahasiswa -> membuat data mahasiswa baru
router.post('/', async (req, res) => {
  try {
    const { nama, nrp, jurusan } = req.body;

    // validasi sederhana: semua field wajib diisi
    if (!nama || !nrp || !jurusan) {
      return res.status(400).json({ message: 'nama, nrp, dan jurusan wajib diisi' });
    }

    const mahasiswa = await prisma.mahasiswa.create({
      data: { nama, nrp, jurusan },
    });

    res.status(201).json({ message: 'Data mahasiswa berhasil ditambahkan', data: mahasiswa });
  } catch (error) {
    // P2002 = pelanggaran unique (nrp sudah ada)
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'NRP sudah terdaftar' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// PUT /mahasiswa/:id -> mengupdate data mahasiswa berdasarkan id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nama, nrp, jurusan } = req.body;

    if (!nama || !nrp || !jurusan) {
      return res.status(400).json({ message: 'nama, nrp, dan jurusan wajib diisi' });
    }

    // cek dulu datanya ada atau tidak
    const cek = await prisma.mahasiswa.findUnique({ where: { id } });
    if (!cek) {
      return res.status(404).json({ message: 'Data mahasiswa tidak ditemukan' });
    }

    const mahasiswa = await prisma.mahasiswa.update({
      where: { id },
      data: { nama, nrp, jurusan },
    });

    res.json({ message: 'Data mahasiswa berhasil diupdate', data: mahasiswa });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'NRP sudah terdaftar' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

// DELETE /mahasiswa/:id -> menghapus data mahasiswa berdasarkan id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const cek = await prisma.mahasiswa.findUnique({ where: { id } });
    if (!cek) {
      return res.status(404).json({ message: 'Data mahasiswa tidak ditemukan' });
    }

    await prisma.mahasiswa.delete({ where: { id } });
    res.json({ message: 'Data mahasiswa berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
});

module.exports = router;
