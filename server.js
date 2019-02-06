const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({ dest: 'tempfiles/' })
const parseCardResume = require('./parseCardResume');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.redirect('index.html');
});

var uploadPDF = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/tempfiles');
    },
    filename: function (req, file, cb) {
      let re = /(?:\.([^.]+))?$/;
      cb(null, file.fieldname + '-' + Date.now() + '.' + re.exec(file.originalname)[1]);
    }
  })
});

app.post('/processpdf', uploadPDF.single('file'), (req, res) => {
  const a = async function() {
    await parseCardResume(__dirname + '/tempfiles/' + req.file.filename, { format: 'html' })
    .then((table) => {
      res.send(table);
    });
  }();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('CCParser listening on port ' + PORT);
});
