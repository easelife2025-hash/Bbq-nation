const http = require('http');

http.get('http://localhost:3000', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => console.log(chunk.toString().substring(0, 50)));
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
