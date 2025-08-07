import { apiRequest } from "./endpointsConfig";

export const createCourse = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/cursos/nuevo-curso`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Diferencias entre las dos creaciones de progreso:
// La primera (createCourseProgress), crea el progreso del curso si no lo tiene, y agrega el id del curso dentro del array de enrolledCourses del usuario
// La segunda (createCourseProgressForSuscriptions), solo crea el progreso del curso.
// Creé la segunda opcion ya que necesitamos la cracion del progreso del curso cuando el usuario accede a un curso "como suscriptor". En este caso, no metemos
// el id del curso dentro de enrolledCourses ya que no es un curso que pertenece al usuario, es un curso que adquirió con el beneficio de la suscripción.

export const createCourseProgress = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/cursos/course-progress`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

// TESTEAR SI NO HAY QUE REVALIDAR ESTE GET CADA VEZ Q SE ELIMINA O SE DA UNA SUSCRIPCION
export const giveSuscriptionToUser = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/admin/give-suscription`,
      method: "PUT",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createCourseProgressForSuscriptions = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/cursos/course-progress/suscriptions`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const lessonIsViewed = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/cursos/lesson-is-viewed`,
      method: "PUT",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getCoursesInProgress = async () => {
  try {
    const res = await apiRequest({
      url: `/api/cursos/continuar-aprendiendo`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    const res = await apiRequest({
      url: `/api/cursos/course-by-id/${courseId}`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateCourseById = async (courseId: string, data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/cursos/course-by-id/${courseId}`,
      method: "PUT",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCourses = async () => {
  try {
    const res = await apiRequest({
      url: `/api/cursos/get-courses`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const courseToClaim = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/cursos/course-to-claim`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
