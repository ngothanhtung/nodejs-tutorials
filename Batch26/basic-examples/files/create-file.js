const fs = require('fs');

const fileName = 'mynewfile1.txt';
const content = 'Hello content!';

fs.appendFile(fileName, content, function (err) {
  if (err) throw err;
  console.log('Saved!');
});
