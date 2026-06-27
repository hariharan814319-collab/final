const http = require('http');
const data = JSON.stringify({ email: 'doctor@gmail.com' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/otp/send',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('body', body);
  });
});

req.on('error', (err) => {
  console.error('error', err.message);
});

req.write(data);
req.end();
