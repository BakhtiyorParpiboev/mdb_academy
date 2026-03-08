const axios = require('axios');

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

const payload = {
  language: 'javascript',
  version: '1.32.3',
  files: [
    {
      name: "main",
      content: "console.log('Test');\nconsole.log(1+1);"
    }
  ],
  stdin: ''
};

axios.post(PISTON_API_URL, payload)
  .then(res => console.log("SUCCESS:", JSON.stringify(res.data, null, 2)))
  .catch(err => {
    console.error("FAIL:", err.response ? err.response.data : err.message);
  });
