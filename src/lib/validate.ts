const safaricomPhoneNumber = /^(?:254|\+254|0)?(7(?:(?:[1249][\d])|(?:[5][789])|(?:[6][89])))/;

const isValidSafaricomNumber = (phoneNumber: string): boolean => {
  const regex = new RegExp(safaricomPhoneNumber);

  return regex.test(phoneNumber);
};

export { isValidSafaricomNumber };
