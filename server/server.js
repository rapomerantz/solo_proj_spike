const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const bodyParser = require('body-parser');
const pool = require('./modules/pool');
const CronJob = require('cron').CronJob;
const axios = require('axios');
const moment = require('moment'); 


// Configure body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // This line is required for Angular


// Static files
app.use(express.static('server/public'));


// Every 10 seconds makes an axios call to Photon
new CronJob('*/10 * * * * *', function() {
  console.log('...axios.get sending...'); 
  axios.get("https://api.spark.io/v1/devices/3a0027001647343339383037/audioSpl?access_token=e91ff47d87b3de73e3bae77bb9c6d6d8ab1504dd").then((response) => {
    // console.log(response.data);
    let timestamp = moment().format();
    console.log('timestamp:', timestamp);
    console.log('Current SPL: ',response.data.result);
    console.log('Device ID: ', response.data.coreInfo.deviceID);
    //query to be sent to SQL db
    let queryText = `INSERT INTO splResults (deviceId, currentSpl, sampleTime) 
                     VALUES ('${response.data.coreInfo.deviceID}', '${response.data.result}', '${timestamp}');`;
    pool.query(queryText)
        .then((result) => {
            console.log('successful post to db');
        }) 
        .catch((err) => {
            console.log('error in post to db', err);
    })
  }).catch((err) => {
      console.log('things broke');
  })
  
}, null, true, 'America/Los_Angeles');



// Start the server
app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
