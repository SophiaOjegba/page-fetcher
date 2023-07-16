const http = require('http');
const https = require('https');
const fs = require('fs');

const URL = process.argv[2]; // The URL passed as the first command-line argument
const filePath = process.argv[3]; // The file path passed as the second command-line argument

// Determine whether to use http or https based on the URL protocol
const protocol = URL.startsWith('https://')

protocol.get(URL, response => {
  if (response.statusCode !== 200) {
    console.error(`Error: Received status code ${response.statusCode}`);
    response.resume(); // Consume response data to free up memory
    return;
  }

  let responseData = '';

  response.on('data', chunk => {
    responseData += chunk;
  });

  response.on('end', () => {
    fs.writeFile(filePath, responseData, err => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        const fileSize = Buffer.byteLength(responseData);
        console.log(`Downloaded and saved ${fileSize} bytes to ${filePath}`);
      }
    });
  });

}).on('error', error => {
  console.error('Error fetching the URL:', error.message);
});
