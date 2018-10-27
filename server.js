const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const dbUrl = 'mongodb://127.0.0.1:27017/hiscores';
app.use(bodyParser.json());
app.use(express.static('.'));

mongoose.connect(dbUrl, { useNewUrlParser: true });

let scoreSchema = {
  'name': 'String',
  'score': 'Number'
}
var Score = mongoose.model('Score', mongoose.Schema(scoreSchema));
var scores = [];
var db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
  Score.find({}).sort({'score': -1}).limit(9).exec((err, docs) => {
    docs.forEach(entry => {
      scores.push(entry);
      console.log(`[${entry.name}: ${entry.score}]`);
    });
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
  let score = {
    'name': req.body.name,
    'score': req.body.score
  };
  Score.create(score, () => {
    console.log(`inserted into db: [${score.name}: ${score.score}]`);
  });
  res.redirect('/');
});

 app.listen(3000, () => {
  console.log("Listening on port 3000");
});
