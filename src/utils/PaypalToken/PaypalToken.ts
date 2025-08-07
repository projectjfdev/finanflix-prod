export async function getPayPalToken() {
  try {
    const res = await fetch('/api/paypal/token');

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error fetching PayPal token');
    }

    const data = await res.json();
    return data.accessToken;
  } catch (err: any) {
    // console.error('Failed to get PayPal token:', err.message);
    return null;
  }
}
