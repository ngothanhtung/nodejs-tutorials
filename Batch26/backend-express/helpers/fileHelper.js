const fs = require('fs');

function write(fileName, data) {
  // console.log(found);
  // Save to file
  fs.writeFileSync(fileName, JSON.stringify(data), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

module.exports = { write };
