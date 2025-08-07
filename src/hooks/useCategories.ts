import { ICategory } from "@/interfaces/category";
import { getCategories } from "@/utils/Endpoints/adminEndpoints";
import { useEffect, useState } from "react";

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[] | null>();

  const handleCategories = async () => {
    const res = await getCategories();

    setCategories(res.data);
  };

  useEffect(() => {
    handleCategories();
  }, []);

  return {
    categories,
  };
};
