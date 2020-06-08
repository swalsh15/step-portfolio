google.charts.load('current', {
  'packages':['geochart'],
  'mapsApiKey': 'AIzaSyCsIDmQAVTMjvXr6NZBm1O8b9Ve9EWREwk'
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
  const data = google.visualization.arrayToDataTable([
    ['City',   'Population', 'Area'],
    ['Chicago', 2000000, 1285.31],
    ['New York City', 5000000, 1400.31],
    ['Los Angeles', 4000000, 1300],
    ['Philadelphia', 1500000, 800],
    ['Stamford', 30000, 900],
  ]);

  const options = {
    region: 'US',
    displayMode: 'markers',
    colorAxis: {colors: ['white', 'green']},
    width: 900,
    height: 500
  };
  const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
  chart.draw(data, options);
}