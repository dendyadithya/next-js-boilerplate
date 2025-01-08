import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { motion } from 'motion/react'
import React from 'react'
import ConfirmDeleteDialog from './confirm-delete-dialog'
import Icon from '@/components/ui/icon'
import UpdateStatusPopover from './update-status-popover'

type DefaultIconNames = 'view' | 'create' | 'edit' | 'updateStatus' | 'delete'

type DisableConfig = {
  isDisabled: boolean
  reason?: string
  showIcon?: boolean
  customIcon?: string
}

type BaseAction = {
  name: string
  label: string
  icon?: string
  disable?: boolean | DisableConfig
}

type DefaultAction = BaseAction & {
  name: DefaultIconNames
  onClick: () => void
}

type CustomAction = BaseAction & {
  name: string
  icon: string
  onClick: () => void
}

type DeleteAction = Omit<BaseAction, 'onClick'> & {
  name: 'delete'
  onDelete: () => void
  titleDialog: string
  onClick?: () => void
}

type UpdateStatusAction = Omit<BaseAction, 'onClick'> & {
  name: 'updateStatus'
  currentStatus: 1 | 0
  onStatusUpdate: (status: 1 | 0) => void
}

type Action = DefaultAction | CustomAction | DeleteAction | UpdateStatusAction

interface BaseActionCellProps {
  actions: Action[]
}

const defaultIcons: { [key in DefaultIconNames]: string } = {
  view: 'lucide:eye',
  create: 'lucide:plus',
  edit: 'lucide:pencil',
  updateStatus: 'mdi:list-status',
  delete: 'lucide:trash'
}

const defaultIconColors: { [key in DefaultIconNames]: string } = {
  view: 'text-blue-500',
  create: 'text-green-500',
  edit: 'text-amber-500',
  updateStatus: 'text-primary',
  delete: 'text-destructive'
}

export default function BaseActionCell({ actions }: BaseActionCellProps) {
  const getIcon = (action: Action): string => {
    if (action.icon) {
      return action.icon
    }
    if (action.name in defaultIcons) {
      return defaultIcons[action.name as DefaultIconNames]
    }
    throw new Error(`Icon is required for custom action: ${action.name}`)
  }

  const getIconColor = (action: Action): string => {
    if (action.name in defaultIconColors) {
      return defaultIconColors[action.name as DefaultIconNames]
    }
    return ''
  }

  const uniqueActions = actions.filter((action, index, self) => index === self.findIndex(t => t.name === action.name))

  const iconAnimation = {
    hover: { scale: 1.2, rotate: 5 },
    tap: { scale: 0.95 }
  }

  const getDisableConfig = (action: Action): DisableConfig | null => {
    if (!action.disable) return null

    if (typeof action.disable === 'boolean') {
      return {
        isDisabled: action.disable,
        showIcon: true,
        customIcon: 'lucide:lock'
      }
    }

    return {
      isDisabled: action.disable.isDisabled,
      reason: action.disable.reason,
      showIcon: action.disable.showIcon ?? true,
      customIcon: action.disable.customIcon ?? 'lucide:lock'
    }
  }

  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        {uniqueActions.map(action => {
          const disableConfig = getDisableConfig(action)

          return (
            <Tooltip key={action.name}>
              {action.name === 'delete' ? (
                <ConfirmDeleteDialog
                  title={(action as DeleteAction).titleDialog}
                  onDelete={() => (action as DeleteAction).onDelete()}
                >
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(action as DeleteAction).onClick}
                      disabled={disableConfig?.isDisabled}
                      className={disableConfig?.isDisabled ? 'relative cursor-not-allowed' : ''}
                    >
                      <motion.div
                        whileHover={!disableConfig?.isDisabled ? 'hover' : undefined}
                        whileTap={!disableConfig?.isDisabled ? 'tap' : undefined}
                        variants={iconAnimation}
                        className={disableConfig?.isDisabled ? 'opacity-50' : ''}
                      >
                        <Icon icon={getIcon(action)} className={getIconColor(action)} />
                        {disableConfig?.isDisabled && disableConfig.showIcon && (
                          <Icon
                            icon={disableConfig.customIcon!}
                            className="absolute -right-1 -top-1 text-xs text-gray-500"
                          />
                        )}
                      </motion.div>
                      <span className="sr-only">{action.label}</span>
                    </Button>
                  </TooltipTrigger>
                </ConfirmDeleteDialog>
              ) : action.name === 'updateStatus' ? (
                <UpdateStatusPopover
                  icon={getIcon(action)}
                  label={action.label}
                  onStatusUpdate={(action as UpdateStatusAction).onStatusUpdate}
                  currentStatus={(action as UpdateStatusAction).currentStatus}
                  disabled={disableConfig?.isDisabled}
                />
              ) : (
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(action as DefaultAction).onClick}
                    disabled={disableConfig?.isDisabled}
                    className={disableConfig?.isDisabled ? 'relative cursor-not-allowed' : ''}
                  >
                    <motion.div
                      whileHover={!disableConfig?.isDisabled ? 'hover' : undefined}
                      whileTap={!disableConfig?.isDisabled ? 'tap' : undefined}
                      variants={iconAnimation}
                      className={disableConfig?.isDisabled ? 'opacity-50' : ''}
                    >
                      <Icon icon={getIcon(action)} className={getIconColor(action)} />
                      {disableConfig?.isDisabled && disableConfig.showIcon && (
                        <Icon
                          icon={disableConfig.customIcon!}
                          className="absolute -right-1 -top-1 text-xs text-gray-500"
                        />
                      )}
                    </motion.div>
                    <span className="sr-only">{action.label}</span>
                  </Button>
                </TooltipTrigger>
              )}
              <TooltipContent>
                <p>
                  {action.label}
                  {disableConfig?.reason && (
                    <span className="block text-xs text-gray-400">({disableConfig.reason})</span>
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
}
