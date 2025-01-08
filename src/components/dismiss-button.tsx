import Icon from '@/components/ui/icon'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function DismissButton(buttonProps: ButtonProps) {
  return (
    <Button
      {...buttonProps}
      leftIcon={<Icon icon="lucide:arrow-left" />}
      variant="outline"
      className={cn(buttonProps.className)}
      disabled={buttonProps.isLoading}
      type="button"
    />
  )
}
