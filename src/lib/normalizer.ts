//
export const phoneNumber = (value: string) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums[0] === "0") {
    return `254${onlyNums.slice(1)}`;
  } else if (onlyNums.length >= 3 && onlyNums.slice(0, 3) !== "254") {
    return `254${onlyNums}`;
  }
  return onlyNums;
};
