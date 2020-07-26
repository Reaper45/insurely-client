import { useState, useEffect } from "react";

type ReturnType = [boolean, OptionType[] | null];

const useClasses = (): ReturnType => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<OptionType[] | null>(null);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/classes/${process.env.REACT_APP_MOTOR_PARENT_CLASS_ID}/subclasses`
    )
      .then(async (results) => {
        const { data } = await results.json();

        const opts = data.sub_classes.map((cl: InsuranceClassType) => ({
          key: `${cl.id}`,
          value: `${cl.id}`,
          label: cl.name,
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

export default useClasses;
