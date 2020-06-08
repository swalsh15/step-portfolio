google.charts.load('current', {
  'packages':['geochart'],
  'mapsApiKey': 'AIzaSyCsIDmQAVTMjvXr6NZBm1O8b9Ve9EWREwk'
});
google.charts.setOnLoadCallback(drawRegionsMap);


function drawRegionsMap(i) {
  if (typeof(i) == "undefined") {
    i = 0;
  }
  const options = {
    region: 'US',
    colorAxis: {colors: ['white', 'green']},
    displayMode: 'regions',
    resolution: 'provinces', 
    width: 900,
    height: 500,
    animation:{
      duration: 1000,
      easing: 'out',
    }
  };

  let data = new google.visualization.DataTable();
  data.addColumn('string', 'State');
  data.addColumn('number', 'Cases');

  fetch('/covid-data').then(response => response.json()).then((covidData) => {
    let curr = covidData[i].cases;
    document.getElementById("date").textContent = "COVID Cases: " + covidData[i].date;
    Object.keys(curr).forEach((state) => {
      data.addRow([state, curr[state]]);
    });
    const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(data, options);
  });
}

let i = 1;
function nextDay() {
  drawRegionsMap(i);
  i += 1;
}