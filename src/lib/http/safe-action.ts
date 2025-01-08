import { getCookieServer, setCookieServer } from '@/lib/cookie/cookie-server'
import { createSafeActionClient } from 'next-safe-action'
import { cookies } from 'next/headers'
import { z } from 'zod'

export const baseActionClient = createSafeActionClient({
  async handleServerError(e) {
    console.log(e)
    if (e.message.includes('Token')) {
      setCookieServer('isTokenKioskExpired', true, { cookies })
      return
    }
    return e.message
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string()
    })
  }
}).use(async ({ next, clientInput, metadata }) => {
  console.log('LOGGING MIDDLEWARE')

  const startTime = performance.now()

  // Here we await the action execution.
  const result = await next()

  const endTime = performance.now()

  // Convert clientInput to valid JSON format
  console.log('Result ->', JSON.stringify(result, null, 2))
  console.log('Client input ->', JSON.stringify(clientInput, null, 2))
  console.log('Metadata ->', metadata)
  console.log('Action execution took', endTime - startTime, 'ms')

  // And then return the result of the awaited action.
  return result
})

export const kioskActionClient = baseActionClient.use(async ({ next }) => {
  const token = await getCookieServer('tokenKiosk', { cookies })

  if (!token) {
    await setCookieServer('isTokenKioskExpired', true, { cookies })
  }

  // Return the next middleware with `userId` value in the context
  return next()
})

export const adminActionClient = baseActionClient.use(async ({ next }) => {
  const token = await getCookieServer('next-auth.session-token', { cookies })

  if (!token) {
    await setCookieServer('isTokenAdminExpired', true, { cookies })
  }

  // Return the next middleware with `userId` value in the context
  return next()
})
