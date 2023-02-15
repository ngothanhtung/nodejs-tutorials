const axios = require('axios');

axios.get('https://jsonplaceholder.typicode.com/users').then((response) => {
  console.log(response.data);
});
