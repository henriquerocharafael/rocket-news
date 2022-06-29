const express = require("express");
const path = require("path");
const app = express();

const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const dbPromise = open({
  filename: 'data.db',
  driver: sqlite3.Database
})

const PORT = 8080;

// ejs template engine
app.set("views", path.join(__dirname, "views"));

// Mudar a localização da pasta views
app.set("view engine", "ejs");

// habilita arquivos static
app.use(express.static("public"));

// usar o req.body
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
  const db = await dbPromise
  const emails = await db.all('SELECT * FROM emails')
  console.log(emails)
  res.render('index', { emails })
})

app.post('/', async (req, res) => {
  const db = await dbPromise
  const email = req.body.email
  await db.run('INSERT INTO emails (email) VALUES (?);', email)
  res.redirect('/')
})

const setup = async () => {
  const db = await dbPromise
  await db.migrate()

  app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
}
 setup()
