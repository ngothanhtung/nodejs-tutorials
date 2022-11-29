const fs = require('fs');
const axios = require('axios');

const fileName = 'mynewfile1.json';

axios.get('https://jsonplaceholder.typicode.com/todos').then((response) => {
  fs.appendFile(fileName, JSON.stringify(response.data), function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
});
