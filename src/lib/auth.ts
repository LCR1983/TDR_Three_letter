import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from './session'

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session.isAdmin === true
}
