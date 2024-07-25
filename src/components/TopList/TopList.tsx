import React from "react"
import { Count } from "../../types"
import "./TopList.modules.css"

type TopListProps = {
  data: Count
  topX?: number
  title?: string
  className?: string
  style?: React.CSSProperties
}

const TopList: React.FC<TopListProps> = ({
  data,
  topX = 3,
  title,
  className,
  style,
}) => {
  const sortedItems = Object.entries(data)
    .sort(([, first], [, second]) => (second ?? 0) - (first ?? 0))
    .slice(0, topX)

  return (
    <div className={`toplist-container ${className}`} style={style}>
      {title && <div className="toplist-title">{title}</div>}
      <ul className="toplist-list">
        {sortedItems.map(([item, count]) => (
          <li key={item} className="toplist-item">
            <strong>{item}</strong>: {count}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopList
