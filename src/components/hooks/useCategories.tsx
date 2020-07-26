import { useState, useEffect } from "react";

type ReturnType = [boolean, OptionType[] | null];

const useCategories = (classId: string): ReturnType => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<OptionType[] | null>(null);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/classes/${process.env.REACT_APP_MOTOR_PARENT_CLASS_ID}/categories`
    )
      .then(async (results) => {
        console.log({ results });
        const { data } = await results.json();

        const opts = data.categories.map((category: InsuranceClassType) => ({
          key: `${category.id}`,
          value: `${category.id}`,
          label: category.name,
        }));
        setOptions(opts);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, options];
};

export default useCategories;
