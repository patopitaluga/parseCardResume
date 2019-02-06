# Argentina pdf's credit card summary parser
# / Analizador de pdf's de resumen de tarjeta de crédito

WIP

For now only tested with Visa Banco Galicia - Argentina.
Por ahora solo probado para Visa Banco Galicia de Argentina.

A javascript parser for credit card summaries pdf's.
Un analizador de archivos pdf de resumen de tarjeta de crédito. Permite exportar una tabla para utilizar en una planilla de cálculo. Es para uso personal únicamente.

Privacidad: Este script no emite datos al exterior ni realiza ningún relevamiento de sus datos.

Advertencia: No suba sus documentos a un repositorio si poseen datos confidenciales. No transfiera sus documentos en redes inseguras.

## As a server
Node
```
npm install
npm run start
```
Then open localhost:3000 and drag and drop the pdf file in the browser.

## As a javascript module.
```
const parseCardResume = require('parseCardResume');

parseCardResume(filePath, options)
.then((table) => {
  res.send(table);
});
```

Options
```
options: Object {
  format: 'html' // if not set will return an array by default.
}
```

Returns a Promise.
Devuelve un Promise.
