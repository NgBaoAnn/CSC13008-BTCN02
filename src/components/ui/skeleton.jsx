import React from "react"

export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-slate-800 animate-pulse rounded ${className}`}
      {...props}
    />
  )
}

export default Skeleton

