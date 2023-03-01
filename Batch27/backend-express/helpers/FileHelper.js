const fs = require('fs');

// Save data to file
function write(fileName, data) {
  fs.writeFileSync(fileName, JSON.stringify(data), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

module.exports = { write };
