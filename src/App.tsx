import data from "./assets/data.json"
import { useState, useEffect } from "react"
import SearchableDropdown from "./components/SearchableDropdown/SearchableDropdown"
import BarChart from "./components/BarChart/BarChart"
import PieChart from "./components/PieChart/PieChart"
import "./app.css"

type Mapping = {
  [key: string]: string
}

type Count = {
  [key: string]: number
}

type Municipality = {
  code: string
  name: string
  countByDrivingForce: Count
  countByColor: Count
}

const drivingForces: Mapping = {
  "1": "petrol",
  "2": "diesel",
  "3": "hybrid",
  "4": "electricity",
  "5": "other",
}

const drivingForcesColors: Mapping = {
  "1": "rgba(0, 123, 255, 0.6)",
  "2": "rgba(220, 53, 69, 0.6)",
  "3": "rgba(255, 193, 7, 0.6)",
  "4": "rgba(40, 167, 69, 0.6)",
  "5": "rgba(93, 93, 93, 0.6)",
}

const colors: Mapping = {
  black: "rgba(0, 0, 0, 0.6)",
  blue: "rgba(0, 123, 255, 0.6)",
  brown: "rgba(53, 33, 0, 0.6)",
  green: "rgba(40, 167, 69, 0.6)",
  grey: "rgba(93, 93, 93, 0.6)",
  red: "rgba(220, 53, 69, 0.6)",
  silver: "rgba(170, 169, 173, 0.6)",
  white: "rgba(255, 255, 255, 0.9)",
  other: "rgba(255, 193, 7, 0.6)",
}

const date: Date = new Date(data.date)
const municipalities: Municipality[] = data.municipalities

const initialMunicipality = municipalities.find((m) => m.name === "Tampere")

function App() {
  const [selectedMunicipality, setSelectedMunicipality] = useState<{
    drivingForce: Count | null
    color: Count | null
  }>({
    drivingForce: null,
    color: null,
  })
  const [initialValue, setInitialValue] = useState<{
    code: string
    name: string
  } | null>(null)

  useEffect(() => {
    if (initialMunicipality) {
      setInitialValue({
        code: initialMunicipality.code,
        name: initialMunicipality.name,
      })
      setSelectedMunicipality({
        drivingForce: initialMunicipality.countByDrivingForce,
        color: initialMunicipality.countByColor,
      })
    }
  }, [])

  const handleSelect = (
    selectedOption: { code: string; name: string } | null,
  ) => {
    if (selectedOption) {
      const municipality = municipalities.find(
        (m) => m.code === selectedOption.code,
      )
      if (municipality) {
        setSelectedMunicipality({
          drivingForce: municipality.countByDrivingForce,
          color: municipality.countByColor,
        })
      }
    }
  }

  return (
    <div>
      <h1>
        Passenger cars in Finland
        <span className="data-date">
          Data from:{" "}
          {date.toLocaleDateString("en-FI", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </h1>
      <div className="search-container">
        <label>Choose municipality:</label>
        <SearchableDropdown
          options={municipalities.map((m) => ({ code: m.code, name: m.name }))}
          onSelect={handleSelect}
          initialValue={initialValue}
        />
      </div>
      {selectedMunicipality.drivingForce && selectedMunicipality.color && (
        <div className="chart-grid">
          <BarChart
            data={selectedMunicipality.drivingForce}
            xAxisLabelMap={drivingForces}
            colorMap={drivingForcesColors}
          ></BarChart>
          <BarChart
            data={selectedMunicipality.color}
            colorMap={colors}
          ></BarChart>
          <PieChart
            data={selectedMunicipality.drivingForce}
            labelMap={drivingForces}
            colorMap={drivingForcesColors}
          />
          <PieChart
            data={selectedMunicipality.color}
            colorMap={colors}
          ></PieChart>
        </div>
      )}
    </div>
  )
}

export default App
