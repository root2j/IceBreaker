require('dotenv').config();
const fs = require('fs');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY not found in .env file.');
  process.exit(1);
}

const apiKeyFileContent = `const GEMINI_API_KEY = "${apiKey}";`;

fs.writeFileSync('api_key.js', apiKeyFileContent);

console.log('API key written to api_key.js');
