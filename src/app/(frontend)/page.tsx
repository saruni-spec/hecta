import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <main className="home">
      <div className="logo">
        <img
          alt="Hecta Consulting Logo"
          height={200}
          src="https://res.cloudinary.com/ddczkq79u/image/upload/v1/media/hecta_logo-1.jpeg?_a=BAMAABXy0"
          width={200}
        />
      </div>

      <h1>
        {user ? `Welcome, ${user.email.split('@')[0]}` : 'Hecta Consulting Content Management'}
      </h1>

      <p className="subtitle">
        Use the admin panel to manage your website&apos;s blog posts and content.
      </p>

      <div className="links">
        <a
          className="admin"
          href={payloadConfig.routes.admin}
          rel="noopener noreferrer"
          target="_blank"
        >
          Admin Panel
        </a>
        <a
          className="docs"
          href="https://payloadcms.com/docs"
          rel="noopener noreferrer"
          target="_blank"
        >
          Payload Docs
        </a>
      </div>

      <footer className="footer">
        <p>This is the CMS homepage. The public-facing website is separate.</p>
      </footer>
    </main>
  )
}
