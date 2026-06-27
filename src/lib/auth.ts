export interface User {

  id: string;

  email: string;

  firstName: string;

  lastName: string;

}

export function isLoggedIn(): boolean {

  return false;

}

export function currentUser(): User | null {

  return null;

}
