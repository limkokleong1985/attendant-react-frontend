import React, { ReactElement, useEffect } from 'react'
import { BsBrightnessHighFill, BsFillEmojiSunglassesFill, BsFillMoonFill } from 'react-icons/bs'
import { AiOutlineMenu } from 'react-icons/ai'
import useGeneralSetting from '../hook/useGeneralSetting'
import DropDownMenu, { ItemMenu } from './DropdownMenu'

const items: ItemMenu[] = [
  {
    menuItem: ({ active }) => (
      <>
        <p className="text-sm leading-5 w-[100%]">Signed in as</p>
        <p className="text-sm font-medium leading-5 truncate">
          tom@example.com
        </p>
      </>
    ),
    disabled: true,
    divide: true
  }, {
    menuItem: ({ active }) => (
      <>Test</>
    ),
    onClick: () => { console.log("Clicked Test") },
  },

]


export default function TopBar() {
  const { useStore } = useGeneralSetting()
  const [toggle, setToggle] = useStore((store) => store.openSideMenu)
  const [theme, setTheme] = useStore((s) => s.themeMode)
  useEffect(() => {
    const body = document.querySelector('body');
    if (theme === 'dark') {
      body?.classList.add('dark');
    } else {
      body?.classList.remove('dark');
    }
  }, [theme]);



  return (
    <>
      <AiOutlineMenu onClick={() => { setToggle({ openSideMenu: true }) }} className='md:hidden dark:text-gray-300 hover:dark:text-primary-800 hover:scale-110' size={25} />
      <div className=' mx-auto md:w-full text-2xl font-bold text-primary-800'>CrocPix</div>

      <div className='flex '>
        <div className='relative text-gray-900 dark:text-gray-300 flex items-center w-6 mx-3 h-auto hover:text-primary-800 hover:dark:text-primary-800 transition-all duration-300 ease-linear;'>
          {
            theme === 'dark' ?
              <BsBrightnessHighFill onClick={() => setTheme({ themeMode: "" })} size={20} /> :
              <BsFillMoonFill onClick={() => setTheme({ themeMode: "dark" })} size={20} />
          }
        </div>
        <DropDownMenu items={items} >
          {
            ({ open }) => <TopBarIcon open={open} icon={<BsFillEmojiSunglassesFill size={20} />} />
          }
        </DropDownMenu>
      </div>
    </>

  )
}

const TopBarIcon = ({ icon, open }: { icon: ReactElement, open: boolean }): ReactElement => {
  return (
    <div className={`relative flex items-center 
    justify-center h-12 w-12 mx-3 border-2 border-gray-600 shadow-lg rounded-3xl
    transition-all duration-300 ease-linear
    ${open ?
        `bg-gray-800 hover:bg-gray-300 text-primary-800
      hover:text-gray-900 `
        :
        `bg-gray-300 hover:bg-gray-800 text-gray-900
      hover:text-primary-800  `}
    `}>
      {icon}
    </div>
  )
}