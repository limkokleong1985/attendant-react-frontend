import React, { ReactElement, useState, useEffect } from 'react';
import { SideBarItemMenu } from '../../hook/useGeneralSetting';
import { AiFillCaretLeft } from 'react-icons/ai';
import useGeneralSetting from '../../hook/useGeneralSetting';

export function ShowSideBarMenu({ item }: { item?: (SideBarItemMenu) }): ReactElement {
  const [show, setShow] = useState(false)
  const { useStore } = useGeneralSetting();
  const [toggle, setToggle] = useStore((store) => store.openSideMenu)

  useEffect(() => {
    setShow(false);
    let timeoutId: (number | null) = null
    if (toggle) {
      timeoutId = setTimeout(() => {
        setShow(true);
      }, 500);


    }
    return () => { if (timeoutId) clearTimeout(timeoutId) };
  }, [toggle])

  const handleToggle = () => {
    setToggle({ openSideMenu: false })
  }

  if (!item) return <></>
  return (
    <>
      {
        show ? <div >
          <div className=' font-bold text-lg border-b-2 dark:border-gray-300 border-gray-700 flex'>
            <h3 className=' w-full' >{item?.projectName}</h3><AiFillCaretLeft
              onClick={handleToggle} className='text-gray-700 hover:text-primary-900 dark:text-gray-300 hover:dark:text-primary-900 hover:scale-110' size={25} />
          </div>
          <div className=''>{item?.description}</div>
        </div> : <></>
      }
    </>

  );
}
