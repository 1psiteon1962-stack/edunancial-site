'use server';

export async function submitForm(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  console.log('Form submitted:', data);

  return { success: true };
}
