/* eslint-disable react-hooks/exhaustive-deps */
import React, { useReducer, useEffect } from "react";
import numeral from "numeral";
import { Redirect } from "react-router-dom";

import styled from "emotion";
import { checkC2BTransaction, checkout as pay, checkTransaction, emailPayment } from "lib/api";
import { isValidSafaricomNumber } from "lib/validate";
import Modal from "components/ui/Modal";
import { Input, FieldWrapper, Message, FieldError } from "components/ui";

import { ReactComponent as CurrencyIcon } from "assets/icons/icon-currency-dollar.svg";
import { ReactComponent as CheckCircleIcon } from "assets/icons/icon-check-circle.svg";
import { ReactComponent as CheveronDownIcon } from "assets/icons/icon-cheveron-down.svg";
import { ReactComponent as NotificationIcon } from "assets/icons/icon-notification.svg";

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
  incomplete = "incomplete", // STK was successful but canceled / insufficient payment
}

interface IState {
  phoneNumber: string;
  manualCheckout: boolean;
  payment: PaymentStates;
  checkoutId: string;
  mpesaRef: string;
}

const initialState: IState = {
  phoneNumber: "",
  manualCheckout: false,
  payment: PaymentStates.pending,
  checkoutId: "",
  mpesaRef: ""
};

enum ActionTypes {
  phoneNumber = "PHONE_NUMBER",
  manualCheckout = "MANUAL_CHECKOUT",
  payment = "PAYMENT_STATE",
  checkoutId = "CHECKOUT_ID",
  mpesaRef = "MPESA_REF",
}

interface IAction {
  type: ActionTypes;
  payload?: any;
}

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.phoneNumber:
      return { ...state, phoneNumber: action.payload };
    case ActionTypes.manualCheckout:
      return { ...state, manualCheckout: action.payload };
    case ActionTypes.payment:
      return { ...state, payment: action.payload };
    case ActionTypes.checkoutId:
      return { ...state, checkoutId: action.payload };
    case ActionTypes.mpesaRef:
      return { ...state, mpesaRef: action.payload };
    default:
      return state;
  }
};

