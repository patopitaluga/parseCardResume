const fs = require('fs');
const pdf = require('pdf-parse');

let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/**
* Parse a credit card summary pdf.
*
* @param {string} fileName
* @param {object} options
* @returns {string|array}
 */
let parseCardResume = (fileName, options) => {
  if (typeof options === 'undefined') options = {}
  if (typeof options !== 'object') throw('Wrong options attribute format.');
  if (typeof options.format === 'undefined') options.format = 'array';

  return new Promise((resolve, reject) => {
    let hasDate = (str) => {
      let isDate = false;
      months.forEach((eachMonth) => {
        if (str.indexOf(eachMonth) > -1)
          isDate = true;
      });
      return isDate;
    };

    let dataBuffer = fs.readFileSync(fileName);
    pdf(dataBuffer).then((data) => {
      let pdfContent = data.text;
      let arEachCardContent = pdfContent.split('Total Consumos');

      let normalizedParts = [];
      let cardsIds = [];
      for (let i = 0; i < arEachCardContent.length - 1; i++) {
        normalizedParts[i] = [];
        let eachCardContent = arEachCardContent[i];
        cardsIds[i] = eachCardContent.substr(eachCardContent.indexOf('Tarjeta'), 12);

        let firstMonthPos;
        months.forEach((eachMonth) => {
          if (eachCardContent.indexOf(eachMonth) > -1) {
            if (typeof firstMonthPos === 'undefined') firstMonthPos = eachCardContent.indexOf(eachMonth);
            if (eachCardContent.indexOf(eachMonth) < firstMonthPos) firstMonthPos = eachCardContent.indexOf(eachMonth);
          }
        });
        firstMonthPos -= 3;

        if (firstMonthPos > 0) {
          let strTblContent = eachCardContent.substr(firstMonthPos);
          if (strTblContent.indexOf('Tarjeta') > -1)
            strTblContent = strTblContent.substr(0, strTblContent.indexOf('Tarjeta'));
          strTblContent = strTblContent.replace(/\s\s+/g, ';');
          let initialParser = strTblContent.split(';');
          let commaParsedContent = '';

          initialParser.forEach((eachPart, indexParts) => {
            let badParse = false;
            months.forEach((eachMonth) => {
              if (eachPart.indexOf(eachMonth) > 3) { // Has date but is not at the beggining of this part.
                commaParsedContent += eachPart.substr(0, eachPart.indexOf(eachMonth) - 3).trim() + ';';
                let possibleDate = eachPart.substr(eachPart.indexOf(eachMonth) - 3).trim() + ';';
                if (possibleDate.length > 10) {
                  let possibleDatePart1 = possibleDate.substr(0, possibleDate.indexOf(eachMonth) + eachMonth.length);
                  let possibleDatePart2 = possibleDate.substr(possibleDate.indexOf(eachMonth) + eachMonth.length);
                  possibleDate = possibleDatePart1 + ';' + possibleDatePart2 + ';';
                  //commaParsedContent += possibleDate.substr();
                }
                commaParsedContent += possibleDate;
                badParse = true;
              }
            });
            if (!badParse)
              commaParsedContent += eachPart + ';';
          });
          commaParsedContent = commaParsedContent.substr(0, commaParsedContent.length - 1);

          let countRows = 0;
          let countCellsInRow = 0;
          let tableParts = commaParsedContent.split(';');
          let lastDate = '';
          tableParts.forEach((eachPart, indexParts) => {
            if (typeof normalizedParts[i][countRows] === 'undefined') normalizedParts[i][countRows] = [];

            if (countCellsInRow === 0 && !hasDate(eachPart)) {
              normalizedParts[i][countRows].push(lastDate);
            }
            if (hasDate(eachPart))
              lastDate = eachPart.trim();

            normalizedParts[i][countRows].push(eachPart.trim());

            if (typeof tableParts[indexParts + 1] === 'undefined') tableParts[indexParts + 1] = '';
            if (eachPart.indexOf(',') > -1 && tableParts[indexParts + 1].indexOf(',') === -1) {
              countRows++;
              countCellsInRow = 0;
            } else {
              countCellsInRow++;
            }
          });
          let rowsToSplice = [];
          normalizedParts[i].forEach((eachRow, index) => {
            if (eachRow[2] === 'SU PAGO EN PESOS') rowsToSplice.push(index);
            if (eachRow[2] === 'SU PAGO EN USD') rowsToSplice.push(index);
          });
          rowsToSplice.reverse();
          rowsToSplice.forEach((eachRow, index) => {
            normalizedParts[i].splice(eachRow, 1);
          });

          normalizedParts[i].forEach((eachRow, index) => {
            if (eachRow[2] === '') normalizedParts[i][index] = [eachRow[0], eachRow[1], eachRow[3], eachRow[4], eachRow[5], eachRow[6]];
          });

          normalizedParts[i].forEach((eachRow, index) => {
            if (typeof eachRow !== 'undefined') {
              if (typeof eachRow[3] != 'undefined') {
                if (eachRow[3].indexOf('/') === -1)
                  normalizedParts[i][index] = [eachRow[0], eachRow[1], eachRow[2], '', eachRow[3], eachRow[4], eachRow[5]];
                else
                  normalizedParts[i][index][3] = normalizedParts[i][index][3].replace('C', '').replace(',', '').replace('.', '').replace(' ', '');
              }
            }
          });
          normalizedParts[i].forEach((eachRow, index) => {
            if (typeof eachRow !== 'undefined') {
              if (typeof eachRow[4] != 'undefined') {
                if (eachRow[4].indexOf('USD') === -1)
                  normalizedParts[i][index] = [eachRow[0], eachRow[1], eachRow[2], eachRow[3], '', eachRow[4], eachRow[5]];
                else
                  normalizedParts[i][index] = [eachRow[0], eachRow[1], eachRow[2], eachRow[3], eachRow[4], '', eachRow[5]];
              }
            }
          });
          normalizedParts[i].forEach((eachRow, index) => {
            if (typeof eachRow !== 'undefined') {
              if (typeof eachRow[5] !== 'undefined' && eachRow[5].substr(0, 4) === '0000')
                normalizedParts[i][index] = [eachRow[0], eachRow[1], eachRow[2], eachRow[3], eachRow[4], eachRow[6], ''];
            }
          });
          normalizedParts[i].forEach((eachRow, index) => {
            if (typeof eachRow !== 'undefined') {
              if (typeof eachRow[6] !== 'undefined' && eachRow[6].indexOf(' ') > -1)
                normalizedParts[i][index][6] = normalizedParts[i][index][6].substr(0, normalizedParts[i][index][6].indexOf(' '));
            }
          });
          normalizedParts[i].forEach((eachRow, index) => {
            if (typeof eachRow !== 'undefined') {
              if (typeof eachRow[2] != 'undefined') {
                if (!isNaN(eachRow[2].slice(-2)) && !isNaN(eachRow[2].slice(-5).substr(0, 2)) && eachRow[2].slice(-3).substr(0, 1) === '/' && eachRow[3] === '') {
                  normalizedParts[i][index][3] = normalizedParts[i][index][2].slice(-5).trim();
                  normalizedParts[i][index][2] = normalizedParts[i][index][2].substr(0, normalizedParts[i][index][2].length - 5).trim();
                }
              }
            }
          });
        }
      }

      let longestRow = 0;
      for (let i = 0; i < arEachCardContent.length - 1; i++) {
        normalizedParts[i].forEach((eachRow, index) => {
          if (typeof eachRow !== 'undefined') {
            if (eachRow.length > longestRow) longestRow = eachRow.length;
          }
        });
      }

      if (options.format === 'array') {
        resolve(normalizedParts);
        return;
      }

      let output = '';
      output += '<table>' + "\n";
      for (let i = 0; i < arEachCardContent.length - 1; i++) {
        output += '  <tr>' + "\n";
        output += '    <td colspan="' + longestRow + '">' +  cardsIds[i] + '</td>' + "\n";
        output += '  </tr>' + "\n";
        normalizedParts[i].forEach((eachRow) => {
          if (typeof eachRow !== 'undefined') {
            output += '  <tr>' + "\n";
            if (typeof eachRow[6] === 'undefined') eachRow[6] = '';
            eachRow[0] = eachRow[0].toLowerCase();
            if (typeof eachRow[5] !== 'undefined')
              eachRow[5] = eachRow[5].replace('.', '');
            if (typeof eachRow[5] !== 'undefined')
              eachRow[5] = eachRow[5].replace(',', '.');
            eachRow[6] = eachRow[6].replace('.', '');
            eachRow[6] = eachRow[6].replace(',', '.');
            for (let r = 0; r < longestRow; r++) {
              if (typeof eachRow[r] === 'undefined') eachRow[r] = '';
              output += '    <td>' + eachRow[r] + '</td>' + "\n";
            }
            output += '  </tr>' + "\n";
          }
        });
      };
      output += '</table>' + "\n";
      resolve(output);
    });
  });
}

module.exports = parseCardResume;
