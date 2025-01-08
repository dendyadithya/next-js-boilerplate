export async function urlToFile(url: string | null): Promise<File[]> {
  if (typeof window === 'undefined' || !url) return []

  const type = url.split('.').pop() || ''

  const proxyUrl = `/api/proxy-image?url=${url}`
  const response = await fetch(proxyUrl)
  const data = await response.blob()

  if (!data.size) return []

  const file = new File([data], `image.${type}`, { type: getMimeType(type) })
  return [file]
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    txt: 'text/plain',
    pdf: 'application/pdf'
  }

  return mimeTypes[extension] || 'application/octet-stream'
}
