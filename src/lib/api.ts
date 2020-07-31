import { phoneNumber as nomalizePhoneNumber } from "lib/normalizer";

const headers = new Headers();
headers.append("Content-Type", "application/json");

const mpesaApiUrl = process.env.REACT_APP_MPESA_API_URL;
const appApiUrl = process.env.REACT_APP_API_URL;
const callbackUrl = process.env.REACT_APP_MPESA_CALLBACK;

//
const getQuotes = async () => {

}

//
const checkout = async ({
  amount,
  phoneNumber,
}: {
  amount: string;
  phoneNumber: string;
}) => {
  const nomalizedPhoneNumber = nomalizePhoneNumber(phoneNumber);
  const payload = {
    amount: 1,
    callbackURL: callbackUrl,
    accountRef: "Other",
    phoneNumber: nomalizedPhoneNumber,
    transactionDescription: "Policy payment via insurely.cc",
  };

  const response = await fetch(`${mpesaApiUrl}/c2b/checkout`, {
    method: "POST",
    redirect: "follow",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  return data;
};

//
const checkTransaction = async ({
  checkoutId,
  phoneNumber,
}: {
  checkoutId: string;
  phoneNumber: string;
}) => {
  const response = await fetch(`${appApiUrl}/transaction`, {
    method: "POST",
    redirect: "follow",
    headers,
    body: JSON.stringify({
      checkout_id: checkoutId,
      phone_number: phoneNumber,
    }),
  });
  const data = await response.json();
  console.log(data);

  return data;
};

export { checkout, checkTransaction, getQuotes };