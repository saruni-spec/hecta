import { NextResponse } from 'next/server'

const allowed_origins = [
  'https://hectaconsulting.com',
  'https://www.hectaconsulting.com',
  'https://hecta-consulting.vercel.app',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
]

export function middleware(req: Request) {
  const origin = req.headers.get('origin')
  const res = NextResponse.next()

  if (origin && allowed_origins.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: res.headers })
  }

  return res
}
