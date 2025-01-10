const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the IP address: ', (ipAddress) => {
  const apiKey = require('crypto').randomBytes(32).toString('hex');
  console.log(`Generated API key: ${apiKey}`);
  
  rl.question('Enter the mongoDB IP address: ', (mongoipAddress) => {
    const config = {
      mongoAddress: mongoipAddress,
      ipAddress: ipAddress,
      apiKey: apiKey
    };

    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
    fs.writeFileSync('.env', `REACT_APP_IP=${ipAddress}\nREACT_APP_API_KEY=${apiKey}`);

    console.log('Config written to config.json and .env');
    rl.close();
  });
});
