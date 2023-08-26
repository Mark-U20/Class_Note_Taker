require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const api_routes = require('./routes/api_routes');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//api routes
app.use('/api', api_routes);

app.use('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

