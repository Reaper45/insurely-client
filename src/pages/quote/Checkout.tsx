import React, { useReducer, useEffect } from "react";
import numeral from "numeral";

import styled from "emotion";
import { phoneNumber as nomalizePhoneNumber } from "lib/normalizer";
import Modal from "components/ui/Modal";
import { Input, FieldWrapper } from "components/ui";

import { ReactComponent as CurrencyIcon } from "assets/icons/icon-currency-dollar.svg";
import { ReactComponent as CheckCircleIcon } from "assets/icons/icon-check-circle.svg";
import { ReactComponent as CheveronDownIcon } from "assets/icons/icon-cheveron-down.svg";

const CheckoutModalContent = styled("div")`
  border-radius: 5px;
  width: 100%;
  background: ${(props) => props.theme.colors.white};
  box-sizing: border-box;
`;

const CheckoutBtnGroup = styled("div")`
  > button {
    font-weight: 700;
    line-height: 2;
    text-align: center;
  }
  @media (max-width: 481px) {
    flex-wrap: wrap;
    button {
      flex-grow: 1;
      :first-of-type {
        margin-bottom: 0.5rem;
        margin-right: 0;
        width: 100%;
      }
    }
  }
`;

const PhoneNumberLabel = styled("div")`
  position: absolute;
  top: 5px;
  right: 1rem;
  > div {
    max-height: 50px;
    img {
      height: 50px;
      margin-right: 1rem;
    }
    svg {
      fill: ${(props) => props.theme.colors.green};
      height: 20px;
    }
    @media (max-width: 481px) {
      max-height: 40px;
      img {
        height: 40px;
      }
    }
  }
`;

const CheckoutManualProcess = styled("div")<{ collapse: boolean }>`
  background: ${(props) => props.theme.colors.light};
  padding: 0 1rem 0 1.5rem;
  margin-bottom: 2rem;
  border-radius: ${(props) => (props.collapse ? "2rem" : "1rem")};
  > .header {
    padding: 8px 0;
    font-size: 14px;
    cursor: pointer;
    .title {
      font-weight: 700;
      color: ${(props) => props.theme.colors.dark};
    }
    svg {
      fill: ${(props) => props.theme.colors.dark};
      transform: rotate(${(props) => (props.collapse ? "0deg" : "180deg")});
    }
  }
  .content {
    max-height: ${(props) => (props.collapse ? "0" : "410px")};
    padding: ${(props) => (props.collapse ? "0" : "0 1rem 1.5rem")};
    opacity: ${(props) => (props.collapse ? "0" : "1")};
    transition: all ease-in-out 200ms;
    ${(props) =>
      props.collapse &&
      `
      position: relative;
      z-index: -1;
    `}
    li {
      padding: 8px;
      font-size: 14px;
      color: ${(props) => props.theme.colors.dark};
    }
  }
`;

const TransactionCodeField = styled(FieldWrapper)`
  margin-left: -1rem;
  margin-right: -1rem;
  margin-top: 8px;
  margin-bottom: 0 !important;
  > input {
    border-color: ${(props) => props.theme.colors.light};
    padding: 8px !important;
    border-radius: 5px;
    margin-right: 1rem;
    font-size: 14px;
  }
`;

enum PaymentStates {
  pending = "pending",
  processing = "processing",
  confirming = "confirming",
  success = "success", // STK push was successful
  failed = "failed", // STK push failed
  confirmed = "confirmed", // Payment received
  incomplete = "incomplete" // STK was successful but canceled / insufficient payment
}

interface IState {
  newPhoneNumber: string;
  manualCheckout: boolean;
  payment: PaymentStates;
}

const initialState: IState = {
  newPhoneNumber: "",
  manualCheckout: false,
  payment: PaymentStates.pending,
};

enum ActionTypes {
  phoneNumber = "PHONE_NUMBER",
  manualCheckout = "MANUAL_CHECKOUT",
  payment = "PAYMENT_STATE"
}

