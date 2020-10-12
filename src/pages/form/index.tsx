import React, { useReducer } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { RouteChildrenProps } from "react-router-dom";

import styled from "emotion";
import { sendOtp, verifyCode } from "lib/api";

import {
  Container,
  PageFooter,
  Input,
  FieldWrapper,
  Message,
} from "components/ui";
import PageLayout from "components/PageLayout";
import Modal from "components/ui/Modal";
import FormSection from "./FormSection";

import quotationForm, {
  IQuotationFormValues,
  initialValues,
} from "./quotation-form";

import { ReactComponent as CheveronLeftIcon } from "assets/icons/icon-cheveron-left.svg";
import { ReactComponent as CheveronRightIcon } from "assets/icons/icon-cheveron-right.svg";
import { ReactComponent as LockClosedIcon } from "assets/icons/icon-lock-closed.svg";
import { ReactComponent as NotificationIcon } from "assets/icons/icon-notification.svg";

const FormContainer = styled("div")`
  width: 100%;
  @media (min-width: 768px) {
    max-width: 530px;
    width: 50%;
  }
`;

const VerifyModalContent = styled("div")`
  .description {
    margin-bottom: 1.5rem;
    p {
      color: ${(props) => props.theme.colors.secondary};
      font-size: small;
      margin-bottom: 0.4rem;
    }
    label {
      display: block;
      color: ${(props) => props.theme.colors.dark};
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5pt;
    }
  }
  button {
    font-weight: 700;
  }
  .btn-verify {
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 1.375rem;
    svg {
      fill: ${(props) => props.theme.colors.white};
      opacity: 0.33;
      height: 16px;
      width: 16px;
    }
  }
  .link {
    font-size: small;
    padding: 0 5px;
  }
`;

enum PhoneNumberState {
  verified = "verified",
  failed = "failed",
  verifying = "verifying",
  pending = "pending",
  sending = "sending",
  sent = "sent",
}

interface IState {
  stepNumber: number;
  showOTPModal: boolean;
  phoneNumberState: PhoneNumberState;
  formValues: IQuotationFormValues | {};
  otp: string;
  phoneNumber: string;
}

const initialState: IState = {
  stepNumber: 1,
  showOTPModal: false,
  phoneNumberState: PhoneNumberState.pending,
  formValues: {},
  otp: "",
  phoneNumber: "",
};

enum ActionTypes {
  modal = "MODAL",
  step = "STEP",
  phoneNumber = "PHONE_NUMBER",
  phoneNumberState = "PHONE_NUMBER_STATE",
  reset = "RESET",
  formValues = "FORM_VALUES",
  otp = "OTP_CODE",
}

interface IAction {
  type: ActionTypes;
  payload?: any;
}

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.step:
      return { ...state, stepNumber: action.payload };
    case ActionTypes.modal:
      return { ...state, showOTPModal: action.payload };
    case ActionTypes.phoneNumberState:
      return { ...state, phoneNumberState: action.payload };
    case ActionTypes.phoneNumber:
      return { ...state, phoneNumber: action.payload };
    case ActionTypes.formValues:
      return { ...state, formValues: action.payload };
    case ActionTypes.otp:
      return { ...state, otp: action.payload };
    case ActionTypes.reset:
      return initialState;
    default:
      return state;
  }
};

