import React, { useRef, useEffect } from "react"
import Chart from "chart.js/auto"
import { Count } from "../../types"
import "./LineChart.modules.css"

type LineChartProps = {
  data: Count
  title: string
  xAxisText?: string
  yAxisText?: string
  className?: string
  style?: React.CSSProperties
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  xAxisText = "",
  yAxisText = "Amount",
  className,
  style,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const total = Object.values(data).reduce(
        (sum, value) => (sum ?? 0) + (value ?? 0),
        0,
      )

      const chart = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: Object.keys(data),
          datasets: [
            {
              label: title,
              data: Object.values(data),
              borderColor: "rgba(0, 123, 255, 1)",
              backgroundColor: "rgba(0, 123, 255, 0.6)",
              fill: false,
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: !!title,
              text: title,
              position: "top",
              color: "grey",
              font: {
                family: "Arial, sans-serif",
                weight: "bold",
              },
            },
            legend: {
              display: false,
              labels: {
                filter: (item) => item.text === title,
                generateLabels: function (chart) {
                  return chart.data.datasets.map((dataset, _) => ({
                    text: dataset.label as string,
                    fontColor: "grey",
                    fillStyle: "transparent",
                    strokeStyle: "transparent",
                    lineWidth: 0,
                  }))
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || ""
                  const value = context.raw as number
                  const percentage = ((value / (total ?? 1)) * 100).toFixed(2)
                  return `${label}: ${value} (${percentage}%)`
                },
              },
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: !!xAxisText,
                text: xAxisText,
              },
              ticks: {
                autoSkip: true,
              },
            },
            y: {
              display: true,
              beginAtZero: true,
              title: {
                display: !!yAxisText,
                text: yAxisText,
              },
              ticks: {
                callback: function (tickValue: string | number) {
                  return (
                    typeof tickValue === "number"
                      ? tickValue
                      : Number(tickValue)
                  ).toString()
                },
              },
            },
          },
        },
      })

      return () => {
        chart.destroy()
      }
    }
  }, [data, title])

  return (
    <div className={`linechart-container ${className}`} style={style}>
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default LineChart
