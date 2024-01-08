const fs = require('fs');

// Save data to file
function write(fileName, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, JSON.stringify(data), function (err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

module.exports = { write };
