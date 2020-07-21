import React, { useReducer, useEffect } from "react";
import numeral from "numeral";

import styled from "emotion";

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
    padding: 10px 16px;
    &.btn-primary {
      color: rgba(255, 255, 255, 0.66);
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
  }
`;

const CheckoutManualProcess = styled("div")<{ collapse: boolean }>`
  background: ${(props) => props.theme.colors.light};
  padding: 0 1rem 0 1.5rem;
  margin-bottom: 2rem;
  border-radius: ${(props) => (props.collapse ? "2rem" : "1rem")};
  > .header {
    padding: 10px 0;
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
    li {
      padding: 8px;
      font-size: 14px;
      color: color: ${(props) => props.theme.colors.dark};
    }
  }
`;

interface IState {
  newPhoneNumber: string;
  manualCheckout: boolean;
}

const initialState: IState = {
  newPhoneNumber: "",
  manualCheckout: false,
};

enum ActionTypes {
  phoneNumber = "PHONE_NUMBER",
  manualCheckout = "MANUAL_CHECKOUT",
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
              <img src={require("../assets/img/saf.png")} alt="Safaricom ogo" />
              <CheckCircleIcon />
            </div>
          </PhoneNumberLabel>
        </FieldWrapper>
        <CheckoutManualProcess collapse={!manualCheckout}>
          <div
            className="header flex  justify-space-between"
            onClick={() =>
              dispatch({
                type: ActionTypes.manualCheckout,
                payload: !manualCheckout,
              })
            }
          >
            <div className="title">or complete manually</div>
            <CheveronDownIcon />
          </div>
          <div className="content">
            <ol type="1">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ol>
          </div>
        </CheckoutManualProcess>
        <CheckoutBtnGroup className="flex justify-space-between align-stretch">
          <button
            className="btn btn-light btn-verify flex  align-center mr-2"
            onClick={close}
          >
            Cancel
          </button>
          <button
            // onClick={() => setOTP({ phoneNumber: values.phoneNumber })}
            className="btn btn-primary w-full icon-left"
            type="button"
          >
            <CurrencyIcon />
            Complete payment: Ksh. {numeral(amount).format("0,0")}
          </button>
        </CheckoutBtnGroup>
      </CheckoutModalContent>
    </Modal>
  );
};

export default Checkout;
