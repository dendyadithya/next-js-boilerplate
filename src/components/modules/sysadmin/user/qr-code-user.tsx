'use client'

import { Button } from '@/components/ui/button'
import { UserWithQrCode } from '@/types/sysadmin/user'
import { Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeUserProps {
  data: Pick<UserWithQrCode, 'username' | 'quick_response_code'>
}

export function QRCodeUser({ data }: QRCodeUserProps) {
  const barcodeData = data.quick_response_code

  const handleDownload = () => {
    const canvas = document.createElement('canvas')
    const qrCode = document.getElementById('qr-code')?.querySelector('svg')

    if (!qrCode) return

    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(qrCode)

    const image = new Image()
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)

    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      if (!context) return

      context.fillStyle = '#FFFFFF'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0)

      const link = document.createElement('a')
      link.download = `qr-code-${data.username}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }

  return (
    <div className="group relative">
      <div className="flex aspect-square w-full items-center justify-center bg-white p-8">
        <div id="qr-code" className="relative">
          <div className="absolute -inset-4 animate-pulse rounded-xl bg-gradient-to-r from-primary/30 to-primary/20 opacity-75 blur-lg" />
          <div className="relative">
            <QRCodeSVG value={barcodeData} size={400} level="H" includeMargin />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-90 transition-opacity hover:opacity-100">
        <Button variant="default" onClick={handleDownload} className="flex items-center gap-2 shadow-lg">
          <Download size={16} />
          <span>Unduh QR Code</span>
        </Button>
      </div>
    </div>
  )
}
