const fs = require('fs');
const axios = require('axios');

const fileName = 'mynewfile1.json';

axios.get('https://server.aptech.io/online-shop/categories').then((response) => {
  fs.appendFile(fileName, JSON.stringify(response.data), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
});
