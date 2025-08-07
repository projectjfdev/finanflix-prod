import { apiRequest } from "./endpointsConfig";

export const createPlanSuscription = async (data: any) => {
  try {
    const res = await apiRequest({
      url: "/api/suscription/new-suscription",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSuscriptionsPlans = async () => {
  try {
    const res = await apiRequest({
      url: `/api/suscription/new-suscription`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSuscriptionById = async (suscriptionId: string) => {
  try {
    const res = await apiRequest({
      url: `/api/suscription/suscription-by-id/${suscriptionId}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const generateSuscription = async (data: any) => {
  try {
    const res = await apiRequest({
      url: "/api/suscription/generate-suscription",
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
