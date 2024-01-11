const router = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// Read all notes
router.get('/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Save a new note
router.post('/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      notesId: uuidv4()
    };
    readAndAppend(newNote, './db/db.json');
    res.json('Note added successfully');
  } else {
    res.error('Error adding note');
  }
});

// Delete a note
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const updatedNotes = json.filter((note) => note.notesId !== noteId);
      writeToFile('./db/db.json', updatedNotes);
      res.json('Note deleted successfully');
    });
});

module.exports = router;