import React, { useRef, useEffect } from "react"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
  ChartData,
  ChartOptions,
} from "chart.js"
import "./PieChart.modules.css"

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, PieController)

type PieChartProps = {
  data: { [key: string]: number }
  labelMap?: { [key: string]: string }
  colorMap?: { [key: string]: string }
  title?: string
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  labelMap = {},
  colorMap = {},
  title = "",
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<ChartJS<"pie"> | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }

        const labels = Object.keys(data).map((key) => labelMap[key] || key)
        const values = Object.values(data)
        const total = values.reduce((sum, value) => sum + value, 0)

        // Determine colors
        const defaultColor = "rgba(0, 123, 255, 0.6)" // Default color if no colorMap is provided
        const backgroundColors = Object.keys(data).map(
          (key) => colorMap[key] || defaultColor,
        )

        const chartData: ChartData<"pie", number[], string> = {
          labels,
          datasets: [
            {
              label: title,
              data: values,
              backgroundColor: backgroundColors,
              borderColor: "rgba(0, 0, 0, 0.1)",
              borderWidth: 1,
            },
          ],
        }

        const chartOptions: ChartOptions<"pie"> = {
          responsive: true,
          plugins: {
            legend: {
              display: true,
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
        }

        chartInstanceRef.current = new ChartJS(ctx, {
          type: "pie",
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
  }, [data, labelMap, colorMap, title])

  return (
    <div className="piechart-container">
      <canvas ref={chartRef} />
    </div>
  )
}

export default PieChart
