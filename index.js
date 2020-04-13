const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

// console.log(process.env);

const app = express();
const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

// const database = [];
const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  console.log('I got a request!');
  // console.log(request.body);
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;

  // database.push(data);
  database.insert(data);
  // console.log(database);

  response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(',');
  console.log(latlon);
  const lat = latlon[0];
  const lon = latlon[1];
  console.log(lat, lon);

  const api_key = process.env.API_KEY;
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  // const api_url = `http://api.openweathermap.org/data/2.5/weather?lat=-20.90&lon=55.44&appid=b5897f7cca52733e1c0034137277f53e`;
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  // const aq_url = `https://api.openaq.org/v1/measurements`;
  const aq_response = await fetch(aq_url);
  const aq_data = await aq_response.json();

  const data = {
    weather: weather_data,
    air_quality: aq_data,
  };

  response.json(data);
});
