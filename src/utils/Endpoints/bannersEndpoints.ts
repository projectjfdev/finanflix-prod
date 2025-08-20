import { apiRequest } from "./endpointsConfig";

export const createBannerTop = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/banners/new-top`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getBannersTop = async () => {
  try {
    const res = await apiRequest({
      url: `/api/banners/get-banners`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBannerTopById = async (id: string) => {
  try {
    const res = await apiRequest({
      url: `/api/banners/delete-top/${id}`,
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getBannersTopAdmin = async () => {
  try {
    const res = await apiRequest({
      url: `/api/banners/get-banners/admin`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
