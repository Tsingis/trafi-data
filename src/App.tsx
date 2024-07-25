import data from "./assets/data.json"
import { useState, useEffect } from "react"
import SearchableDropdown from "./components/SearchableDropdown/SearchableDropdown"
import BarChart from "./components/BarChart/BarChart"
import PieChart from "./components/PieChart/PieChart"
import { Count, Municipality } from "./types"
import { colors, drivingForces, drivingForcesColors } from "./constants"
import "./app.css"

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

  const totalCount = selectedMunicipality.drivingForce
    ? Object.values(selectedMunicipality.drivingForce).reduce(
        (sum, count) => sum + count,
        0,
      )
    : 0

  return (
    <div>
      <h1>
        Passenger cars in Finland
        <span className="data-date">
          Data from{" "}
          {date.toLocaleDateString("en-FI", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </h1>
      <div className="search-container">
        <div>Choose municipality:</div>
        <SearchableDropdown
          options={municipalities.map((m) => ({ code: m.code, name: m.name }))}
          onSelect={handleSelect}
          initialValue={initialValue}
        />
      </div>
      {totalCount && (
        <div className="total-count-label">
          Total car count: <span className="total-count">{totalCount}</span>
        </div>
      )}
      {selectedMunicipality.drivingForce && selectedMunicipality.color && (
        <div className="chart-grid">
          <PieChart
            data={selectedMunicipality.drivingForce}
            labelMap={drivingForces}
            colorMap={drivingForcesColors}
            title={"Driving forces"}
            style={{ gridArea: "a" }}
          />
          <BarChart
            data={selectedMunicipality.color}
            colorMap={colors}
            title={"Colors"}
            style={{ gridArea: "b" }}
          ></BarChart>
        </div>
      )}
    </div>
  )
}

export default App