const Checkout: React.FC<{
  show: boolean;
  close: () => void;
  amount: string;
  customer: {
    phoneNumber: string;
    email: string;
    name: string;
  };
  quote: QuoteType | null;
}> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: ActionTypes.phoneNumber,
      payload: props.customer.phoneNumber,
    });
  }, []);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const initiatePayment = async () => {
    dispatch({
      type: ActionTypes.payment,
      payload: PaymentStates.processing,
    });

    const data = await pay({
      amount: props.amount,
      phoneNumber: state.phoneNumber,
    });

    if (data) {
      dispatch({
        type: ActionTypes.payment,
        payload: PaymentStates.success,
      });
      dispatch({
        type: ActionTypes.checkoutId,
        payload: data.MPESA_RESPONSE.CheckoutRequestID,
      });
      // Wait 45 sec then try confirming payment
      setTimeout(confirmPayment, 45000);
    }
  };

  const confirmPayment = () => {
    dispatch({
      type: ActionTypes.payment,
      payload: PaymentStates.confirming,
    });

    let pollCount = 0;
    let stateHolder = state.payment;
    const refreshId = setInterval(async () => {
      pollCount += 1;
      if (
        pollCount === 6 ||
        stateHolder === PaymentStates.confirmed ||
        stateHolder === PaymentStates.failed
      ) {
        clearInterval(refreshId);
      } else {
        checkTransaction({
          amount: props.amount,
          phoneNumber: state.phoneNumber,
        })
          .then(({ data }) => {
            console.log({ pollCount });
            if (data.received && data.transaction !== null) {
              console.log({ data });
              stateHolder = PaymentStates.confirmed;
              dispatch({
                type: ActionTypes.payment,
                payload: PaymentStates.confirmed,
              });
              return emailPayment({
                email: props.customer.email,
                name: props.customer.name,
                phone_number: props.customer.phoneNumber,
                quote: props.quote,
                transaction_id: data.transaction.id,
              });
            }
            stateHolder = PaymentStates.failed;

            dispatch({
              type: ActionTypes.payment,
              payload: PaymentStates.failed,
            });
          })
          .catch(console.error);
      }
    }, 10000);
  };

  const confirmC2BPayment = () => {
    dispatch({
      type: ActionTypes.payment,
      payload: PaymentStates.confirming,
    });

    let pollCount = 0;
    let stateHolder = state.payment;
    const refreshId = setInterval(async () => {
      pollCount += 1;
      if (
        pollCount === 6 ||
        stateHolder === PaymentStates.confirmed ||
        stateHolder === PaymentStates.failed
      ) {
        clearInterval(refreshId);
      } else {
        console.log({
          amount: props.amount,
          phoneNumber: state.phoneNumber,
          mpesaRef: state.mpesaRef,
        });
        checkC2BTransaction({
          amount: "1", // props.amount,
          phoneNumber: state.phoneNumber,
          mpesaRef: state.mpesaRef
        })
          .then(({ data }) => {
            console.log({ pollCount });
            if (data.received && data.transaction !== null) {
              console.log({ data });
              stateHolder = PaymentStates.confirmed;
              dispatch({
                type: ActionTypes.payment,
                payload: PaymentStates.confirmed,
              });
              return emailPayment({
                email: props.customer.email,
                name: props.customer.name,
                phone_number: props.customer.phoneNumber,
                quote: props.quote,
                transaction_id: data.transaction.id,
              });
            }
            stateHolder = PaymentStates.failed;

            dispatch({
              type: ActionTypes.payment,
              payload: PaymentStates.failed,
            });
          })
          .catch(console.error);
      }
    }, 300);
  };

  if (state.payment === PaymentStates.confirmed) {
    return <Redirect to="/quotations/complete" />;
  }

  const isValidPhoneNumber = isValidSafaricomNumber(state.phoneNumber);

  return (
    <Modal
      title="Checkout"
      show={props.show}
      close={props.close}
      loading={
        state.payment === PaymentStates.confirming ||
        state.payment === PaymentStates.processing
      }
    >
      <CheckoutModalContent>
        {(state.payment === PaymentStates.success ||
          state.payment === PaymentStates.failed) && (
          <Message
            className={
              state.payment === PaymentStates.success
                ? "success"
                : state.payment === PaymentStates.failed
                ? "error"
                : ""
            }
          >
            <div>
              {state.payment === PaymentStates.success
                ? "Success. Payment notification sent."
                : state.payment === PaymentStates.failed
                ? "Could not complete! Pay & confirm manually!"
                : ""}
            </div>
            {state.payment === PaymentStates.success ? (
              <CheckCircleIcon />
            ) : (
              <NotificationIcon />
            )}
          </Message>
        )}

        <FieldWrapper style={{ marginBottom: "1.5rem" }}>
          <Input
            name="phoneNumber"
            placeholder={state.phoneNumber}
            type="text"
            value={state.phoneNumber}
            className={isValidPhoneNumber ? "" : "error"}
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
                alt="Safaricom logo"
              />
              <CheckCircleIcon />
            </div>
          </PhoneNumberLabel>
          {!isValidPhoneNumber && (
            <FieldError>Enter a correct Safaricom number.</FieldError>
          )}
        </FieldWrapper>
        <CheckoutManualProcess collapse={!state.manualCheckout}>
          <div
            className="header flex justify-space-between"
            onClick={() =>
              dispatch({
                type: ActionTypes.manualCheckout,
                payload: !state.manualCheckout,
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
                Enter Business number <b>4044237</b>
              </li>
              <li>
                Enter Account number <b>{state.phoneNumber}</b>
              </li>
              <li>
                Enter the Amount <b>{numeral(props.amount).format("0,0")}</b>
              </li>
              <li>Enter your M-PESA PIN and Send</li>
              <li>You will receive a confirmation SMS from M-PESA</li>
              <li>
                Enter the transaction code &amp; click to confirm payment.
              </li>
            </ol>
            <TransactionCodeField className="flex justify-center align-stretch">
              <Input
                name="code"
                placeholder="M-PESA transaction code"
                onChange={(e) => {
                  dispatch({
                    type: ActionTypes.mpesaRef,
                    payload: e.currentTarget.value,
                  });
                }}
              />
              <button className="btn btn-primary" onClick={confirmC2BPayment}>
                Confirm
              </button>
            </TransactionCodeField>
          </div>
        </CheckoutManualProcess>
        {!state.manualCheckout && (
          <CheckoutBtnGroup className="flex justify-space-between align-stretch">
            <button
              className="btn btn-light btn-verify mr-2"
              onClick={props.close}
            >
              Cancel
            </button>
            <button
              onClick={initiatePayment}
              className="btn btn-primary w-full icon-left"
              type="button"
              disabled={state.payment !== PaymentStates.pending}
            >
              <CurrencyIcon />
              Complete payment: Ksh. {numeral(props.amount).format("0,0")}
            </button>
          </CheckoutBtnGroup>
        )}
      </CheckoutModalContent>
    </Modal>
  );
};

export default Checkout;
