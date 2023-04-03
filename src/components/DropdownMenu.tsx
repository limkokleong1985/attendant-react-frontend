import React, { useRef, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { usePopper } from "react-popper";
import { Portal } from "react-portal";

export type ItemMenu = {
  menuItem: ({ active }: { active: boolean }) => React.ReactNode,
  onClick?: () => void,
  disabled?: boolean,
  divide?: boolean
}

function DropDownMenu<Item>({ children, items, className }: {
  children: ({ open }: { open: boolean }) => React.ReactNode,
  items: ItemMenu[],
  className?: string
}) {
  const popperElRef = useRef<HTMLDivElement>(null);
  const [targetElement, setTargetElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(targetElement, popperElement, {
    placement: "auto",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 5]
        }
      }
    ]
  });


  return (

    <div className={className}>
      <div >
        <Menu>
          {({ open }) => (
            <>
              <div ref={setTargetElement} className="rounded-md shadow-sm">
                <Menu.Button >

                  {children({ open })}
                </Menu.Button>
              </div>

              <Portal>
                <div
                  ref={popperElRef}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  <Transition
                    show={open}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    beforeEnter={() => setPopperElement(popperElRef.current)}
                    afterLeave={() => setPopperElement(null)}
                  >
                    <Menu.Items
                      static
                      className=" w-56 origin-top-right bg-white border border-gray-500  rounded-md shadow-lg outline-none
                      dark:bg-gray-700 dark:text-gray-300 py-2
                      "
                    >
                      {
                        items.map((item, index) => {
                          return (
                            <div key={index} className="">
                              <Menu.Item as="button"
                                onClick={() => item.onClick?.()} disabled={item.disabled}
                                className="w-[100%]"
                              >
                                {({ active }) => <div>
                                  <div

                                    className={`${active
                                      ? " bg-primary-900 "
                                      : ""
                                      } flex flex-col justify-between w-full px-4 py-2 text-sm leading-5 text-left ${item.divide && "border-b-2"}`}
                                  >
                                    {item.menuItem({ active })}
                                  </div>
                                </div>}
                              </Menu.Item>
                            </div>
                          )
                        })
                      }

                    </Menu.Items>
                  </Transition>
                </div>
              </Portal>
            </>
          )}
        </Menu>
      </div>
    </div>

  )
}

export default DropDownMenu