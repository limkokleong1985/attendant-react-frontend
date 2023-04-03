import React, { useState, useEffect, useContext } from 'react'
import Input from '../input/Input'
import Pagination from './Pagination'
import { RxCaretUp, RxCaretDown } from "react-icons/rx"
import { AiOutlineEllipsis, AiFillSetting, AiFillEyeInvisible, AiFillEye } from "react-icons/ai"
import { BiMenu } from 'react-icons/bi';
import { BsFilter } from "react-icons/bs"
import _ from "lodash"
import DropDownMenu, { ItemMenu } from '../DropdownMenu'
import Checkbox from './../input/Checkbox';
import { TooltipContext } from '../../hook/useTooltip'
import Select, { OptionType } from '../input/Select'
import TailwindDisclosure from '../others/TailwindDisclosure'
import CloseButton from './../input/CloseButton';
import MultipleSelect, { OptionType as MultipleOptionType } from '../input/MultipleSelect'
import DragSort, { DragChildrenFn, DragItemColumnType } from '../dragNDrop/DragSort'
import { sortByArraySequence, updateArrayProperties } from '../../helper/Util'
import { DraggableStateSnapshot, DraggableProvided, DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';

export type TableColumns<Item> = {
  id: number,
  dataField: keyof Item,
  label: string,
  description?: string
  disableSort?: boolean,
  formatter?: (item: Item[keyof Item]) => React.ReactElement
}[]

export type TableRowAction<Item> = (item: Item) => ItemMenu[]

type FilterRow<Item> = {
  [K in keyof Item]?: string;
}

type TableSetting = {
  disableSearchBox: boolean,
  disbaleColFilter: boolean,
  disableColSort: boolean,
  disableMultipleSelect: boolean,
  disableRowAction: boolean,
  defaultItemsShow: number,
  hideColumns: Set<string | number>
}

const tableS: TableSetting = {
  disableSearchBox: false,
  disbaleColFilter: false,
  disableColSort: false,
  disableMultipleSelect: false,
  disableRowAction: false,
  defaultItemsShow: 3,
  hideColumns: new Set([])
}

type DragItemColumnTypeExtend<T extends string, Item> = DragItemColumnType<T, Item> & {
  dataField: string
}

type ItemDragDisplay = {
  text: string,
  isHide: boolean,
  onHideChange: (v: boolean) => void
}


const RowSortingItemFn: DragChildrenFn<ItemDragDisplay> = (provided, snapshot, item: ItemDragDisplay) => {

  return (
    <div
      className={` py-4 flex  shadow text-sm border-b-2 
      bg-gray-100 dark:bg-gray-600
      ${item.isHide ? ` text-red-700` : `text-gray-700 dark:text-gray-300`} 
      ${snapshot.isDragging ? `border-2 rounded-md
      border-gray-400` : ''}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <span className='px-2 dark:hover:text-gray-500 hover:text-gray-600' {...provided.dragHandleProps}><BiMenu size={20} /></span>
      <div className=' flex w-full justify-between'>
        <span>{item.text}</span>
        <button className={`cursor-pointer rounded-md mx-2
        hover:text-indigo-500  `} onClick={() => { item.onHideChange(!item.isHide) }} >
          {
            item.isHide ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />
          }
        </button>



      </div>
    </div>
  )
}


export default function SimpleTable<Item>({ title, data, multiplePick, tableAction, columns, defaultSort }:
  {
    title: string,
    data: Item[],
    columns: TableColumns<Item>,
    defaultSort: keyof Item,
    tableAction?: TableRowAction<Item>,
    multiplePick?: (set: Set<Item>) => void
  }): React.ReactElement {

  const { setTooltip, setShow } = useContext(TooltipContext)!
  const [tableSetting, setTableSetting] = useState(tableS)
  const [enableTableSetting, setEnableTableSetting] = useState(false)
  const [selected, setSelected] = useState<Set<Item>>(new Set())
  const [selectedCondition, setSelectedCondition] = useState<"" | "checked" | "indeterminate">("")
  const [currentFilter, setCurrentFilter] = useState<keyof Item | null>(null)
  const [filterRow, setFilterRow] = useState<FilterRow<Item>>({})
  const [enableMultiSelect, setEnableMultiSelect] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemMaxCount, setItemMaxCount] = useState(data.length)
  const [pageSize, setPageSize] = useState(3)
  const [search, setSearch] = useState("")
  const [pageData, setPageData] = useState(data)
  const [sortColumn, setSortColumn] = useState<keyof Item>(defaultSort)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [rowSort, setRowSort] = useState<DragItemColumnTypeExtend<"colId", ItemDragDisplay>[]>([])
  const [tableCol, setTableCol] = useState(columns)


  const hideOptions: () => MultipleOptionType<"value", "label", "">[] = () => {
    let col: MultipleOptionType<"value", "label", "">[] = []
    tableCol.forEach(c => {
      col.push({
        value: c.dataField as string,
        label: c.label as string
      })
    })

    return col
  }


  const handleTableSetting = (changes: TableSetting) => {
    setPageSize(changes.defaultItemsShow)
    setTableSetting(changes)
  }

  const handleEableMultiple = () => {
    handleRemoveAllSelected()
    setEnableMultiSelect(c => !c)
  }

  const handleAddSelected = (item: Item) => {
    setSelected(new Set(([...selected, item])))
    if (multiplePick) multiplePick(new Set(([...selected, item])))
  }

  const handleSelectAll = () => {
    setSelected(new Set(pageData))
    if (multiplePick) multiplePick(new Set(pageData))
  }

  const handleRemoveSelected = (item: Item) => {

    setSelected(s => {
      s.delete(item);
      if (multiplePick) multiplePick(new Set(s))
      return new Set(s)
    })
  }
  const handleRemoveAllSelected = () => {
    setSelected(new Set())
    if (multiplePick) multiplePick(new Set())
  }

  const handleRowSort = (v: DragItemColumnTypeExtend<"colId", ItemDragDisplay>[]) => {
    setRowSort(v)
    let hideColumns = new Set(tableSetting.hideColumns)
    v.forEach(r => {

      if (r.colId === "col_1_show" && hideColumns.has(r.dataField)) {
        hideColumns.delete(r.dataField)
      }
      if (r.colId === "col_1_hide") {
        hideColumns.add(r.dataField)
      }
    })
    handleTableSetting({ ...tableSetting, hideColumns })
    //console.table(v)
    setTableCol(c => {

      return sortByArraySequence(c, v)
    })
  }

  useEffect(() => {
    const colRow: DragItemColumnTypeExtend<"colId", ItemDragDisplay>[] = tableCol.map((c, index) => ({

      colId: `col_1_${tableSetting.hideColumns.has(c.dataField as string) ? "hide" : "show"}`,
      id: c.id,
      dataField: c.dataField as string,
      children: RowSortingItemFn,
      childrenItem: {
        text: c.label as string,
        isHide: tableSetting.hideColumns.has(c.dataField as string),
        isFirst: index === 0,
        isLast: index === (tableCol.length - 1),
        onHideChange: (v) => {
          let hideColumns = new Set(tableSetting.hideColumns)
          if (!v && hideColumns.has(c.dataField as string)) {
            hideColumns.delete(c.dataField as string)
          } else if (v && !hideColumns.has(c.dataField as string)) {
            hideColumns.add(c.dataField as string)
          }
          handleTableSetting({ ...tableSetting, hideColumns })
        }
      }
    }))
    setRowSort(colRow)
  }, [tableSetting, tableCol])

  useEffect(() => {
    setCurrentFilter(null)
    handleRemoveAllSelected()
    setFilterRow({})
    setEnableMultiSelect(false)
    setSearch("")
  }, [enableTableSetting])

  useEffect(() => {

    if (selected.size >= pageData.length) {
      setSelectedCondition("checked")
    } else if (selected.size === 0) {
      setSelectedCondition("")
    } else {
      setSelectedCondition("indeterminate")
    }
  }, [selected, selectedCondition])

  useEffect(() => {
    setSelected(new Set())
    if (multiplePick) multiplePick(new Set())
    let filterData = data;
    if (search) {
      filterData = filterData.filter(d => {
        let result = null;
        for (let keyName in d) {

          result = result || typeof d[keyName] === 'string' && (d[keyName] as string).toLowerCase().includes(search.toLowerCase());

        }

        return result
      });

    }

    for (let keyName in filterRow) {
      if (!filterRow[keyName]) continue
      filterData = filterData.filter(d => {
        let result = null;
        result = result || filterRow[keyName] && typeof d[keyName] === 'string' && (d[keyName] as string).toLowerCase().includes((filterRow[keyName] as string).toLowerCase());
        return result
      })


    }

    setItemMaxCount(filterData.length)
    const sorted = _.orderBy(filterData, [r => typeof r[sortColumn] == "string" ? String(r[sortColumn]).toLowerCase() : r[sortColumn]], [sortOrder])
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const filteredData = sorted.slice(startIndex, endIndex)
    setPageData(filteredData)
  }, [JSON.stringify(filterRow), search, currentPage, pageSize, sortColumn, sortOrder, data])


  const hanldSort = (sortKey: keyof Item) => {
    if (sortColumn === sortKey) {
      return setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }
    setSortColumn(sortKey)
    setSortOrder("asc")
  }

  const tableSettingDropdownAction = () => {
    let options = []
    if (multiplePick && !tableSetting.disableMultipleSelect) {
      options.push({
        menuItem: ({ }) => (
          <div >
            {enableMultiSelect ? "Disable Mutiple" : "Multiple Select"}
          </div>
        ),
        onClick: () => {
          handleEableMultiple()
        },
        divide: true
      })
    }
    options.push({
      menuItem: ({ }) => (
        <div >
          Table Setting
        </div>
      ),
      onClick: () => {
        setEnableTableSetting(true)
      }
    })
    return options
  }

  const pageSizeOption = [3, 5, 10, 20, 50, 100]

  const pageOptionSetting = () => {
    let option: OptionType<"qty">[] = []
    pageSizeOption.forEach(p => {
      option.push({ label: `${p}` as string, qty: p })
    })
    return option
  }

  return (
    <div>
      <div>
        {enableTableSetting ? <></> : <DropDownMenu className=' float-right' items={tableSettingDropdownAction()}>
          {
            ({ open }) => (<AiFillSetting className='
            text-gray-500 dark:text-gray-400 
            hover:border-gray-800 hover:dark:border-gray-200
            hover:text-gray-900 hover:dark:text-gray-100' size={20} />)
          }

        </DropDownMenu>}
        <h4 className=' font-semibold uppercase dark:text-gray-300 border-b-2
       border-gray-400'>{title}</h4>

      </div>

      {
        enableTableSetting ?
          <div className=' my-2 p-2 rounded-md border-2
          dark:text-gray-300
          dark:border-gray-400 border-gray-400
          transition-all duration-300 ease-linear
          
          ' >

            <CloseButton className=' float-right'
              onClick={() => {
                setEnableTableSetting(false)
              }}
            />
            <h5 className=' font-semibold border-b-2
              dark:border-gray-400 border-gray-400
              '>Table Setting</h5>

            <TailwindDisclosure contents={[
              {
                title: "General Setting",
                content: ({ open }) => {
                  return (<div className=' flex-col gap-2 py-2'>
                    <Checkbox value={tableSetting.disableSearchBox ? "checked" : ""} onChange={(v) => { handleTableSetting({ ...tableSetting, disableSearchBox: v === "checked" }) }}  >
                      Disbale Search Box
                    </Checkbox>
                    <Checkbox value={tableSetting.disbaleColFilter ? "checked" : ""} onChange={(v) => { handleTableSetting({ ...tableSetting, disbaleColFilter: v === "checked" }) }}  >
                      Disbale Column Filter
                    </Checkbox>
                    <Checkbox value={tableSetting.disableColSort ? "checked" : ""} onChange={(v) => { handleTableSetting({ ...tableSetting, disableColSort: v === "checked" }) }}  >
                      Disbale Column Sorting
                    </Checkbox>
                    <Checkbox value={tableSetting.disableMultipleSelect ? "checked" : ""} onChange={(v) => { handleTableSetting({ ...tableSetting, disableMultipleSelect: v === "checked" }) }}  >
                      Disbale Multiple Select
                    </Checkbox>
                    <Checkbox value={tableSetting.disableRowAction ? "checked" : ""} onChange={(v) => { handleTableSetting({ ...tableSetting, disableRowAction: v === "checked" }) }}  >
                      Disbale Row Action
                    </Checkbox>
                    <Select optionName='qty' label='Default Items Show' value={tableSetting.defaultItemsShow} options={pageOptionSetting()} onChange={(v) => { handleTableSetting({ ...tableSetting, defaultItemsShow: Number(v) }) }} />
                  </div>
                  )
                }
              },
              {
                title: `${title} Table Setting`,
                content: ({ open }) => {

                  return (
                    <div className=' flex-col gap-2 py-2'>
                      <DragSort<"colId", ItemDragDisplay, DragItemColumnTypeExtend<"colId", ItemDragDisplay>>
                        columns={[{
                          id: "col_1_show", type: "sort_table",
                          children: (provided, snapshot, dragChildren) => {
                            return (
                              <div
                                className={`border-2 rounded-t-md border-gray-500`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                <div className=' p-2 bg-gray-500 text-gray-300 text-md'>
                                  <span>Show Column Table</span>
                                </div>
                                <div className=' last:border-b-0'>

                                  {dragChildren}
                                  {provided.placeholder}
                                </div>
                              </div>

                            )
                          }
                        }, {
                          id: "col_1_hide", type: "sort_table",
                          children: (provided, snapshot, dragChildren) => {
                            return (
                              <div
                                className={`border-2 rounded-b-md border-gray-500`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                <div className=' p-2 bg-gray-500 text-gray-300 text-md'>
                                  <span>Hide Column Table</span>
                                </div>
                                <div>

                                  {dragChildren}
                                  {provided.placeholder}
                                </div>
                              </div>

                            )
                          }
                        }]}
                        items={rowSort}
                        onChange={handleRowSort}
                        columnIdName="colId"
                      />
                    </div>
                  )
                }
              }
            ]} />

          </div>
          :
          <>

            <div className='py-2 flex gap-2'>
              {
                !tableSetting.disableSearchBox &&
                <Input className=' w-[100%]' type='text' value={search} placeholder="Search.." onChange={(val) => { setSearch(`${val}`) }} />
              }

            </div>

            <div className=' relative overflow-y-hidden scrollbar-thin scrollbar-thumb-rounded-md scrollbar-h-1 md:scrollbar-h-2 rounded-lg  shadow-md
      scrollbar-thumb-gray-500 scrollbar-track-neutral-200 
      dark:scrollbar-thumb-gray-300 dark:scrollbar-track-neutral-700 
      '>

              <table className=' w-full h-full'>
                <thead className=' bg-gray-300 border-b-2 border-primary-900 text-gray-700
          dark:bg-gray-900 dark:text-gray-200 
          '>
                  <tr className=''>
                    {
                      !tableSetting.disableMultipleSelect && enableMultiSelect && (
                        <th className={`p-3
                          text-sm font-semibold tracking-wide text text-left`}>
                          <Checkbox value={selectedCondition} onChange={(v) => {
                            if (v === "checked") {
                              handleSelectAll()
                            } else {
                              handleRemoveAllSelected()
                            }
                          }} />
                        </th>
                      )
                    }
                    {
                      tableCol.map((column, index) => {
                        if (!tableSetting.hideColumns.has(column.dataField as string))
                          return <th key={index}

                            onMouseEnter={column.description && setTooltip ? () => {
                              setTooltip({
                                title: column.label,
                                description: column.description ? column.description : ""
                              });
                              setShow(true)
                            } : () => { }}
                            onMouseLeave={setShow ? () => setShow(false) : () => { }}
                            onClick={() => column.disableSort || tableSetting.disableColSort ? null : hanldSort(column.dataField)} className={`p-3
                        ${(column.disableSort && tableSetting.disableColSort) || tableSetting.disbaleColFilter ? "" : "hover:dark:bg-gray-600 group hover:bg-gray-400 cursor-pointer"}
                    text-sm font-semibold tracking-wide text text-left content-between`}>
                            <div className=' flex flex-row'>
                              <span>{column.label}</span>
                              {
                                !tableSetting.disableColSort && column.dataField === sortColumn ?
                                  sortOrder === "asc" ? <RxCaretDown size={20} /> : <RxCaretUp size={20} />
                                  : <></>
                              }
                              <div className=' flex-grow'><BsFilter className=' 
                      scale-0 group-hover:scale-100 float-right
                      transition-all duration-100 ease-linear
                      hover:border-2
                      ' size={20} onClick={e => {
                                  e.stopPropagation()
                                  setCurrentFilter(column.dataField)
                                }} /></div>
                            </div>
                            {
                              currentFilter === column.dataField ?
                                <Input className=' text-gray-800' value={(filterRow[column.dataField] ? filterRow[column.dataField] : "") as string}
                                  enableAutoFocus={true}
                                  callbackEnd={() => {
                                    setCurrentFilter(null)
                                  }}
                                  onChange={(v) => {
                                    setFilterRow(current => {
                                      return { ...current, [column.dataField]: v }
                                    })
                                  }} /> : <>

                                  {
                                    filterRow[column.dataField] &&
                                    <div ><span>: {filterRow[column.dataField]}</span></div>
                                  }
                                </>
                            }
                          </th>
                      })
                    }
                    {
                      !tableSetting.disableRowAction && !enableMultiSelect && tableAction &&
                      <th className={`p-3
                  text-sm font-semibold tracking-wide text text-left`}>Action</th>
                    }
                  </tr>
                </thead>

                <tbody className=' divide-y divide-gray-500 text-gray-500 bg-white
          dark:divide-gray-500 dark:text-gray-200 dark:bg-gray-700
          '>
                  {
                    pageData.map((item, indexItem) => {
                      return (
                        <tr key={indexItem} className=' '>
                          {
                            !tableSetting.disableMultipleSelect && enableMultiSelect && (
                              <td className={` p-3 text-sm whitespace-nowrap`}><Checkbox
                                value={
                                  selected.size === pageData.length ? "checked" : selected.has(item) ? "checked" : ""
                                }
                                onChange={(v) => {

                                  if (v === "checked") {

                                    handleAddSelected(item)
                                  } else {
                                    handleRemoveSelected(item)
                                  }
                                }} /></td>
                            )
                          }

                          {
                            tableCol.map((column, index) => {
                              if (!tableSetting.hideColumns.has(column.dataField as string))
                                return (
                                  <td key={index} className={` ${Number(item[column.dataField]) ? " text-right" : ""} p-3 text-sm whitespace-nowrap`}>{
                                    column.formatter ? column.formatter(item[column.dataField]) : String(item[column.dataField])
                                  }</td>

                                )
                            })
                          }
                          {
                            !tableSetting.disableRowAction && !enableMultiSelect && tableAction &&
                            <td className={`p-3
                        text-sm font-semibold tracking-wide`}>
                              {
                                <DropDownMenu items={tableAction(item)}>
                                  {
                                    ({ open }) => (<div className='flex items-center flex-col border-2 rounded-md 
                              text-gray-500 dark:text-gray-400 
                              border-gray-400 dark:border-gray-600
                              hover:border-gray-800 hover:dark:border-gray-200
                              hover:text-gray-900 hover:dark:text-gray-100'>

                                      <AiOutlineEllipsis className=' flex-initial' size={25} />

                                    </div>
                                    )
                                  }

                                </DropDownMenu>

                              }
                            </td>
                          }
                        </tr>
                      )
                    })
                  }

                </tbody>
              </table>
            </div>
            <Pagination pageSizeOption={pageSizeOption} itemCount={itemMaxCount} pageSize={pageSize} currentPage={currentPage} onPageChange={(currentP) => { setCurrentPage(currentP) }} setPageSize={(pageSize) => { setPageSize(pageSize) }} />
          </>
      }
    </div>
  )
}
