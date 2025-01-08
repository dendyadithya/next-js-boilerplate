import Icon from '@/components/ui/icon'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SubmitButton(buttonProps: ButtonProps) {
  return (
    <Button
      {...buttonProps}
      leftIcon={<Icon icon="lucide:save-all" />}
      className={cn(
        'bg-blue-500 hover:bg-blue-500/80 dark:bg-blue-600 dark:text-primary dark:hover:bg-blue-600/80',
        buttonProps.className
      )}
      disabled={buttonProps.isLoading}
      type="submit"
    />
  )
}
