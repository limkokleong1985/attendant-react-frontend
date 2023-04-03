import React, { useState, useEffect, useRef, useCallback } from 'react'

import { AiFillCaretDown } from 'react-icons/ai'
import Input from './Input';

export type OptionType<T extends string, K extends string, L extends string> = {
  [key in T]: string | number;
} & {
    [key in K]: string;
  } & {
    [key in L]?: string;

  }

interface SelectProps<T extends string, K extends string, L extends string> {
  label?: string;
  name: string;
  error?: string;
  optionValue: T;
  optionLabel: K,
  optionDesc?: L,
  options: OptionType<T, K, L>[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean
}


export default function MultipleSelect<T extends string, K extends string, L extends string>({
  multiple,
  value,
  name,
  label,
  error,
  onChange,
  options,
  optionValue,
  optionLabel,
  optionDesc,
  disabled }: SelectProps<T, K, L>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<(string | number)>("")
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIsFocus, setSearchIsFocus] = useState(false);
  const containerRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleOnchange(newValue: (string | number)[]) {
    if (disabled) return;
    onChange(newValue)
  }

  function handleIsOpen(newValue: (v: boolean) => boolean) {
    if (disabled) return setIsOpen(false);
    setIsOpen(newValue)
  }

  function clearOptions() {
    handleOnchange([])
  }

  function selectOption(newValue: (string | number)) {
    if (multiple) {
      if (value.includes(newValue)) {
        let newV = value.filter(o => o !== newValue);
        handleOnchange(newV);
      } else {
        handleOnchange([...value, newValue])
      }
    } else {
      if (!value.includes(newValue)) {
        handleOnchange([newValue])
      }
    }

  }

  function getOption(value: (string | number)) {
    for (let option of options) {
      if (option[optionValue] === value) {

        return option
      }
    }
    return null
  }


  function isOptionSelected(selectedV: (string | number)) {

    return value?.includes(selectedV)
  }

  let processOptions = useCallback((): OptionType<T, K, L>[] => {
    let currentOptions = [...options]
    if (searchQuery) {
      let filterOptions = currentOptions.filter(option => {
        return typeof option[optionLabel] === 'string' && option[optionLabel].toLowerCase().includes(searchQuery.toLowerCase());
      })

      return filterOptions;
    }

    return options

  }, [options, searchQuery])


  useEffect(() => {
    const newOptions = processOptions()

    if (searchQuery && newOptions.length) {
      setSelectedValue(processOptions()[0][optionValue]);
    }

  }, [searchQuery, processOptions])


  useEffect(() => {
    if (options.length && isOpen) {
      setSelectedValue(options[0][optionValue]);
    }
    if (isOpen && searchInputRef && searchInputRef.current) {
      setSearchIsFocus(true);

      searchInputRef.current.value = "";
      setSearchQuery("")
    }
  }, [isOpen, options, optionValue])

  useEffect(() => {
    if (searchIsFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchIsFocus])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return
      switch (e.code) {
        case "Enter":
        case "Space":
          handleIsOpen((prev) => !prev)

          if (isOpen) selectOption(selectedValue)
          break;
        case "Escape":
          setIsOpen(false);
          break
      }
    }
    if (containerRef && containerRef.current) containerRef.current.addEventListener("keydown", handler);
    return () => {
      if (containerRef && containerRef.current) containerRef.current.removeEventListener("keydown", handler);
    }
  }, [isOpen, selectedValue])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != searchInputRef.current) return
      switch (e.code) {
        case "Enter":
          handleIsOpen(prev => !prev)

          if (isOpen) selectOption(selectedValue)
          break;
        case "Escape":
          setIsOpen(false);
          break

      }
    }
    if (searchInputRef && searchInputRef.current) searchInputRef.current.addEventListener("keydown", handler);
    return () => {
      if (searchInputRef && searchInputRef.current) searchInputRef.current.removeEventListener("keydown", handler);
    }
  }, [searchIsFocus, selectedValue, disabled])



  let handleSearchOnChange = (v: string) => {

    setSearchQuery(v);

  }



  return (
    <div>
      {label && <label htmlFor={name} className="block">{label}</label>}
      <div
        ref={containerRef}
        onBlur={() => {
          if (searchIsFocus) return;
          setIsOpen(false);
        }}
        onClick={() => {
          handleIsOpen(prev => {
            return !prev;
          });
        }}
        id={name}
        tabIndex={0}
        className={`relative w-full h-auto  p-2 border rounded 
        focus:border-blue-500 outline-none border-gray-500  bg-white cursor-pointer`}>
        <div className="flex items-center gap-2 ">
          <span className="flex-grow flex gap-2 flex-wrap text-sm
          
          ">
            {multiple ?
              value?.map(v => (
                <button
                  key={v}
                  onClick={e => {
                    e.stopPropagation();
                    selectOption(v);
                  }}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1
                 bg-gray-200 text-gray-900
                  `}>
                  {getOption(v) !== null ? getOption(v)?.[optionLabel] : ""}
                  <span className="text-sm font-semibold">&times;</span>
                </button>
              ))
              :
              value.map(v => (
                getOption(v) ? `${getOption(v)?.[optionLabel]} ${optionDesc && (getOption(v)?.[optionDesc]) ? ` | ${getOption(v)?.[optionDesc]}` : ""}` : ""
              )
              )
            }
          </span>
          <button
            onClick={e => {
              e.stopPropagation();
              clearOptions();
            }}
            className="bg-transparent text-red-600 border-none outline-none cursor-pointer p-0 text-md hover:text-red-700">&#215;</button>
          <div className="w-px bg-gray-500 self-stretch"></div>
          <div className=" text-gray-600"><AiFillCaretDown size={25} /></div>
        </div>
        <ul className={` absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-auto z-10 ${isOpen ? 'block' : 'hidden'}`}>
          <Input
            onBlur={() => {
              setSearchIsFocus(false);
              if (containerRef.current) containerRef.current.focus();
            }}
            onChange={(v) => handleSearchOnChange(v as string)}
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            placeholder="search.."
            className="block w-full px-4 py-2 text-gray-700 bg-white border-0 rounded-md focus:ring-transparent focus:border-blue-500" />
          {
            processOptions().map((option) => (
              <li
                onMouseEnter={() => setSelectedValue(option[optionValue])}
                onClick={e => {
                  e.stopPropagation();
                  selectOption(option[optionValue]);
                  setIsOpen(false);
                }}
                key={option[optionValue]}
                className={`px-4 py-2 text-gray-800 cursor-pointer hover:bg-blue-500 hover:text-white ${isOptionSelected(option[optionValue]) ? 'bg-blue-300' : ''
                  } ${option[optionValue] === selectedValue ? 'bg-blue-500 text-white' : ''
                  }`}>
                {option[optionLabel]}{optionDesc && (option[optionDesc]) ? ` | ${option[optionDesc]}` : ""}
              </li>
            ))
          }
        </ul>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  )
}
