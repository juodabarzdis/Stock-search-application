import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import finnhub from "finnhub";
import "./Stock.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ChartBar = (props) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState({});

  // stockCandles //

  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "cc3p4a2ad3i9vsk3v8ag";
  const finnhubClient = new finnhub.DefaultApi();

  useEffect(() => {
    finnhubClient.stockCandles(
      props.company,
      "D",
      props.parsedDateBegin, // Unix timestamp
      props.parsedDateEnd, // "2020-06-01"
      (error, data, response) => {
        console.log(data);
        setChartData({
          type: "line",
          labels: data.t.map((date) =>
            new Date(date * 1000).toLocaleDateString("lt-LT")
          ),
          datasets: [
            {
              label: "Close",
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "rgba(255,99,132,1)",
              data: data.c, // close price
              tension: 0.1,
              fill: false,
            },
            {
              label: "Open",
              backgroundColor: "rgba(155,99,132,0.2)",
              borderColor: "rgba(155,99,132,1)",
              data: data.o, // open price
              tension: 0.1,
              fill: false,
            },
            {
              label: "High",
              backgroundColor: "rgba(55,99,132,0.2)",
              borderColor: "rgba(55,99,132,1)",
              data: data.h, // high price
              tension: 0.1,
              fill: false,
            },
            {
              label: "Low",
              backgroundColor: "rgba(255,99,32,0.2)",
              borderColor: "rgba(255,99,32,1)",
              data: data.l, // low price
              tension: 0.1,
              fill: false,
            },
          ],
        });

        setChartOptions({
          type: "line",
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Stock Prices",
            },
          },
        });
      }
    );
  }, [props.company, props.parsedDateBegin, props.parsedDateEnd]);

  return (
    <div>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default ChartBar;
