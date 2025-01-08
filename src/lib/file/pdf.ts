import { api } from '../http/fetch-api'

export async function loadPdf<T>(endpoint: string, body: T, title: string, token: string) {
  const response = await fetch(process.env.NEXTAUTH_URL + endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || response.statusText)
  }

  const blob = await response.blob()
  if (blob.size === 0) {
    throw new Error(`Dokumen ${title} kosong`)
  }

  // Konversi Blob ke File
  const file = new File([blob], `${title}.pdf`, { type: 'application/pdf' })

  return file
}

export async function printPdf(baseUrl: string, body: { file: File; printer: string }) {
  const { data, error } = await api.post<{ message: string }, { file: File; printer: string }>('/print', body, {
    baseUrl,
    requireAuth: false,
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json'
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