interface IAction {
  type: ActionTypes;
  payload?: any;
}

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.phoneNumber:
      return { ...state, newPhoneNumber: action.payload };
    case ActionTypes.manualCheckout:
      return { ...state, manualCheckout: action.payload };
    case ActionTypes.payment:
      return { ...state, payment: action.payload };
    default:
      return state;
  }
};

const Checkout: React.FC<{
  show: boolean;
  close: () => void;
  amount: string;
  phoneNumber: string;
}> = ({ amount, close, phoneNumber, show }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { newPhoneNumber, manualCheckout } = state;

  useEffect(() => {
    dispatch({
      type: ActionTypes.phoneNumber,
      payload: phoneNumber,
    });
  }, [phoneNumber]);

  const initiatePayment = async () => {
    dispatch({
      type: ActionTypes.payment,
      payload: PaymentStates.processing,
    });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const nomalizedPhoneNumber = nomalizePhoneNumber(phoneNumber);
    const payload = {
      amount: 5, // TODO: Replace with actual amout
      callbackURL: process.env.REACT_APP_MPESA_CALLBACK,
      accountRef: "Other",
      phoneNumber: nomalizedPhoneNumber,
      transactionDescription: "Some desc",
    };

    const response = await fetch(
      `${process.env.REACT_APP_MPESA_API_URL}/c2b/checkout`,
      {
        method: "POST",
        redirect: "follow",
        headers,
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    console.log(data);
    if(data) {
      dispatch({
        type: ActionTypes.payment,
        payload: PaymentStates.success,
      });
    }
  };

  // TODO: poll for transaction
  const confirmPayment = () => {}

  return (
    <Modal title="Checkout" show={show} close={close}>
      <CheckoutModalContent>
        <FieldWrapper style={{ marginBottom: "1.5rem" }}>
          <Input
            name=""
            placeholder={phoneNumber}
            type=""
            value={newPhoneNumber}
            onChange={(e) => {
              dispatch({
                type: ActionTypes.phoneNumber,
                payload: e.currentTarget.value,
              });
            }}
          />
          <PhoneNumberLabel>
            <div className="flex justify-center align-center">
              <img
                src={require("../../assets/img/saf.png")}
                alt="Safaricom ogo"
              />
              <CheckCircleIcon />
            </div>
          </PhoneNumberLabel>
        </FieldWrapper>
        <CheckoutManualProcess collapse={!manualCheckout}>
          <div
            className="header flex justify-space-between"
            onClick={() =>
              dispatch({
                type: ActionTypes.manualCheckout,
                payload: !manualCheckout,
              })
            }
          >
            <div className="title">Or complete manually</div>
            <CheveronDownIcon />
          </div>
          <div className="content">
            <ol type="1">
              <li>
                In your M-PESA, select <b>Pay Bill</b> option
              </li>
              <li>
                Enter Business number <b>000000</b>
              </li>
              <li>
                Enter Account number <b>{phoneNumber}</b>
              </li>
              <li>
                Enter the Amount <b>{numeral(amount).format("0,0")}</b>
              </li>
              <li>Enter your M-PESA PIN and Send</li>
              <li>You will receive a confirmation SMS from M-PESA</li>
              <li>Enter the transaction code & click to confirm payment.</li>
            </ol>
            <TransactionCodeField className="flex justify-center align-stretch">
              <Input name="code" placeholder="M-PESA transaction code" />
              <button className="btn btn-primary">Confirm</button>
            </TransactionCodeField>
          </div>
        </CheckoutManualProcess>
        {!manualCheckout && (
          <CheckoutBtnGroup className="flex justify-space-between align-stretch">
            <button className="btn btn-light btn-verify mr-2" onClick={close}>
              Cancel
            </button>
            <button
              onClick={initiatePayment}
              className="btn btn-primary w-full icon-left"
              type="button"
            >
              <CurrencyIcon />
              Complete payment: Ksh. {numeral(amount).format("0,0")}
            </button>
          </CheckoutBtnGroup>
        )}
      </CheckoutModalContent>
    </Modal>
  );
};

export default Checkout;
