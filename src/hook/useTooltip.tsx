import React, { createContext, useState, useEffect } from 'react'

const TooltipContext = createContext<UseToolTip | null>(null)

type UseToolTip = {
  setTooltip: React.Dispatch<React.SetStateAction<TooltipContent | null>>,
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}

export type TooltipContent = {
  title: string,
  description: string
}

function useTooltip(tooltipContent: (TooltipContent | null)) {
  const [tooltip, setTooltip] = useState(tooltipContent)
  const [show, setShow] = useState<boolean>(false)
  const [showTime, setShowTime] = useState<number>(5000)
  return {
    tooltip,
    setTooltip,
    show,
    setShow,
    showTime,
    setShowTime
  }
}


function ProviderTooltip({ children }: { children: React.ReactNode }): React.ReactElement {
  const {
    tooltip,
    setTooltip,
    show,
    setShow,
    showTime
  } = useTooltip(null)
  const [showing, setShowing] = useState<boolean>(false)
  useEffect(() => {
    setShowing(true);
    let timeoutId: (number | null) = null
    if (show) {
      timeoutId = setTimeout(() => {
        setShowing(false);
      }, showTime);


    }
    return () => { if (timeoutId) clearTimeout(timeoutId) };
  }, [show, showTime])

  return (
    <TooltipContext.Provider value={{ setTooltip, setShow }}>
      {children}
      <span className={`fixed   bottom-0 w-auto p-2 m-2 min-w-min max-w-xl left-16 rounded-md
    shadow-md text-white bg-gray-900 text-xs font-bold
    transition-all duration-300 z-30  origin-left 
      ${show && showing ? "scale-100" : "scale-0"}
      `}>
        <h3>{tooltip?.title}</h3>
        <div className=' border-b-2 border-gray-100'></div>
        <div></div>
        {tooltip?.description}
      </span>
    </TooltipContext.Provider>
  )
}

export {
  ProviderTooltip,
  TooltipContext
}




