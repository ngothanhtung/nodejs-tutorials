const fs = require('fs'); // import file system module

const rs = fs.createReadStream('./demofile.txt'); // create read stream

// Event
rs.on('open', function () {
  console.log('The file is open');
});

// Function
fs.readFile('./demofile.txt', 'utf-8', (error, data) => {
  if (error) {
    console.error(error);
    return;
  }
  // data is a buffer
  console.log(data);
});
