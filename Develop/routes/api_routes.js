const note_router = require('express').Router();
const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;
const db_path = path.join(__dirname, '../db/db.json');


function getNoteData() {
    return fs.promises.readFile(db_path, 'utf8')
        .then(data => JSON.parse(data))
        .catch(err => {
            console.error(err);
        });
}


note_router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});



note_router.get('/api/notes', (req, res) => {
    getNoteData()
        .then(data => {
            res.json(data);
        });
});

note_router.post('/api/notes', (req, res) => {
    const newNote = {
        id: uuid(),
        title: req.body.title,
        text: req.body.text,
    };
    getNoteData()
        .then(data => {
            data.push(newNote);
            return fs.promises.writeFile(db_path, JSON.stringify(data));
        })
        .then(() => {
            res.json(newNote);
        })
        .catch(err => {
            console.error(err);
        }
        );
    
});


note_router.delete('/notes/:id', (req, res) => {
    getNoteData()
        .then(data => {
            const noteId = req.params.id;
            const noteIndex = data.findIndex(note => note.id === noteId);
            if (noteIndex === -1) {
                res.status(404).json({ message: 'Note not found' });
            } else {
                data.splice(noteIndex, 1);
                return fs.promises.writeFile(db_path, JSON.stringify(data));
            }
        })
        .then(() => {
            res.json({ message: 'Note deleted' });
        })
        .catch(err => {
            console.error(err);
        });
});

module.exports = note_router;