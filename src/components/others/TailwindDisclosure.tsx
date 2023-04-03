import React from 'react'
import { Disclosure } from '@headlessui/react'
import { AiFillCaretUp } from 'react-icons/ai'

export type DisclosureContain = {
  title: string,
  content: ({ open }: { open: boolean }) => React.ReactNode
}

export default function TailwindDisclosure({ contents }:
  {
    contents: DisclosureContain[]
  }) {
  return (
    <div className="w-full">
      <div className=" py-2">
        {
          contents.map((c, index) => {
            return (

              <Disclosure as="div" key={index} className=" py-2">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg  px-4 py-2 text-left text-sm font-medium 
                  dark:bg-gray-500 dark:text-gray-300 dark:hover:bg-gray-400 dark:hover:text-gray-600
                   bg-gray-400 text-gray-700 hover:bg-gray-300 focus-visible:ring-purple-500 group
                    focus:outline-none focus-visible:ring  focus-visible:ring-opacity-75">
                      <span>{c.title}</span>
                      <AiFillCaretUp
                        className={`${open ? 'rotate-180 transform' : ''
                          } h-5 w-5 
                    text-gray-700 dark:group-hover:text-gray-600 dark:text-gray-300 `}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pb-1 border-x-2 mx-2 border-b-2 rounded-b-lg
                    border-gray-400 dark:border-gray-500
                    ">
                      {
                        c.content({ open })
                      }
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          })
        }

      </div>
    </div>
  )
}
