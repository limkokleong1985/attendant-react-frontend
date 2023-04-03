import React from 'react'

export default function Button({
  label,
  onClick,
  className,
  type
}:
  {
    label: string
    onClick: () => void,
    className?: string
    type: "normal" | "primary" | "success" | "danger" | "warning"
  }) {
  return (
    <button className={`${className} 
    px-3
    rounded-sm shadow-lg
     font-bold
    ${(type === "normal") && 'hover:bg-gray-300 bg-white  text-gray-900 '} 
    ${(type === "success") && 'hover:bg-green-700 bg-green-600  text-white '}
    ${(type === "danger") && 'hover:bg-red-700 bg-red-600  text-white '}
    
    ${(type === "warning") && 'hover:bg-yellow-500 bg-yellow-400  text-gray-800 '}
    `} onClick={(e) => onClick()}>{label}</button>
  )
}
