import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function LoginDescription() {
  const features = [
    'Manajemen kiosk yang mudah dan efisien',
    'Monitoring realtime status kiosk',
    'Analisis data penggunaan kiosk',
    'Konfigurasi sistem yang fleksibel'
  ]

  return (
    <div className="space-y-6 text-left">
      <div>
        <Badge variant="premium" className="mb-4">
          Sistem Manajemen Kiosk
        </Badge>
        <h2 className="mb-4 text-4xl font-bold tracking-tight">Platform Manajemen Kiosk yang Modern</h2>
        <p className="text-lg text-muted-foreground">
          Kelola semua kiosk Anda dalam satu dashboard terintegrasi dengan fitur-fitur canggih.
        </p>
      </div>

      <div className="grid gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="border-primary/10 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <p className="font-medium">{feature}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
