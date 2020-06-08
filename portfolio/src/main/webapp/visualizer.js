google.charts.load('current', {
  'packages':['geochart'],
  'mapsApiKey': 'AIzaSyCsIDmQAVTMjvXr6NZBm1O8b9Ve9EWREwk'
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
  fetch('/covid-data').then(response => response.json()).then((covidData) => {

    console.log(covidData);  

    /*const data = new google.visualization.DataTable();
    data.addColumn('string', 'State');
    data.addColumn('number', 'Cases');
    Object.keys(covidData).forEach((state) => {
      data.addRow([state, covidData[state]]);
    });

    const options = {
      region: 'US',
      colorAxis: {colors: ['white', 'green']},
      displayMode: 'regions',
      resolution: 'provinces', 
      width: 900,
      height: 500
    };
    const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(data, options);*/
  });
}