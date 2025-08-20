import { apiRequest } from "./endpointsConfig";

export const sendOfflinePaymentConfirmation = async (data: any) => {
  try {
    const res = await apiRequest({
      url: "/api/users/email/offline-payment-confirmation",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const sendOfflinePaymentIncomplete = async (data: any) => {
  try {
    const res = await apiRequest({
      url: "/api/users/email/offline-payment-incomplete",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};


export const sendOfflineSuscriptionConfirmation = async (data: any) => {
  try {
    const res = await apiRequest({
      url: "/api/users/email/offline-suscription-confirmation",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};





export const sendOfflinePaymentAdmin = async (data: any) => {
  try {
    const res = await apiRequest({
      url: "/api/users/email/offline-payment-admin",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const sendOfflineSuscriptionAdmin = async (data: any) => {
  try {
    const res = await apiRequest({
      url: "/api/users/email/offline-suscription-admin",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailResetYourPassword = async (data: any) => {
  try {
    const res = await apiRequest({
      url: "/api/users/email/reset-your-password",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
