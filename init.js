const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the IP address: ', (ipAddress) => {
  const apiKey = require('crypto').randomBytes(32).toString('hex');
  console.log(`Generated API key: ${apiKey}`);
  process.env.IP_ADDRESS = ipAddress;
  process.env.API_KEY = apiKey;
  process.env.REACT_APP_IP = ipAddress;
  process.env.REACT_APP_API_KEY = apiKey;
  rl.close();
  fs.writeFileSync('.env', `REACT_APP_IP=${ipAddress}\nREACT_APP_API_KEY=${apiKey}`);
});
