import React from 'react'
import { AiFillCloseSquare } from "react-icons/ai"

export default function CloseButton({ onClick, className }: {
  onClick: () => void,
  className: string
}) {
  return (
    <AiFillCloseSquare className={` ${className} cursor-pointer
              text-red-500 hover:text-red-700
              `} size={25}
      onClick={() => {
        onClick()
      }}
    />
  )
}
