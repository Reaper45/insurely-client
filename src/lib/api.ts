import { phoneNumber as nomalizePhoneNumber } from "lib/normalizer";

const headers = new Headers();
headers.append("Content-Type", "application/json");

const options: RequestInit = {
  method: "POST",
  headers,
  redirect: "follow",
};

const mpesaApiUrl = process.env.REACT_APP_MPESA_API_URL;
const appApiUrl = process.env.REACT_APP_API_URL;
const stkCallbackUrl = process.env.REACT_APP_MPESA_STK_CALLBACK;

//
const emailQuote = async ({
  quote,
  email,
  name,
  phoneNumber,
}: {
  quote: QuoteType | null;
  email: string;
  name: string;
  phoneNumber: string;
}) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/email/quote`, {
    ...options,
    body: JSON.stringify({ quote, email, name, phoneNumber }),
  });
  const data = await response.json();

  return data;
};

//
const emailPayment = async ({
  quote,
  name,
  email,
  phone_number,
  transaction_id,
}: {
  quote: QuoteType | null;
  name: string;
  email: string;
  phone_number: string;
  transaction_id: string;
}) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/email/payment`,
    {
      ...options,
      body: JSON.stringify({
        quote,
        customer: { name, email, phone_number },
        transaction_id,
      }),
    }
  );
  const data = await response.json();

  return data;
};

//
const getQuotes = async ({
  sumInsured,
  categoryId,
}: {
  sumInsured: string;
  categoryId: string;
}) => {
  const response = await fetch(`${appApiUrl}/calculate-quote`, {
    ...options,
    body: JSON.stringify({ sumInsured, categoryId }),
  });
  const data = await response.json();

  return data;
};

//
const sendOtp = async ({
  phoneNumber,
  name,
}: {
  name: string;
  phoneNumber: string;
}) => {
  const nomalizedPhoneNumber = nomalizePhoneNumber(phoneNumber);
  const response = await fetch(`${appApiUrl}/send-otp`, {
    ...options,
    body: JSON.stringify({ phoneNumber: nomalizedPhoneNumber, name }),
  });

  const data = await response.json();

  return data;
};

//
const verifyCode = async ({
  code,
  phoneNumber,
}: {
  code: string;
  phoneNumber: string;
}) => {
  const nomalizedPhoneNumber = nomalizePhoneNumber(phoneNumber);
  const response = await fetch(`${appApiUrl}/verify-otp`, {
    ...options,
    body: JSON.stringify({ code, phoneNumber: nomalizedPhoneNumber }),
  });
  const data = await response.json();

  return data;
};

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
    callbackURL: stkCallbackUrl,
    accountRef: "Other",
    phoneNumber: nomalizedPhoneNumber,
    transactionDescription: "Policy payment via insurely.cc",
  };

  const response = await fetch(`${mpesaApiUrl}/c2b/checkout`, {
    ...options,
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  return data;
};

//
const checkTransaction = async ({
  amount,
  phoneNumber,
}: {
  amount: string;
  phoneNumber: string;
}) => {
  const nomalizedPhoneNumber = nomalizePhoneNumber(phoneNumber);
  const response = await fetch(`${appApiUrl}/transaction`, {
    ...options,
    body: JSON.stringify({
      amount: 1,
      phone_number: nomalizedPhoneNumber,
    }),
  });
  const data = await response.json();

  return data;
};

//
const checkC2BTransaction = async ({
  amount,
  phoneNumber,
  mpesaRef
}: {
  amount: string;
  phoneNumber: string;
  mpesaRef: string;
}) => {
  const nomalizedPhoneNumber = nomalizePhoneNumber(phoneNumber);
  const response = await fetch(`${appApiUrl}/check-c2b-transaction`, {
    ...options,
    body: JSON.stringify({
      amount: 1,
      phone_number: nomalizedPhoneNumber,
      mpesa_ref: mpesaRef,
    }),
  });
  const data = await response.json();

  return data;
};

export {
  checkout,
  checkTransaction,
  checkC2BTransaction,
  getQuotes,
  sendOtp,
  verifyCode,
  emailQuote,
  emailPayment,
};
