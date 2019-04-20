import "babel-polyfill";
import Chart from "chart.js";

const tempURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";

async function loadTemp() {
  const response = await fetch(tempURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();
  const tempData = parser.parseFromString(xmlTest, "text/xml");
  const time = tempData.querySelectorAll("FORECAST[hour]");
  const temp = tempData.querySelectorAll("TEMPERATURE[max]");
  const result = Object.create(null);
  for (let i = 0; i < time.length; i++) {
    const timeTag = time.item(i);
    const tempTag = temp.item(i);
    const hour = timeTag.getAttribute("hour");
    const temperature = tempTag.getAttribute("max");
    result[hour] = temperature;
  }
  return result;
}

async function loadTemp_2() {
  const response = await fetch(tempURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();
  const tempData = parser.parseFromString(xmlTest, "text/xml");
  const time = tempData.querySelectorAll("FORECAST[hour]");
  const temp = tempData.querySelectorAll("HEAT[max]");
  const result = Object.create(null);
  for (let i = 0; i < time.length; i++) {
    const timeTag = time.item(i);
    const tempTag = temp.item(i);
    const hour = timeTag.getAttribute("hour");
    const temperature = tempTag.getAttribute("max");
    result[hour] = temperature;
  }
  return result;
}

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");
buttonBuild.addEventListener("click", async function() {
  const tempData = await loadTemp();
  const tempData_2 = await loadTemp_2();
  const keys = Object.keys(tempData);
  const keys_2 = Object.keys(tempData_2);

  const plotData = keys.map(key => tempData[key]);
  const plotData_2 = keys_2.map(key => tempData_2[key]);

  const chartConfig = {
    type: "line",

    data: {
      labels: keys,
      datasets: [
        {
          label: "Температура по ощущениям",
          backgroundColor: "rgba(20, 255, 20, 0.7)",
          borderColor: "rgb(0, 180, 0)",
          data: plotData_2
        },
        {
          label: "Температура",
          backgroundColor: "rgba(255, 20, 20, 0.7)",
          borderColor: "rgb(180, 0, 0)",
          data: plotData
        }
      ],
    },
    options : {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Температура, С'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Время, ч'
          }
        }]
      }
    }
    
  };

  if (window.chart) {
    chart.data.labels = chartConfig.data.labels;
    chart.data.datasets[0].data = chartConfig.data.datasets[0].data;
    chart.update({
      duration: 800,
      easing: "easeOutBounce"
    });
  } else {
    window.chart = new Chart(canvasCtx, chartConfig);
  }
});
