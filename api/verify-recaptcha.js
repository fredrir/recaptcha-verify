const https = require('https');
const querystring = require('querystring');

export default async (req, res) => {
  const token = req.body.token;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  const postData = querystring.stringify({
    secret: secretKey,
    response: token
  });
// :).
  const options = {
    hostname: 'www.google.com',
    port: 443,
    path: '/recaptcha/api/siteverify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = https.request(options, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.success) {
          res.status(200).send({ verified: true });
        } else {
          res.status(200).send({ verified: false, details: parsedData['error-codes'] });
        }
      } catch (error) {
        console.error('Error parsing response from reCAPTCHA verification:', error);
        res.status(500).send('Server Error');
      }
    });
  });

  request.on('error', (error) => {
    console.error('Error verifying reCAPTCHA:', error);
    res.status(500).send('Server Error');
  });

  request.write(postData);
  request.end();
};