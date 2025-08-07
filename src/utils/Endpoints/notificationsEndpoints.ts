import { apiRequest } from "./endpointsConfig";

export const getTwoLastCourse = async () => {
  try {
    const res = await apiRequest({
      url: `/api/users/notifications/new-courses`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getPendingTickets = async () => {
  try {
    const res = await apiRequest({
      url: `/api/users/notifications/ticket/pending`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getResolvedTickets = async () => {
  try {
    const res = await apiRequest({
      url: `/api/users/notifications/ticket/resolved`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getNotifications = async () => {
  try {
    const res = await apiRequest({
      url: `/api/users/notifications`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
