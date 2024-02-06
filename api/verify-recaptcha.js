const axios = require('axios');

export default async (req, res) => {
  const token = req.body.token;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; 
  
  try {
    const googleResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: token
      }
    });
    
    if (googleResponse.data.success) {
      res.status(200).send({ verified: true });
    } else {
      res.status(200).send({ verified: false, details: googleResponse.data['error-codes'] });
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    res.status(500).send('Server Error');
  }
};