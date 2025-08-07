import { apiRequest } from "./endpointsConfig";

export const registerUser = async (uri?: string, data?: any) => {
  try {
    const res = await apiRequest({
      url: uri || "/api/auth/register",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const sendVerificationEmail = async (data: any) => {
  try {
    const res = await apiRequest({
      url: "/api/users/email/verification-email",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const newVerification = async (token: any) => {
  try {
    const res = await apiRequest({
      url: "/api/users/email/confirm-verification",
      method: "POST",
      data: token || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getEmailByToken = async (token: any) => {
  try {
    const res = await apiRequest({
      url: `/api/users/email/get-email/${token}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/auth/reset-password`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
