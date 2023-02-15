const fs = require('fs');

const fileName = 'mynewfile1.txt';
const content = 'Hello content!';

// fs.appendFile(fileName, content, function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });

// OK hơn
try {
  fs.appendFileSync(fileName, content);
  console.log('Saved!');
} catch (error) {
  console.log(error);
}
