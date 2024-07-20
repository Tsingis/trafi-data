import { useState, useEffect } from "react"
import data from "./assets/data.json"
import BarChart from "./components/BarChart/BarChart"
import SearchableDropdown from "./components/SearchableDropdown/SearchableDropdown"
import "./app.css"
import PieChart from "./components/PieChart/PieChart"

type DrivingForce = {
  [key: string]: string
}

type DrivingForceCount = {
  [key: string]: number
}

type Municipality = {
  code: string
  name: string
  countByDrivingForce: DrivingForceCount
}

const drivingForces: DrivingForce = {
  "1": "Petrol",
  "2": "Diesel",
  "3": "Hybrid",
  "4": "Electricity",
  "5": "Other",
}

const drivingForcesColors: DrivingForce = {
  "1": "rgba(0, 123, 255, 0.6)",
  "2": "rgba(220, 53, 69, 0.6)",
  "3": "rgba(255, 193, 7, 0.6)",
  "4": "rgba(40, 167, 69, 0.6)",
  "5": "rgba(108, 117, 125, 0.6)",
}

const municipalities: Municipality[] = data

const initialMunicipality = municipalities.find((m) => m.name === "Tampere")

function App() {
  const [selectedMunicipalityData, setSelectedMunicipalityData] =
    useState<DrivingForceCount | null>(null)
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
      setSelectedMunicipalityData(initialMunicipality.countByDrivingForce)
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
        setSelectedMunicipalityData(municipality.countByDrivingForce)
      }
    }
  }

  return (
    <div>
      <h1>Passenger cars in Finland</h1>
      <div className="search-container">
        <label>Choose municipality:</label>
        <SearchableDropdown
          options={municipalities.map((m) => ({ code: m.code, name: m.name }))}
          onSelect={handleSelect}
          initialValue={initialValue}
        />
      </div>
      {selectedMunicipalityData && (
        <div>
          <BarChart
            data={selectedMunicipalityData}
            xAxisLabelMap={drivingForces}
          />
          <PieChart
            data={selectedMunicipalityData}
            labelMap={drivingForces}
            colorMap={drivingForcesColors}
          ></PieChart>
        </div>
      )}
    </div>
  )
}

export default App
