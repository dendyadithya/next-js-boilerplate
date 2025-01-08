import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return new NextResponse('URL is required', { status: 400 })
  }

  const response = await fetch(url)
  const blob = await response.blob()

  return new NextResponse(blob)
}
