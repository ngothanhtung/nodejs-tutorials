const fs = require('fs');
const rs = fs.createReadStream('./demofile.txt');

rs.on('open', function () {
  console.log('The file is open');
  // Legacy
  fs.readFile('./demofile.txt', 'utf-8', (error, data) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
  });

  // Modern
  // fs.readFile('./demofile.txt', 'utf8').then(data => {

  // }).catch(error => {

  // })
});
