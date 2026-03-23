'use server';

export async function subscribe(formData: FormData) {
  try {
    const email = formData.get('email');

    console.log('New subscriber:', email);

    return { success: true };
  } catch (error) {
    console.error('Subscribe error:', error);
    return { success: false };
  }
}
