export type Session = {
  user?: {
    id: string
    plan: "free" | "starter" | "pro" | "elite"
  }
}

let session: Session | null = null

export function getSession() {
  return session
}

export function setSession(s: Session) {
  session = s
}
