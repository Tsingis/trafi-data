import React, { useRef, useEffect } from "react"
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  ChartData,
  ChartOptions,
} from "chart.js"
import "./BarChart.modules.css"

// Register necessary Chart.js components
ChartJS.register(
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
  colorMap?: { [key: string]: string }
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisLabelMap = {},
  colorMap = {},
  xAxisTitle = "",
  yAxisTitle = "Amount",
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<ChartJS<"bar"> | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }

        const labels = Object.keys(data).map((key) => xAxisLabelMap[key] || key)
        const values = Object.values(data)
        const total = values.reduce((sum, value) => sum + value, 0)

        const defaultColor = "rgba(0, 123, 255, 0.6)"
        const backgroundColors = Object.keys(data).map(
          (label) => colorMap[label] || defaultColor,
        )

        const chartData: ChartData<"bar", number[], string> = {
          labels,
          datasets: [
            {
              label: "Count",
              data: values,
              backgroundColor: backgroundColors,
            },
          ],
        }

        const chartOptions: ChartOptions<"bar"> = {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || ""
                  const value = context.raw as number
                  const percentage = ((value / total) * 100).toFixed(2)
                  return `${label}: ${value} (${percentage}%)`
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
        }

        chartInstanceRef.current = new ChartJS(ctx, {
          type: "bar",
          data: chartData,
          options: chartOptions,
        })
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [data, xAxisLabelMap, xAxisTitle, yAxisTitle, colorMap])

  return (
    <div className="barchart-container">
      <canvas ref={chartRef} />
    </div>
  )
}

export default BarChart