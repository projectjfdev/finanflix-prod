import { apiRequest } from './endpointsConfig';

export const createOrder = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/orders/new`,
      method: 'POST',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const PaypalPaymentConfirmationAdmin = async (data: any) => {
  try {
    const res = await apiRequest({
      url: '/api/users/email/paypal-payment-confirmation-admin',
      method: 'POST',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const PaypalSuscriptionConfirmationAdmin = async (data: any) => {
  try {
    const res = await apiRequest({
      url: '/api/users/email/paypal-suscription-confirmation-admin',
      method: 'POST',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const PaypalSuscriptionConfirmationBuyer = async (data: any) => {
  try {
    const res = await apiRequest({
      url: '/api/users/email/paypal-suscription-confirmation-buyer',
      method: 'POST',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const PaypalPaymentConfirmationBuyer = async (data: any) => {
  try {
    console.log('Datos enviados:', data);
    const res = await apiRequest({
      url: '/api/users/email/paypal-payment-confirmation-buyer',
      method: 'POST',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createOrderOnApprovePaypal = async (data: any) => {
  try {
    const res = await apiRequest({
      url: '/api/orders/paypal/new',
      method: 'POST',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createSuscriptionOrder = async (data: any) => {
  try {
    const res = await apiRequest({
      url: '/api/orders/suscription',
      method: 'POST',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createSuscriptionOrderPaypal = async (data: any) => {
  try {
    const res = await apiRequest({
      url: '/api/orders/paypal/suscription',
      method: 'POST',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
