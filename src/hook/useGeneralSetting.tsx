import React from 'react'
import useFastContext from './useFastContext'

export type SideBarItemMenu = {
  projectId: number,
  projectName: string,
  description: string,
  icon: {
    iconType: string,
    iconName: string
  }

}

export type GeneralSettingData = {
  openSideMenu: boolean,
  selectedProject: SideBarItemMenu,
  themeMode: ("dark" | "")
}
const { ProviderStore, useStore } = useFastContext<GeneralSettingData>({
  openSideMenu: false,
  selectedProject: {
    projectId: 0,
    projectName: "HOME",
    description: "",
    icon: {
      iconType: "Fa",
      iconName: "AiFillAndroid"
    }
  },
  themeMode: "dark",
})
export default function useGeneralSetting() {

  return {
    ProviderStore,
    useStore
  }
}
