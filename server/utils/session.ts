import { H3Event, getCookie, setCookie } from 'h3'
import { randomUUID } from 'crypto'

const SESSION_COOKIE_NAME = 'between_student_session'

export interface StudentSession {
  chatMessagesCount: number;
  speechAttemptsCount: number;
  chatHistory: Array<{ role: string, content: string }>;
}

export async function getOrCreateStudentSession(event: H3Event): Promise<{ id: string; session: StudentSession }> {
  let sessionId = getCookie(event, SESSION_COOKIE_NAME)
  const storage = useStorage('cache')

  if (!sessionId) {
    sessionId = randomUUID()
    setCookie(event, SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600 // 1 hora
    })
  }

  const sessionKey = `student_session:${sessionId}`
  let session = await storage.getItem<StudentSession>(sessionKey)

  if (!session) {
    session = {
      chatMessagesCount: 0,
      speechAttemptsCount: 0,
      chatHistory: []
    }
    // Set expiry using the meta options for storage if available, but
    // since we rely on the cookie expiration, the storage item can just live there
    // or we can just rely on Nitro cache natural eviction or clear it manually.
    await storage.setItem(sessionKey, session)
  }

  return { id: sessionId, session }
}

export async function updateStudentSession(sessionId: string, session: StudentSession) {
  const storage = useStorage('cache')
  const sessionKey = `student_session:${sessionId}`
  await storage.setItem(sessionKey, session)
}
