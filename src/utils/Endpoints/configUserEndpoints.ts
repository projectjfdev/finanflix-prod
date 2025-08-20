import { apiRequest } from './endpointsConfig';

// Actualiza el usuario
export const updateUser = async (uri: string, data?: any) => {
  try {
    const res = await apiRequest({
      url: uri,
      method: 'PUT',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log('error del catch:', error);
  }
};

// Elimina la cuenta del usuario
export const deleteUserById = async (userId: string) => {
  try {
    const res = await apiRequest({
      url: `/api/users/${userId}`,
      method: 'DELETE',
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Crear preferencias del usuario
export const createUserPreferences = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/users/preferences`,
      method: 'POST',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUserPreferences = async () => {
  try {
    const res = await apiRequest({
      url: `/api/users/preferences`,
      method: 'GET',
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateUserPreferences = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/users/preferences`,
      method: 'PUT',
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log('error del catch:', error);
  }
};

export const getOnboardingInfo = async () => {
  try {
    const res = await apiRequest({
      url: `/api/users/preferences/onboarding-info`,
      method: 'GET',
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

// export const updateDiscordConnect = async () => {
//   try {
//     const res = await apiRequest({
//       url: `/api/users/preferences/discord-connect`,
//       method: "PUT",
//     });

//     return res;
//   } catch (error) {
//     console.log("error del catch:", error);
//   }
// };

// Función para actualizar la conexión de Discord (mantener compatibilidad con el código existente)
export async function updateDiscordConnect() {
  try {
    const response = await fetch('/api/discord/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar la conexión de Discord:', error);
    return { success: false, message: 'Error de conexión' };
  }
}
