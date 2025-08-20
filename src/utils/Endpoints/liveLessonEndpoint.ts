import { apiRequest } from "./endpointsConfig";

export const createLiveLesson = async (data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/live-lesson/new`,
      method: "POST",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getLiveLessons = async () => {
  try {
    const res = await apiRequest({
      url: `/api/live-lesson/get-lessons`,
      method: "GET",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteLiveLessonById = async (lessonId: any) => {
  try {
    const res = await apiRequest({
      url: `/api/live-lesson/delete-lesson/${lessonId}`,
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateLiveLessonById = async (liveLessonId: string, data: any) => {
  try {
    const res = await apiRequest({
      url: `/api/live-lesson/update-lesson/${liveLessonId}`,
      method: "PUT",
      data: data || {},
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
