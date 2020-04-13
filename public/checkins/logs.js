const mymap = L.map('mymap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });

tiles.addTo(mymap);

// var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
//   imageBounds = [
//     [-20.92, 55.52],
//     [-32, 70],
//   ];
// L.imageOverlay(imageUrl, imageBounds).addTo(mymap);

getData();
async function getData() {
  const response = await fetch('/api');
  const data = await response.json();
  console.log(data);

  for (item of data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);

    let txt = `
        The weather here at ${item.lat.toFixed(2)}&deg;,
        ${item.lon.toFixed(2)}&deg; in ${item.weather.name} is
        ${item.weather.weather[0].description}
        with a temperature of
        ${(item.weather.main.temp - 273.15).toFixed(2)}&deg; Celsius.
        `;

    if (typeof item.air != 'undefined') {
      txt += ` The concentration of particulate matter (${
        item.air.parameter
      }) is ${item.air.value} ${item.air.unit} last read on ${new Date(
        item.air.lastUpdated
      ).toLocaleDateString()}.`;
    } else {
      txt += ` No quality air reading.`;
    }

    marker.bindPopup(txt);
  }

  console.log(data);
}
