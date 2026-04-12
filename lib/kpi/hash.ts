export async function hashIP(ip: string | null | undefined): Promise<string> {
  try {
    const value = ip ?? 'unknown';

    const encoder = new TextEncoder();
    const data = encoder.encode(value);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  } catch (error) {
    console.error('hashIP error:', error);
    return 'hash_error';
  }
}
