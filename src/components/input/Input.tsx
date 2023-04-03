import React, { forwardRef } from 'react';

interface InputProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  callbackEnd?: () => void;
  className?: string;
  enableAutoFocus?: boolean;
  onBlur?: () => void;
}


const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      enableAutoFocus,
      label,
      onBlur,
      value,
      onChange,
      placeholder,
      type,
      className,
      callbackEnd,
    },
    ref,
  ) => {
    const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value)
    }

    const handleBlur = () => {
      if (callbackEnd) callbackEnd()
      if (onBlur) onBlur()
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        // If the user presses the "Escape" key, clear the input field
        onChange('')
        if (callbackEnd) callbackEnd()
        event.preventDefault()
      } else if (event.key === 'Enter') {
        // If the user presses the "Enter" key, blur the input field
        event.currentTarget.blur()
        if (callbackEnd) callbackEnd()
        event.preventDefault()
      }
    }

    return (
      <div className=' w-[100%]'>
        {
          label && <label htmlFor="input-field" className="input-label">{label}</label>
        }

        <input
          id="input-field"
          ref={ref}
          value={value}
          onChange={handleSelectChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onClick={e => {
            e.stopPropagation()
          }}
          autoFocus={enableAutoFocus}
          placeholder={placeholder}
          type={type || "text"}

          className={`appearance-none bg-white border border-gray-400 hover:border-primary-900 px-4 py-1 rounded shadow-md leading-tight focus:border-primary-900 focus:outline-none focus:shadow-outline ${className}`}
        />

      </div>
    )
  })
export default Input;