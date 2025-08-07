// import fetch from "node-fetch"

// ACCESS TOKEN  = A21AAM57jj8veoc7OWFcLVaLT30IERpe-ydPaIp1Orh6u1_aih5BEKOJhq_XT-mW2PYgAUer1-5hhpIBdADDhxtjyOAIPRW8g

// PRODUCCION

// SANDBOX
// const PAYPAL_API = "https://api-m.sandbox.paypal.com"

const PAYPAL_API = "https://api-m.paypal.com";

const CLIENT = process.env.NEXT_PAYPAL_CLIENT_ID_PRODUCTION;
const SECRET = process.env.NEXT_PAYPAL_SECRET_ID_PRODUCTION;

const base64 = Buffer.from(`${CLIENT}:${SECRET}`).toString("base64");

export async function getAccessToken() {
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${base64}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}

export async function createProduct(product: any) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(product),
  });
  return response.json();
}

export async function createPlan(plan: any) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(plan),
  });
  return response.json();
}

// export async function cancelSubscription(subscriptionId: string) {
//   const accessToken = await getAccessToken()
//   const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//     body: JSON.stringify({
//       reason: "Customer requested cancellation", // Puedes personalizar el motivo si lo deseas
//     }),
//   })

//   if (!response.ok) {
//     const error = await response.json()
//     throw new Error(`Error canceling subscription: ${error.message}`)
//   }

//   return response.json()
// }
