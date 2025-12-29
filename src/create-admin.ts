import config from '@payload-config'
import { getPayload } from 'payload'

const createAdmin = async () => {
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: 'admin@example.com',
      },
    },
  })

  if (users.totalDocs > 0) {
    console.log('Admin user already exists.')
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@example.com',
      password: 'password',
    },
  })

  console.log('Admin user created successfully.')
  console.log('Email: admin@example.com')
  console.log('Password: password')
  process.exit(0)
}

createAdmin()
