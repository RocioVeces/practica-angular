const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Crear base de datos
const db = new sqlite3.Database('./peliculas.db');

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS peliculas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  director TEXT NOT NULL,
  anio INTEGER NOT NULL,
  genero TEXT NOT NULL
)`);

// GET - Listar todas
app.get('/peliculas', (req, res) => {
  db.all('SELECT * FROM peliculas', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET - Obtener por id
app.get('/peliculas/:id', (req, res) => {
  db.get('SELECT * FROM peliculas WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'No encontrada' });
    res.json(row);
  });
});

// POST - Crear
app.post('/peliculas', (req, res) => {
  const { titulo, director, anio, genero } = req.body;
  db.run('INSERT INTO peliculas (titulo, director, anio, genero) VALUES (?, ?, ?, ?)',
    [titulo, director, anio, genero],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, titulo, director, anio, genero });
    }
  );
});

// PUT - Modificar
app.put('/peliculas/:id', (req, res) => {
  const { titulo, director, anio, genero } = req.body;
  db.run('UPDATE peliculas SET titulo=?, director=?, anio=?, genero=? WHERE id=?',
    [titulo, director, anio, genero, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Actualizada correctamente' });
    }
  );
});

// DELETE - Eliminar
app.delete('/peliculas/:id', (req, res) => {
  db.run('DELETE FROM peliculas WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Eliminada correctamente' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
