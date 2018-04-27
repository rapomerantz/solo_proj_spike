//URL to request with CronJob: https://api.spark.io/v1/devices/3a0027001647343339383037/audioSpl?access_token=e91ff47d87b3de73e3bae77bb9c6d6d8ab1504dd
// Start listening for requests
app.listen();
 
app.on('listening', function() {
    // Store a reference to the Deployd temperature table
    var audioSplStore = server.createStore('audioSpl');
     
    // Run every 10 minutes. Write the data to the Deployd table.
    new CronJob('00 */10 * * * *', function(){
        // Make request to the Spark Core
        request("https://api.spark.io/v1/devices/3a0027001647343339383037/audioSpl?access_token=e91ff47d87b3de73e3bae77bb9c6d6d8ab1504dd", function(error, response, body) {
            // Access results as JSON data
            var result = JSON.parse(JSON.parse(body).result);
            // Convert the timestamp to seconds
            var timestamp = new Date().getTime() / 1000;
            console.log('result:',result);
            
            // Write the data as a new row into the Deployd temperature table
            // temperatureStore.insert({temperature: result.data2, humidity: result.data1, timestamp: timestamp}, function(err, result){
            //     if(result) {
            //         // Success! 
            //     }
            // });
        });
         
    }, null, true, "America/Los_Angeles");
});