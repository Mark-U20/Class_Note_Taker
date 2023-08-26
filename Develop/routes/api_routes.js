const note_router = require('express').Router();
const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;
const db_path = path.join(__dirname, '../db/db.json');

async function getNoteData() {
  return new Promise((resolve, reject) => {
    fs.readFile(db_path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

note_router.get('/notes', (req, res) => {
  console.log('get notes');

  getNoteData()
    .then(data => {
      console.log(`sending back: ${JSON.stringify(JSON.parse(data), null, 2)}`);
      res.json(JSON.parse(data));
    });
});


note_router.post('/notes', async (req, res) => {
  const newNote = {
    id: uuid().slice(0, 5),
    title: req.body.title,
    text: req.body.text,
  };

  let notes = await getNoteData()
  notes = JSON.parse(notes);
  notes.push(newNote);

  fs.writeFile(db_path, JSON.stringify(notes, null, 2), (err) => {
    if (err) {
      console.error(err);
    }
    else {
      res.status(201).json(newNote);
    }
  });

});


note_router.delete('/notes/:id', (req, res) => {
  getNoteData()
    .then(data => {
      const noteId = req.params.id;
      console.log(`deleting note with id: ${noteId}`);

      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== noteId);
      fs.writeFile(db_path, JSON.stringify(notes, null, 2), (err) => {
        if (err) {
          console.error(err);
        }
        else {
          res.status(200).json({ message: 'Note deleted' });
        }
      })
    })
});

module.exports = note_router;
