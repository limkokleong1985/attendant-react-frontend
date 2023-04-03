import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function Modal({ children, isOpen, closeModal, top, size, disableClose }:
  {
    isOpen: boolean,
    closeModal: () => void,
    top?: boolean,
    size?: "sm" | "md" | "lg" | "full",
    disableClose?: boolean,
    children: React.ReactNode
  }) {

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto ">
          <div className={`flex ${!top && "min-h-full"} items-center justify-center p-4 text-center `}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-${size || "sm"} transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all`}>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
