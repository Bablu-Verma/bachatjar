import React from 'react'
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const bar_data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [10, 20, 30, 40, 50, 60,],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

export const BarChart = () => {
  return (
    <div className='max-w-[700px]'>
     <Bar data={bar_data} />
   </div>
  )
}

const linedata = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.4, // Smooth curve
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const lineoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Correct type for position
      },
      title: {
        display: true,
        text: 'Line Chart Example',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
        },
      },
    },
  };

export const LineChart = () => {
    return (
      <div >
       <Line data={linedata} options={lineoptions} />
     </div>
    )
  }