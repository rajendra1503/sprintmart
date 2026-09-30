const path = require('path');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', require('./routes/catalog'));

app.use((req, res) => {
  res.status(404).render('404', { title: 'Not found' });
});

module.exports = app;
