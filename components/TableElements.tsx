import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Fragment, ReactNode } from 'react'

export const Table = ({ children }) => (
  <table className="min-w-full">{children}</table>
)

export const TrHead = ({ children }) => (
  <tr className="text-xs text-th-fgd-3">{children}</tr>
)

export const Th = ({ children }) => (
  <th className="px-4 pb-2 text-left font-normal" scope="col">
    {children}
  </th>
)

export const TrBody = ({ children }) => (
  <tr className="border-b border-th-bkg-4">{children}</tr>
)

export const Td = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => (
  <td className={`h-16 px-4 text-sm text-th-fgd-2 ${className}`}>{children}</td>
)

type ExpandableRowProps = {
  buttonTemplate: React.ReactNode
  panelTemplate: React.ReactNode
  rounded?: boolean
}

export const ExpandableRow = ({
  buttonTemplate,
  panelTemplate,
  rounded,
}: ExpandableRowProps) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={`default-transition flex w-full items-center justify-between border-t border-th-bkg-4 p-4 font-normal text-th-fgd-1 hover:bg-th-bkg-4 focus:outline-none ${
              rounded
                ? open
                  ? 'rounded-b-none'
                  : 'rounded-md'
                : 'rounded-none'
            }`}
          >
            {buttonTemplate}
            <div className="flex items-center justify-end pl-4">
              <ChevronDownIcon
                className={`${
                  open ? 'rotate-180 transform' : 'rotate-360 transform'
                } default-transition h-5 w-5 flex-shrink-0 text-th-fgd-1`}
              />
            </div>
          </Disclosure.Button>
          <Transition
            appear={true}
            show={open}
            as={Fragment}
            enter="transition-all ease-in duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Disclosure.Panel>
              <div className="px-4 pb-4 pt-2">{panelTemplate}</div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}

type RowProps = {
  children: React.ReactNode
}

export const Row = ({ children }: RowProps) => {
  return (
    <div
      className={`default-transition w-full rounded-none border-t border-th-bkg-4 p-4 font-normal text-th-fgd-1`}
    >
      {children}
    </div>
  )
}
