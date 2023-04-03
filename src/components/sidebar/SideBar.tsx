import React, { ReactElement, useContext, useState } from 'react'
import { IconType } from 'react-icons';
import { TooltipContext } from '../../hook/useTooltip';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import useGeneralSetting, { SideBarItemMenu } from '../../hook/useGeneralSetting';
import { ShowSideBarMenu } from './ShowSideBarMenu';

const projects = [
  {
    projectId: 1,
    projectName: "Unition",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid enim, culpa placeat inventore vel dicta fuga, quam velit sequi nulla ex eius officia, rem incidunt mollitia eos repellendus rerum molestias!",
    icon: {
      iconType: "Ai",
      iconName: "AiFillAndroid"
    }
  },
  {
    projectId: 2,
    projectName: "Yun Da",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid enim, culpa placeat inventore vel dicta fuga, quam velit sequi nulla ex eius officia, rem incidunt mollitia eos repellendus rerum molestias!",
    icon: {
      iconType: "Bs",
      iconName: "BsTruck"
    }
  },
  {
    projectId: 3,
    projectName: "Amazon",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid enim, culpa placeat inventore vel dicta fuga, quam velit sequi nulla ex eius officia, rem incidunt mollitia eos repellendus rerum molestias!",
    icon: {
      iconType: "Ai",
      iconName: "AiFillAmazonCircle"
    }
  }
]

export default function SideBar(): ReactElement {

  const { useStore } = useGeneralSetting();
  const [toggle, setToggle] = useStore((store) => store.openSideMenu)
  const [select, setSelected] = useStore((store) => {
    return store.selectedProject
  })

  const handleOnclick = (item: SideBarItemMenu) => {
    setSelected({ selectedProject: item })
    if (toggle && select?.projectId === item.projectId) {
      setToggle({ openSideMenu: false })
    } else {
      setToggle({ openSideMenu: true })
    }

  }

  return (
    <div className=''>

      <div className='top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white shadow-lg'>
        <SideBarIcon handleOnclick={handleOnclick} selected={select.projectId === 0} item={{
          projectId: 0,
          projectName: "HOME",
          description: "",
          icon: { iconType: "Fa", iconName: "FaFire" }
        }} />
        <div className=' border-b-2 mx-4 border-gray-400'></div>
        <div className=' relative overflow-x-hidden scrollbar-w-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-600 scrollbar-thumb-rounded-md '>

          {projects.map((project, index) => <SideBarIcon key={index}
            selected={select.projectId === project.projectId}
            handleOnclick={handleOnclick} item={project} />)}
        </div>

        <div className='border-b-2 mx-4 border-gray-400'></div>
        <SideBarIcon selected={select.projectId === -1} handleOnclick={handleOnclick} item={{
          projectId: -1,
          projectName: "Add New Project",
          description: "",
          icon: { iconType: "Bs", iconName: "BsPlus" }
        }} />

      </div>

    </div>

  )
}


function getIconComponent(iconType: string, iconName: string): IconType {
  const iconMap: Record<string, any> = {
    Ai: AiIcons,
    Bs: BsIcons,
    Fa: FaIcons,
  };
  const IconComponent = iconMap[iconType][iconName];

  if (!IconComponent) {
    throw new Error(`Invalid iconType "${iconType}" or iconName "${iconName}"`);
  }

  return IconComponent;
}

const SideBarIcon = ({ item, handleOnclick, selected }: { item: SideBarItemMenu, handleOnclick: (item: SideBarItemMenu) => void, selected: boolean }): ReactElement => {
  const IconComponent = getIconComponent(item.icon.iconType, item.icon.iconName);
  const { setTooltip, setShow } = useContext(TooltipContext)!
  return (
    <div onMouseEnter={item.projectName && setTooltip ? () => {
      setTooltip({
        title: item.projectName,
        description: item.description
      });
      setShow(true)
    } : () => { }}
      onMouseLeave={setShow ? () => setShow(false) : () => { }}
      className={`${selected ? `relative flex items-center 
      justify-center h-12 w-12 mt-2 mb-2 mx-auto shadow-lg
      bg-primary-900 text-secondary-900
      hover:text-third-900 rounded-xl 
      transition-all duration-300 ease-linear`
        :
        `relative flex items-center 
      justify-center h-12 w-12 mt-2 mb-2 mx-auto shadow-lg
      bg-gray-800 text-third-900 hover:bg-third-900
      hover:text-gray-100 rounded-3xl hover:rounded-xl
      transition-all duration-300 ease-linear` }`}
      onClick={() => handleOnclick(item)}
    >
      <IconComponent size="28" />

    </div>
  )
}