export function getUser() {
  return {
    id: 'demo-user',
    level: 1,
    isAdmin: true
  }
}

export async function requireAdmin() {
  const user = getUser()

  if (!user || !user.isAdmin) {
    throw new Error('Unauthorized: Admin access required')
  }

  return user
}
