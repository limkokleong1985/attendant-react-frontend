import React, { useState } from 'react'
import useGeneralSetting from '../hook/useGeneralSetting'
import { ShowSideBarMenu } from './sidebar/ShowSideBarMenu'
import SideBar from './sidebar/SideBar'

import { BiMenu } from 'react-icons/bi';
import SimpleTable, { TableColumns, TableRowAction } from './table/SimpleTable'
import TopBar from './TopBar'
import order from '../data/order'
import Badge, { BadgeType } from './others/Badge';
import Modal from './modal/Modal'
import DragSort, { ColumnType, DragItemColumnType } from './dragNDrop/DragSort';
import TestDrag from './TestDrag';

type OrderType = {
  id: number,
  name: string,
  email: string,
  date: string,
  address: string,
  shippingType: string,
  status: string,
  amount: number
}

const columns: TableColumns<OrderType> = [
  {
    id: 0,
    dataField: "id",
    label: "ID",
  },
  {
    id: 1,
    dataField: "name",
    label: "Name",
    description: "Person who order."
  },
  {
    id: 3,
    dataField: "email",
    label: "Email",
    description: "Person email."
  },
  {
    id: 4,
    dataField: "date",
    label: "Date",
  },
  {
    id: 5,
    dataField: "shippingType",
    label: "Shipping",
  },
  {
    id: 6,
    dataField: "status",
    label: "Status",
    formatter: (item) => {
      let status: BadgeType = "danger"
      switch (item) {
        case "success":
          status = "success"
          break;
        case "hold":
          status = "danger"
          break;
        case "processing":
          status = "warning"
          break;
        default:
          status = "warning"
      }
      return (
        <Badge type={status} size={9} >
          {item}
        </Badge>
      )
    }
  },
  {
    id: 7,
    dataField: "amount",
    label: "Amount",
  }
]

export default function MainDashboard() {
  const { useStore } = useGeneralSetting()
  const [data, setData] = useState(order)
  const [toggle] = useStore((s) => s.openSideMenu)
  const [select] = useStore((s) => s.selectedProject)
  const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState(<></>)




  const tableAction: TableRowAction<OrderType> = (Item) => {
    return [
      {
        menuItem: ({ active }) => (
          <div>
            Edit Name
          </div>
        ),
        onClick: () => {
          setModalContent(<>
            <h3>Edit Name</h3>
          </>)
          setIsOpen(true)
        },
      },
      {
        menuItem: ({ active }) => (
          <div>
            Edit Email
          </div>
        ),
        onClick: () => {
          setModalContent(<>
            <h3>Edit Email</h3>
          </>)
          setIsOpen(true)
        },
      },
      {
        menuItem: ({ active }) => (
          <div>
            Edit Shipping
          </div>
        ),
        onClick: () => {
          setModalContent(<>
            <h3>Edit Shipping</h3>
          </>)
          setIsOpen(true)
        },
      }
    ]
  }


  return (
    <div>
      <Modal isOpen={isOpen} size="full" top={true} closeModal={() => { setIsOpen(false) }} >
        {modalContent}
      </Modal>
      <div className='h-screen w-full  bg-gray-100 dark:bg-gray-600 '>
        <div className='flex'>

          <div className={`md:left-0 left-[-100%]  z-20 ${toggle ? "md:fixed " : "fixed md:static"}`}>
            <SideBar />
          </div>

          <div className={`h-screen m-0  z-10 flex fixed flex-grow-0 flex-col dark:bg-gray-700 dark:text-gray-300 bg-gray-200  text-gray-700  shadow-lg ease-in-out duration-500
          ${toggle ? "md:w-[30%] flex-shrink-0 border-gray-900 border-r-2   md:static  w-[100%] pl-20 py-3 pr-3" : "w-0"}
          `}>
            <ShowSideBarMenu item={select} />


          </div>


          <div className={` flex-auto flex-col flex h-screen flex-grow-0
          ${toggle ? "w-[calc(100%-4rem)] md:w-[70%] " : "md:w-[calc(100%-4rem)] w-[100%]"}
          `} >
            <div className={`flex gap-2 w-[100%]  pl-5 justify-between bg-gray-300 dark:bg-gray-700 items-center h-16 mx-auto px-4 border-b-2 border-gray-600 dark:border-gray-900`}>

              <TopBar />
            </div>
            <div className='p-3 overflow-x-hidden h-full'>
              {/* <SimpleTable
                title="Order"
                multiplePick={(items) => { }}
                defaultSort={columns[0].dataField}
                tableAction={tableAction}
                columns={columns}
                data={data} /> */}
              <TestDrag />

            </div>
          </div>

        </div>



      </div>
    </div>
  )
}
