import { useState } from "react"

const ExpandableText = ({
  text = "",
  step = 300,
  className = "",
  buttonClassName = "",
}) => {
  const [length, setLength] = useState(step)

  if (!text) return null

  const isEnd = length >= text.length
  const visibleText = text.slice(0, length)

  const handleToggle = () => {
    if (isEnd) {
      setLength(step)
    } else {
      setLength((v) => v + step)
    }
  }

  return (
    <div className={className}>
      <p className="whitespace-pre-line text-gray-700 dark:text-slate-100">
        {visibleText}
        {!isEnd && "..."}
      </p>

      <button
        onClick={handleToggle}
        className={`mt-2 text-sm font-medium text-gray-100 hover:underline ${buttonClassName}`}
      >
        {isEnd ? "Thu gọn" : "Xem thêm"}
      </button>
    </div>
  )
}

export default ExpandableText
