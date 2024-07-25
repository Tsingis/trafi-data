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
  className?: string
  style?: React.CSSProperties
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  labelMap = {},
  colorMap = {},
  title,
  className,
  style,
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

        const defaultColor = "rgba(0, 123, 255, 0.6)"
        const backgroundColors = Object.keys(data).map(
          (key) => colorMap[key] || defaultColor,
        )

        const chartData: ChartData<"pie", number[], string> = {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors,
              borderColor: "rgb(223, 220, 220)",
              borderWidth: 2,
            },
          ],
        }

        const chartOptions: ChartOptions<"pie"> = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: !!title,
              text: title,
              position: "top",
            },
            legend: {
              display: true,
              position: "right",
              align: "center",
              labels: {
                usePointStyle: true,
              },
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
  }, [data, labelMap, colorMap])

  return (
    <div className={`piechart-container ${className}`} style={style}>
      <canvas ref={chartRef} />
    </div>
  )
}

export default PieChart