const QuotationForm: React.FC<RouteChildrenProps> = ({ history }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { phoneNumberState, showOTPModal, stepNumber } = state;

  const step = quotationForm[stepNumber - 1];
  const isLastStep = stepNumber === quotationForm.length;
  const hasPhoneNumber = step.form.fields.find((f) => f.name === "phoneNumber");

  const next = () => {
    dispatch({ type: ActionTypes.step, payload: stepNumber + 1 });
  };

  const prev = () => {
    if (stepNumber > 1)
      dispatch({
        type: ActionTypes.step,
        payload: stepNumber - 1,
      });
  };

  const setOTP = async (phoneNumber: string, name: string) => {
    dispatch({
      type: ActionTypes.phoneNumber,
      payload: phoneNumber,
    });
    dispatch({
      type: ActionTypes.phoneNumberState,
      payload: PhoneNumberState.sending,
    });

    const data = await sendOtp({ phoneNumber, name });
    if (data) {
      dispatch({
        type: ActionTypes.phoneNumberState,
        payload: PhoneNumberState.sent,
      });
    }
  };

  const handleFormSubmit = async (
    values: Partial<IQuotationFormValues>,
    bag: FormikHelpers<Partial<IQuotationFormValues>>
  ) => {
    if (isLastStep) {
      history.push("/quotations", {
        form: values,
      });
    } else if (
      hasPhoneNumber &&
      phoneNumberState !== PhoneNumberState.verified
    ) {
      dispatch({
        type: ActionTypes.modal,
        payload: true,
      });
      if (values.phoneNumber && values.firstName)
        await setOTP(values.phoneNumber, values.firstName);
    } else {
      bag.setTouched({});
      next();
    }
  };

  const reset = () => {
    dispatch({
      type: ActionTypes.reset,
    });
  };

  const verifyPhoneNumber = async () => {
    dispatch({
      type: ActionTypes.phoneNumberState,
      payload: PhoneNumberState.verifying,
    });

    const { data } = await verifyCode({
      code: state.otp,
      phoneNumber: state.phoneNumber,
    });
    if (data.verified) {
      dispatch({
        type: ActionTypes.phoneNumberState,
        payload: PhoneNumberState.verified,
      });
      dispatch({
        type: ActionTypes.modal,
        payload: false,
      });
      next();
    } else {
      dispatch({
        type: ActionTypes.phoneNumberState,
        payload: PhoneNumberState.failed,
      });
    }
  };

  return (
    <PageLayout title={`Step ${step.section} of 4`} onLogoClick={reset}>
      {() => (
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={step.validationSchema}
        >
          {({ values, handleSubmit, isValid, isSubmitting, dirty }) => (
            <div>
              <Form onSubmit={handleSubmit}>
                <Container>
                  <FormContainer
                    style={{
                      padding: "1.5rem 0",
                    }}
                  >
                    <FormSection
                      key={step.stepNumber}
                      form={step.form}
                      active={step.stepNumber === stepNumber}
                    />
                  </FormContainer>
                </Container>
                <PageFooter>
                  <Container>
                    <FormContainer className="flex justify-space-between">
                      <div>
                        {stepNumber !== 1 && (
                          <button
                            onClick={() => prev()}
                            disabled={stepNumber === 1}
                            className="btn btn-primary link icon-left"
                            type="button"
                          >
                            <CheveronLeftIcon />
                            Back
                          </button>
                        )}
                      </div>
                      <button
                        disabled={
                          phoneNumberState === PhoneNumberState.sending ||
                          !isValid ||
                          isSubmitting
                          // !dirty <- TODO: Uncomment
                        }
                        className="btn btn-primary"
                        type="submit"
                      >
                        {isLastStep ? "Get Quote" : "Next"}
                      </button>
                    </FormContainer>
                  </Container>
                </PageFooter>
              </Form>
              <Modal
                title="OTP Verification"
                show={showOTPModal}
                close={() => {
                  dispatch({
                    type: ActionTypes.modal,
                    payload: false,
                  });
                }}
                loading={
                  state.phoneNumberState === PhoneNumberState.sending ||
                  state.phoneNumberState === PhoneNumberState.verifying
                }
              >
                <VerifyModalContent>
                  {phoneNumberState === PhoneNumberState.failed && (
                    <Message className="error">
                      <div>Verification failed</div>
                      <NotificationIcon />
                    </Message>
                  )}
                  <div className="description">
                    <p>Enter the code you receiver to </p>
                    <label>{values.phoneNumber || "0719 747 XXX"}</label>
                  </div>
                  <FieldWrapper style={{ marginBottom: "1.5rem" }}>
                    <Input
                      name=""
                      placeholder="OTP Code"
                      type=""
                      value={state.otp}
                      onChange={(e) => {
                        dispatch({
                          type: ActionTypes.otp,
                          payload: e.currentTarget.value,
                        });
                      }}
                    />
                  </FieldWrapper>
                  <button
                    disabled={phoneNumberState === PhoneNumberState.verifying}
                    className="btn btn-primary icon-left w-full btn-verify"
                    onClick={verifyPhoneNumber}
                  >
                    <LockClosedIcon />
                    {phoneNumberState === PhoneNumberState.verifying
                      ? "Verifying"
                      : "Verify & submit"}
                  </button>
                  <div>
                    <button
                      onClick={() => {
                        if (values.phoneNumber && values.firstName)
                          setOTP(values.phoneNumber, values.firstName);
                      }}
                      className="btn btn-primary link icon-right"
                      type="button"
                    >
                      RESEND CODE
                      <CheveronRightIcon />
                    </button>
                  </div>
                </VerifyModalContent>
              </Modal>
            </div>
          )}
        </Formik>
      )}
    </PageLayout>
  );
};

export default QuotationForm;
