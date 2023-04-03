import React from 'react'
import _ from 'lodash';
import Select from '../input/Select';
import { BiChevronsLeft, BiChevronsRight, BiGridSmall } from 'react-icons/bi'

const buttonClass = ` px-2 border-y-2 border-gray-300 shadow-md`
const buttonClassDisbled = `bg-white  text-gray-500`
const buttonClassActive = `bg-primary-900  text-gray-100`
const buttonClassNormal = `hover:bg-gray-400 bg-white  text-gray-900`

export default function Pagination({ itemCount, pageSizeOption, pageSize, currentPage, onPageChange, setPageSize }:
  {
    itemCount: number,
    pageSize: number,
    currentPage: number,
    onPageChange: (currentP: number) => void,
    setPageSize: (pageSize: number) => void,
    pageSizeOption: number[]
  }) {

  if (!itemCount) return <></>
  const pagesCount = Math.ceil(itemCount / pageSize);

  const pages = _.range(1, pagesCount + 1);

  const optionsShow = (itemCount: number) => {
    let options = []
    if (!pageSizeOption) return []
    pageSizeOption.forEach(p => {
      if (itemCount > p) {
        options.push({ label: p, name: p })
      }
    })
    if (pageSizeOption.length) {
      if (itemCount < pageSizeOption[pageSizeOption.length - 1]) {
        options.push({ label: 'All', name: itemCount })
      }
    }

    return options
  }

  const handlePageSizeChange = (pageSize: number) => {
    if (currentPage * pageSize > itemCount) {
      onPageChange(Math.ceil(itemCount / pageSize))
    }
    setPageSize(pageSize)
  }

  const renderPreviousButton = () => {

    return <button key={0} className={` rounded-l-md  border-l-2 w-[100%]
    ${buttonClass}
    ${currentPage === 1 ?
        buttonClassDisbled :
        buttonClassNormal}`}
      disabled={currentPage === 1}
      onClick={currentPage === 1 ? () => { } : () => { onPageChange(currentPage - 1) }}
    >
      <BiChevronsLeft className='hidden md:block' size={15} />
      <span className='md:hidden'>PREVIOUS</span>
    </button>
  }

  const renderPagesButton = () => {

    return pages.map((page) => {
      if (page === 1 || (currentPage < 5 && page <= 5)
        || (page >= currentPage - 2 && page <= currentPage + 2)
        || (page == pagesCount)) {
        return (<button key={page}
          onClick={() => { onPageChange(page) }}
          disabled={page === currentPage}
          className={` ${buttonClass}
        ${page === currentPage ?
              buttonClassActive
              :
              buttonClassNormal} md:rounded-none md:border-x-0 ${page === 1 && "rounded-l-md border-l-2 "} ${page === pagesCount && "rounded-r-md border-r-2"}`}>
          {page}
        </button>)
      } else if (page === 2
        || (currentPage <= 4 && page == 7 && pagesCount > 7)
        || (currentPage >= 5 && page == currentPage + 3 && pagesCount > currentPage + 2)) {
        return (<button key={page}
          disabled={true}
          className={` ${buttonClass}
          ${buttonClassDisbled} `
          }>
          <BiGridSmall size={15} />
        </button>)
      }

    })

  }
  const renderNextButton = () => {
    return <button key={pagesCount + 1}
      onClick={currentPage === pagesCount ? () => { } : () => { onPageChange(currentPage + 1) }}
      disabled={currentPage === pagesCount}
      className={`  rounded-r-md border-r-2 w-[100%]
      ${buttonClass}
      
      ${currentPage === pagesCount ?
          buttonClassDisbled :
          buttonClassNormal
        }`}>
      <BiChevronsRight className='hidden md:block' size={15} />
      <span className='md:hidden'>NEXT</span>
    </button>
  }

  return (
    <>
      <div className="flex flex-col items-center md:flex-row justify-between py-2 flex-wrap gap-2">
        {
          itemCount <= pageSize ? <></> : <>
            <div className={`${(!pagesCount || pagesCount === 1) ? "hidden" : "flex flex-row"} hidden md:flex `}>
              {renderPreviousButton()}
              {renderPagesButton()}
              {renderNextButton()}

            </div>

            <div className={`${(!pagesCount || pagesCount === 1) ? "hidden" : "flex flex-row"} w-[100%] gap-2 items-center flex flex-col md:hidden `}>
              <div className={` flex w-[100%] `}>
                {renderPreviousButton()}
                {renderNextButton()}
              </div>
              <div className={` flex `}>
                {renderPagesButton()}
              </div>



            </div>
          </>
        }

        {
          itemCount <= 3 ? <></> :
            <div

              className={`text-left md:text-right`}
            >

              <Select label="Size:" value={pageSize >= itemCount ? itemCount : pageSize} onChange={(value) => {
                handlePageSizeChange(Number(value))
              }} optionName='name' options={optionsShow(itemCount)} />


            </div>
        }

      </div>


    </>

  )

}

