import React from 'react'

export type BadgeType = ('success' | 'danger' | 'warning' | 'info' | 'primary' | 'light')

export default function Badge({ children, type, size = 1 }: {
  children: React.ReactNode,
  type: BadgeType,
  size?: number
}) {
  let color = ""
  switch (type) {
    case 'danger':
      color = `bg-red-600 text-white`
      break;
    case 'success':
      color = `bg-green-600 text-white`
      break;
    case 'warning':
      color = `bg-yellow-300 text-gray-600`
      break;
    case 'info':
      color = `bg-blue-600 text-gray-900`
      break;
    case 'primary':
      color = `bg-primary-600 text-gray-900`
      break;
    case 'light':
      color = `bg-gray-300 text-gray-900`
      break;
  }
  return (
    <span className={`  text-[${size}px] font-medium tracking-wider  rounded-lg p-1.5 uppercase
    ${color}
    
    `} >{children}</span>
  )
}
