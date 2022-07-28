require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const api_routes = require('./routes/api_routes');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', api_routes);



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

