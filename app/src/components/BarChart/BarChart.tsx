import React, { useRef, useEffect } from "react"
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"
import "./BarChart.modules.css"

// Register necessary Chart.js components
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
)

type BarChartProps = {
  data: { [key: string]: number }
  xAxisLabelMap?: { [key: string]: string }
  xAxisTitle?: string
  yAxisTitle?: string
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisLabelMap = {},
  xAxisTitle = "",
  yAxisTitle = "Amount",
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        // Destroy the previous chart instance if it exists
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }

        // Prepare sorted labels and data based on xAxisLabelMap
        const sortedLabels = Object.keys(data).map(
          (key) => xAxisLabelMap[key] || key,
        )
        const sortedData = Object.keys(data).map((key) => data[key])

        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: sortedLabels,
            datasets: [
              {
                label: "Count",
                data: sortedData,
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                borderColor: "rgba(0, 123, 255, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || ""
                    if (label) {
                      return `${label}: ${context.raw}`
                    }
                    return `${context.raw}`
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: xAxisTitle,
                },
                grid: {
                  display: false,
                },
                ticks: {
                  autoSkip: false,
                },
              },
              y: {
                title: {
                  display: true,
                  text: yAxisTitle,
                },
                ticks: {
                  callback: function (value) {
                    return value
                  },
                },
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [data, xAxisLabelMap, xAxisTitle, yAxisTitle])

  return (
    <div className="barchart-container">
      <canvas ref={chartRef} />
    </div>
  )
}

export default BarChart
