import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import getStatusCount from "../../../utils/helpers/getStatusCount";
import BookEntry from "../../../types/bookEntry";
import isMobileDevice from "../../../utils/helpers/isMobileDevice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartProps = {
  booklist: BookEntry[];
  username: string;
};

const HorizontalBarChart = ({ booklist, username }: ChartProps) => {
  const [statusCount, setStatusCount] = useState(getStatusCount(booklist));

  useEffect(() => {
    setStatusCount(getStatusCount(booklist));
  }, [booklist]);

  const data = {
    labels: [
      `Reading (${statusCount["1"] || 0})`,
      `Completed (${statusCount["2"] || 0})`,
      `On-Hold (${statusCount["3"] || 0})`,
      `Dropped (${statusCount["4"] || 0})`,
      `Plan to Read (${statusCount["5"] || 0})`,
    ],
    datasets: [
      {
        label: "Number of books",
        data: [
          statusCount["1"] || 0,
          statusCount["2"] || 0,
          statusCount["3"] || 0,
          statusCount["4"] || 0,
          statusCount["5"] || 0,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    maintainAspectRatio: !isMobileDevice(),
    plugins: {
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value: string | number) {
            let number: number;
            if (typeof value === "string") {
              number = Number.parseInt(value);
            } else {
              number = value;
            }
            if (number % 1 === 0) {
              return number;
            }
          },
        },
      },
    },
  };

  return (
    <div className="statistics">
      <div className="header">
        <h3 className="chart-title">Statistics</h3>
      </div>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default HorizontalBarChart;
