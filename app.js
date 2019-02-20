require('dotenv').config();
const Twit = require('twit');
const http = require('http');

const url = process.env.WEATHER_URL;

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
      body.current_observation.weather === 'Rain' ||
      body.current_observation.weather === 'Snow'
    ) {
      weatherTweet = `Yes... it's ${body.current_observation.weather.toLowerCase()}ing #cloudyintheYO`;
    } else if (
      body.current_observation.weather === 'Mostly Cloudy' ||
      body.current_observation.weather === 'Cloudy' ||
      body.current_observation.weather === 'Partly Cloudy' ||
      body.current_observation.weather === 'Overcast' ||
      body.current_observation.weather === 'Light Freezing Rain'
    ) {
      weatherTweet = `Yes... it's ${body.current_observation.weather.toLowerCase()} #cloudyintheYO`;
    } else if (body.current_observation.weather === 'Scattered Clouds') {
      weatherTweet = `Yes... there are ${body.current_observation.weather.toLowerCase()} #cloudyintheYO`;
    } else if (
      body.current_observation.weather === 'Light Snow' ||
      body.current_observation.weather === 'Light Rain'
    ) {
      weatherTweet = `Yes... there is ${body.current_observation.weather.toLowerCase()} #cloudyintheYO`;
    } else {
      weatherTweet = `No... it's ${body.current_observation.weather.toLowerCase()}`;
    }
    // Tweet every 4 hours
    setInterval(() => tweetIt(weatherTweet), 1000 * 240);
    // tweetIt(weatherTweet);
  });
});

// TWITTER FUNCTION
// Authenticate
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

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
    if (err) {
      console.log('Something went wrong...');
    } else {
      console.log('Tweeted!');
    }
  }
}
