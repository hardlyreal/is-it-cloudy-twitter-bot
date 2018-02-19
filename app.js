// Import statement
const Twit = require('twit');
const config = require('./config');
const http = require('http')


// url
const url = 'http://api.wunderground.com/api/be341b0e84b47af5/conditions/q/OH/Youngstown.json';

http.get(url, res => {
  res.setEncoding('utf8');
  let body = '';
  res.on('data', data => {
    body += data;
  });
  res.on('end', () => {
    body = JSON.parse(body);
    
    let weatherTweet;

    if (
      body.current_observation.weather === "Rain" || 
      body.current_observation.weather === "Snow"
    ) 
      {
        weatherTweet = `Yes... it's ${body.current_observation.weather.toLowerCase()}ing #cloudyintheYO`;
      }
    else if (
      body.current_observation.weather === "Mostly Cloudy" || 
      body.current_observation.weather === "Cloudy" || 
      body.current_observation.weather === "Partly Cloudy" ||
      body.current_observation.weather === "Overcast"
    ) 
      {
        weatherTweet = `Yes... it's ${body.current_observation.weather.toLowerCase()} #cloudyintheYO`;
      } 
    else {
     weatherTweet = `No... it's ${body.current_observation.weather.toLowerCase()}`;
   }

    // Tweet every 4 hours
    tweetIt(weatherTweet);
  });
});

// TWITTER FUNCTION
// Authenticate
const T = new Twit(config);

// POST REQUEST
function tweetIt(txt) {
  // object of tweets
  const tweet = { 
    status: txt
  };

  // post request
  T.post('statuses/update', tweet, tweeted); 

  // callback function that let's us know if it works
  function tweeted(err, data, response) {
    if(err) {
      console.log('Something went wrong...');
    } else {
      console.log('Tweeted!');
    }
  }
}










