import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { CalculationResult } from '../types';
import '../styles/Chart.css';

Chart.register(...registerables);

interface InvestmentChartProps {
  result: CalculationResult;
  onPointClick: (monthIndex: number) => void;
  selectedMonth: number | null;
}

/**
 * Investment Chart Component
 * Interactive Chart.js visualization with clickable data points
 */
const InvestmentChart: React.FC<InvestmentChartProps> = ({
  result,
  onPointClick,
  selectedMonth
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !result.monthlyData.length) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data
    const labels = result.monthlyData.map((d) => `Month ${d.month}`);
    const balanceData = result.monthlyData.map((d) => d.balance);
    const contributionData = result.monthlyData.map((d) => d.contribution);
    const withdrawalData = result.monthlyData.map((d) => d.withdrawal);

    // Create chart
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Balance',
            data: balanceData,
            borderColor: 'rgb(102, 126, 234)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgb(102, 126, 234)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          },
          {
            label: 'Contributions',
            data: contributionData,
            borderColor: 'rgb(40, 167, 69)',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 6
          },
          {
            label: 'Withdrawals',
            data: withdrawalData,
            borderColor: 'rgb(220, 53, 69)',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          title: {
            display: true,
            text: 'Investment Growth Over Time',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: 20
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2) + ' PLN';
                }
                return label;
              },
              afterBody: function () {
                return '\\nClick to see details';
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time (Months)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              maxTicksLimit: 20
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Amount (PLN)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              callback: function (value) {
                return value.toLocaleString('pl-PL') + ' PLN';
              }
            },
            beginAtZero: true
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            onPointClick(index);
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [result, onPointClick]);

  // Update highlighted point when selectedMonth changes
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const chart = chartInstanceRef.current;
    
    // Reset all point styles
    chart.data.datasets.forEach((dataset) => {
      if (dataset.pointRadius) {
        dataset.pointRadius = 4;
        dataset.pointBackgroundColor = dataset.borderColor;
      }
    });

    // Highlight selected point
    if (selectedMonth !== null && chart.data.datasets[0].pointRadius) {
      const pointRadii = Array(result.monthlyData.length).fill(4);
      pointRadii[selectedMonth] = 10;
      chart.data.datasets[0].pointRadius = pointRadii;
      
      const pointColors = Array(result.monthlyData.length).fill('rgb(102, 126, 234)');
      pointColors[selectedMonth] = 'rgb(255, 193, 7)';
      chart.data.datasets[0].pointBackgroundColor = pointColors;
    }

    chart.update();
  }, [selectedMonth, result.monthlyData.length]);

  return (
    <div className=\"chart-container\">
      <div className=\"chart-wrapper\">
        <canvas ref={chartRef} id=\"investmentChart\"></canvas>
      </div>
      <p className=\"chart-hint\">
        💡 <strong>Tip:</strong> Click on any point in the chart to see detailed
        information for that specific month
      </p>
    </div>
  );
};

export default InvestmentChart;
