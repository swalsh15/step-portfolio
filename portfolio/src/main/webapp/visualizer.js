google.charts.load('current', {
  'packages':['geochart'],
  'mapsApiKey': 'AIzaSyCsIDmQAVTMjvXr6NZBm1O8b9Ve9EWREwk'
});
google.charts.setOnLoadCallback(initRegionsMap);

// holds json on covid cases from fetch request. Holds date and cases by state
let global_data = []; 

function initRegionsMap() {
  fetch('/covid-data').then(response => response.json()).then((covidData) => {
    for (let i = 0; i < covidData.length; i++) {
      global_data[i] = covidData[i];
    }
    // draw map with inital data 
    drawMap(0); 
  });
}

/*
* Draws map at date where date is index of global_data array
* Index 0 corresponds with 2020-01-21
*/
function drawMap(date) {
  if (date >= global_data.length) {
    document.getElementById("date").textContent = "No data for this date";
    return; 
  }
  const options = {
    region: 'US',
    colorAxis: {colors: ['White', 'green']},
    displayMode: 'regions',
    resolution: 'provinces', 
    width: 900,
    height: 500,
  };

  const data = new google.visualization.DataTable();
  data.addColumn('string', 'State');
  data.addColumn('number', 'Cases');

  document.getElementById("date").textContent = "COVID Cases: " + global_data[i].date;
  let dailyCasesByState = global_data[i].cases;
  Object.keys(dailyCasesByState).forEach((state) => {
      data.addRow([state, dailyCasesByState[state]]);
    });
    const chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
    chart.draw(data, options);
}

// Draws map of cases for following day
let i = 0;
function nextDay() {
  i++;
  drawMap(i)
}