import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import "./Loading.modules.css"

type LoadingProps = {
  size?: "xs" | "sm" | "lg" | "1x" | "2x" | "3x" | "4x" | "5x" | "6x"
}

const Loading: React.FC<LoadingProps> = ({ size = "1x" }) => (
  <div className="spinner-container">
    <FontAwesomeIcon icon={faSpinner} spin size={size} />
  </div>
)

export default Loading
