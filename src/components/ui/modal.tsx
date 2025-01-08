'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { ComponentProps } from 'react'

interface BaseProps {
  children: React.ReactNode
}

interface RootModalProps extends BaseProps {
  open?: boolean
  modal?: boolean
  type?: 'dialog' | 'sheet'
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

interface ModalProps extends BaseProps {
  className?: string
  asChild?: true
}

const ModalContext = React.createContext<RootModalProps['type']>('dialog')
const useModal = () => {
  const context = React.useContext(ModalContext)

  if (!context) {
    throw new Error('useModal should be used within <Modal>')
  }

  return context
}

const Modal = ({ children, ...props }: RootModalProps) => {
  const isDesktop = useMediaQuery('md')
  const type = useModal()
  const ModalComponent = isDesktop ? (type === 'dialog' ? Dialog : Sheet) : Drawer

  return (
    <ModalContext.Provider value={props.type}>
      <ModalComponent {...props}>{children}</ModalComponent>
    </ModalContext.Provider>
  )
}

// Update ModalTrigger
type ModalTriggerType =
  | ComponentProps<typeof DialogTrigger>
  | ComponentProps<typeof SheetTrigger>
  | ComponentProps<typeof DrawerTrigger>

const ModalTrigger = React.forwardRef<HTMLButtonElement, ModalTriggerType>(({ className, children, ...props }, ref) => {
  const isDesktop = useMediaQuery('md')
  const type = useModal()
  const ModalTriggerComponent = isDesktop ? (type === 'dialog' ? DialogTrigger : SheetTrigger) : DrawerTrigger

  return (
    <ModalTriggerComponent className={className} {...props} ref={ref}>
      {children}
    </ModalTriggerComponent>
  )
})
ModalTrigger.displayName = 'ModalTrigger'

// Update ModalContent
type ModalContentType =
  | ComponentProps<typeof DialogContent>
  | ComponentProps<typeof SheetContent>
  | ComponentProps<typeof DrawerContent>

const ModalContent = ({
  className,
  children,
  hideClose,
  ...props
}: ModalContentType & {
  hideClose?: boolean
}) => {
  const isDesktop = useMediaQuery('md')
  const type = useModal()
  const ModalContentComponent = isDesktop ? (type === 'dialog' ? DialogContent : SheetContent) : DrawerContent

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <ModalContentComponent className={className} aria-describedby={undefined} {...(props as any)} hideClose={hideClose}>
      {children}
    </ModalContentComponent>
  )
}

const ModalDescription = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery('md')
  const type = useModal()
  const ModalDescription = isDesktop ? (type === 'dialog' ? DialogDescription : SheetDescription) : DrawerDescription

  return (
    <ModalDescription className={className} {...props}>
      {children}
    </ModalDescription>
  )
}

const ModalHeader = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery('md')
  const type = useModal()
  const ModalHeader = isDesktop ? (type === 'dialog' ? DialogHeader : SheetHeader) : DrawerHeader

  return (
    <ModalHeader className={className} {...props}>
      {children}
    </ModalHeader>
  )
}

const ModalTitle = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery('md')
  const type = useModal()
  const ModalTitle = isDesktop ? (type === 'dialog' ? DialogTitle : SheetTitle) : DrawerTitle

  return (
    <>
      <ModalTitle className={className} {...props}>
        {children}
      </ModalTitle>
    </>
  )
}

const ModalBody = ({ className, children, ...props }: ModalProps) => {
  const type = useModal()
  return (
    <div className={cn('px-4 md:px-0', type === 'sheet' ? 'py-4' : 'pb-4', className)} {...props}>
      {children}
    </div>
  )
}

const ModalFooter = ({ className, children, ...props }: ModalProps) => {
  const isDesktop = useMediaQuery('md')
  const type = useModal()
  const ModalFooter = isDesktop ? (type === 'dialog' ? DialogFooter : SheetFooter) : DrawerFooter

  return (
    <ModalFooter className={className} {...props}>
      {children}
    </ModalFooter>
  )
}

export { Modal, ModalTrigger, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalBody, ModalFooter }
