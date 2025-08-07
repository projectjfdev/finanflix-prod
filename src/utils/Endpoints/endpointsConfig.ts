import axios from 'axios';

export const API = axios.create({
  baseURL: process.env.APP_URL, // Define una URL base para evitar repetirla en cada petición
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface PropsApiRequest {
  url: string;
  data?: any;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export const apiRequest = async ({ url, data, method }: PropsApiRequest) => {
  try {
    const response = await API.request({
      url,
      method,
      data,
    });

    return response.data; // Retorna directamente los datos de la API
  } catch (error) {
    // Manejo de errores más robusto
    if (axios.isAxiosError(error)) {
      const err = error.response?.data || { success: false, message: 'Error desconocido' };
      return { status: err.success || false, message: err.message || 'Error en la petición' };
    }

    console.error('Error inesperado en apiRequest:', error);
    return { status: false, message: 'Error inesperado' };
  }
};

// export const API = axios.create({
//   responseType: "json",
// });

// interface PropsApiRequest {
//   url: string;
//   data?: any;
//   method: "GET" | "POST" | "PUT" | "DELETE";
// }

// export const apiRequest = async ({ url, data, method }: PropsApiRequest) => {
//   try {
//     const result = await API(url, {
//       method: method || "GET",
//       data: data,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     return result?.data;
//   } catch (error: any) {
//     const err = error.response.data;
//     return { status: err.success, message: err.message };
//   }
// };

export const apiRequestFormData = async ({ url, data, method }: PropsApiRequest) => {
  try {
    const result = await API(url, {
      method: method || 'GET',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return result?.data;
  } catch (error: any) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const response = await fetch(`/api/cursos/course-by-id/${courseId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete course');
    }

    // Trigger a revalidation of the courses data
    await fetch(`/api/revalidate?path=/cursos/course-by-id/${courseId}`);

    return await response.json();
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};
