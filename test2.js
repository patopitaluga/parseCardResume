const parseCardResume = require('./parseCardResume');

parseCardResume('files/summary1.pdf')
.then((result) => {
  console.log(result);
});
