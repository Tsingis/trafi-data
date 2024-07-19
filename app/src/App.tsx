import { useState, useEffect } from "react"
import data from "./assets/data.json"
import BarChart from "./components/BarChart/BarChart"
import SearchableDropdown from "./components/SearchableDropdown/SearchableDropdown"
import "./app.css"

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
        </div>
      )}
    </div>
  )
}

export default App
