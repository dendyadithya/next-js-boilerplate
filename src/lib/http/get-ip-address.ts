import { headers } from 'next/headers'

export default async function getIpAddress() {
  const headersList = await headers()

  // Cek berbagai kemungkinan header untuk IP client
  const clientIp =
    headersList.get('x-real-ip') || // Nginx
    headersList.get('x-forwarded-for')?.split(',')[0] || // Most common
    headersList.get('cf-connecting-ip') || // Cloudflare
    headersList.get('true-client-ip') || // Akamai and Cloudflare
    headersList.get('x-client-ip') || // Apache
    headersList.get('forwarded')?.split(',')[0] || // RFC 7239
    headersList.get('remote-addr') || // Apache
    '127.0.0.1' // Fallback

  console.log(clientIp)

  // Bersihkan IP dari karakter khusus
  const cleanIp = clientIp.replace('::ffff:', '').replace('::1', '127.0.0.1').trim()

  // Validasi format IP
  const isValidIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(cleanIp)

  if (!isValidIp) {
    return '127.0.0.1'
  }

  return cleanIp
}
