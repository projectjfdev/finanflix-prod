import { apiRequest } from "./endpointsConfig";

// Esta funcion lo que hace es:
// 1 - Actualizar el campo status: "Pagado" en la Orden de compra
// 2 - Crear el progreso del curso del usuario comprador
// 3 - Agregar el ID del curso al campo enrrolledCourses del usuario
export const validateOfflineCourseOrder = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/offline-payment/course`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const validateOfflineSuscriptionOrder = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/offline-payment/suscription`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUsersByEmail = async (search: string) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/search-users/${search}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async (search: string) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/search-user/${search}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTitleCourses = async () => {
  try {
    const res = await apiRequest({
      url: `/api/admin/get-title-courses`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getExchangeRate = async () => {
  try {
    const res = await apiRequest({
      url: `/api/admin/exchange-rate`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateExchangeRate = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/exchange-rate`,
      method: "PUT",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createCategory = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/categories/new`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getCategories = async () => {
  try {
    const res = await apiRequest({
      url: `/api/admin/categories`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCategoryById = async (id: string) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/categories/delete/${id}`,
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getOrdersToExport = async (query: string) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/export-to-excel/orders?${query}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSuscriptionsToExport = async (query: string) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/export-to-excel/suscriptions?${query}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const handleRevalidatePath = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/clear-cache`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
