import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TestAnalysisChart = () => {
    // Sample data for test analysis
    const data = {
        labels: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'], // Subjects
        datasets: [
            {
                label: 'Test 1',
                data: [78, 85, 92, 75, 88], // Scores for Test 1 in different subjects
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Test 2',
                data: [85, 89, 80, 82, 91], // Scores for Test 2 in different subjects
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
            {
                label: 'Test 3',
                data: [90, 75, 87, 88, 84], // Scores for Test 3 in different subjects
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
        ],
    };

    // Options for customizing the chart
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Test Analysis on Different Subjects',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100, // Maximum score is 100
            },
        },
    };

    return (
        <div>
            <h2 className="text-center text-2xl font-bold mb-4">Student Performance in Different Subjects</h2>
            <div className="max-w-4xl mx-auto">
                <Bar data={data} options={options} />
            </div>
            
        </div>
    );
};

export default TestAnalysisChart;
