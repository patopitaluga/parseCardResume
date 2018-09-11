const parseCardResume = require('./parseCardResume');

htmlStrOutput = '';
htmlStrOutput += '<style>' + "\n";
htmlStrOutput += ' td { border: 1px #666 solid }' + "\n";
htmlStrOutput += '</style>' + "\n";

let a = async function() {
  await parseCardResume('files/summary1.pdf', { format: 'html' })
  .then((table) => {
    htmlStrOutput += table;
  });

  await parseCardResume('files/summary2.pdf', { format: 'html' })
  .then((table) => {
    htmlStrOutput += table;
  });

  await parseCardResume('files/summary3.pdf', { format: 'html' })
  .then((table) => {
    htmlStrOutput += table;
  });

  await parseCardResume('files/summary4.pdf', { format: 'html' })
  .then((table) => {
    htmlStrOutput += table;
  });

  await parseCardResume('files/summary5.pdf', { format: 'html' })
  .then((table) => {
    htmlStrOutput += table;
  });

  console.log(htmlStrOutput);
}();
