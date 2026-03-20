import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data, title, height = 300 }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 14,
                    weight: 'bold',
                },
            },
        },
    };

    return (
        <div style={{ height: `${height}px` }}>
            <Pie data={data} options={options} />
        </div>
    );
}