const axios = require('axios');

const fakeApiKey = '5875518988bf0cb309a4627b142d727570748a39ed05bf0887194d3ce255e32';
const url = 'http://192.168.178.20:3000/edit-item/67780ed0db972181ac8957fc';

const item = {
  name: 'New Name',
  description: 'New Description',
  price: 10.99,
};

const config = {
  headers: {
    'X-API-KEY': fakeApiKey,
    'Content-Type': 'application/json',
  },
};

axios.patch(url, item, config)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error);
  });
