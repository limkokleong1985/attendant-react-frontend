import React, { useState } from 'react'

export type OptionType<T extends string> = {
  [key in T]: string | number
} & {
  label: string
}

export default function Select<T extends string>({ options, label, value, optionName, onChange }:
  {
    options: OptionType<T>[],
    label?: string,
    value: string | number,
    optionName: T,
    onChange: (value: string | number) => void
  }
) {


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className=" text-gray-700">
      {
        label && <label htmlFor="my-select" className="input-label">{label}</label>
      }

      <select
        id="my-select"
        value={value}
        onChange={handleSelectChange}
        className="appearance-none bg-white border border-gray-400 hover:border-primary-900 px-4 py-1 rounded shadow-md leading-tight focus:border-primary-900 focus:outline-none focus:shadow-outline"
      >
        {
          options.map((option, index) => <option className='' key={index} value={option[optionName]}>{option.label}</option>)
        }
      </select>
    </div>
  )
}