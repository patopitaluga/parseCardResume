# Argentina pdf's credit card summary parser
# / Analizador de pdf's de resumen de tarjeta de crédito

For now only tested with Visa Banco Galicia - Argentina.
Por ahora solo probado para Visa Banco Galicia de Argentina.

A javascript parser for credit card summaries pdf's.
Un analizador de archivos pdf de resumen de tarjeta de crédito. Permite exportar una tabla para utilizar en una planilla de cálculo. Es para uso personal únicamente.

Privacidad: Este script no emite datos al exterior ni realiza ningún relevamiento de sus datos.

Advertencia: No suba sus documentos a un repositorio si poseen datos confidenciales. No transfiera sus documentos en redes inseguras.

## Uso
Node
```
const parseCardResume = require('./parseCardResume');

parseCardResume('files/filename.pdf', options)
.then((result) => {
  console.log(result);
});
```

options: Object {
  format: 'html' // if not set will return an array by default.
}

Returns a Promise.
Devuelve un Promise.
