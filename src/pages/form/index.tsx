import React, { useReducer } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { RouteChildrenProps } from "react-router-dom";

import styled from "emotion";
import { Container, PageFooter, Input } from "components/ui";
import PageLayout from "components/PageLayout";
import Modal from "components/ui/Modal";
import FormSection from "./FormSection";
import { FieldWrapper } from "./FormFields";

import quotationForm, { IQuotationFormValues } from "./quotation-form";

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
  .error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: rgba(229, 62, 62, 0.15);
    margin-bottom: 1rem;
    border-left: solid 2px ${(props) => props.theme.colors.red};
    div {
      color: ${(props) => props.theme.colors.red};
    }
    svg {
      fill: ${(props) => props.theme.colors.red};
      height: 20px;
    }
  }
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
  const {
    phoneNumberState,
    phoneNumber,
    showOTPModal,
    stepNumber,
    otp,
  } = state;

  const step = quotationForm[stepNumber - 1];
  const isLastStep = stepNumber === quotationForm.length;
  const hasPhoneNumber = step.form.fields.find((f) => f.name === "phoneNumber");

  // Request Details
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const next = () => {
    dispatch({ type: ActionTypes.step, payload: stepNumber + 1 });
  };
  const options: RequestInit = {
    method: "POST",
    headers: headers,
    redirect: "follow",
  };

  const prev = () => {
    if (stepNumber > 1)
      dispatch({
        type: ActionTypes.step,
        payload: stepNumber - 1,
      });
  };

  const mockInitialValues = (): Partial<IQuotationFormValues> => {
    return quotationForm.reduce((prevValue, nextValue) => {
      // @ts-ignore
      const fieldsValues = nextValue.form.fields.reduce((fields, field) => {
        let init = field!.name ? { [field.name]: "" } : {};
        if (field.children) {
          const childrenValues = field.children.reduce((i, child) => {
            return { ...i, ...(child!.name ? { [child.name]: "" } : {}) };
          }, {});

          return { ...fields, ...childrenValues };
        }
        return {
          ...init,
          ...fields,
        };
      }, {});
      return { ...prevValue, ...fieldsValues };
    }, {});
  };

  const setOTP = async ({ phoneNumber }: { phoneNumber?: string }) => {
    dispatch({
      type: ActionTypes.phoneNumber,
      payload: phoneNumber,
    });
    const res = await fetch(`${process.env.REACT_APP_API_URL}/send-otp`, {
      ...options,
      body: JSON.stringify({ phoneNumber }),
    });
    console.log(res);
  };

  const handleFormSubmit = async (
    values: Partial<IQuotationFormValues>,
    bag: FormikHelpers<Partial<IQuotationFormValues>>
  ) => {
    if (isLastStep) {
      history.push("/quotations");
    } else if (
      hasPhoneNumber &&
      phoneNumberState !== PhoneNumberState.verified
    ) {
      setOTP({ phoneNumber: values.phoneNumber });

      dispatch({
        type: ActionTypes.modal,
        payload: true,
      });
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

  const verifyPhoneNumber = () => {
    dispatch({
      type: ActionTypes.phoneNumberState,
      payload: PhoneNumberState.verifying,
    });
    // TODO: verify -> change phoneNumberState -> next if verified;
    fetch(`${process.env.REACT_APP_API_URL}/verify-otp`, {
      ...options,
      body: JSON.stringify({ code: otp, phoneNumber }),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
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
      })
      .catch((err) => {
        console.error(err);
         dispatch({
           type: ActionTypes.phoneNumberState,
           payload: PhoneNumberState.failed,
         });
      })
      .finally(() => {});
  };

  const initialFormValues = mockInitialValues();

  return (
    <PageLayout title={`Step ${step.section} of 4`} onLogoClick={reset}>
      {() => (
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          validationSchema={step.validationSchema}
        >
          {({ values, handleSubmit }) => (
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
                      <button
                        onClick={() => prev()}
                        disabled={stepNumber === 1}
                        className="btn btn-primary link icon-left"
                        type="button"
                      >
                        <CheveronLeftIcon />
                        Back
                      </button>
                      <button
                        // disabled={}
                        // onClick={() => next(stepNumber)}
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
              >
                <VerifyModalContent>
                  {phoneNumberState === PhoneNumberState.failed && (
                    <div className="error">
                      <div>Verification failed</div>
                      <NotificationIcon />
                    </div>
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
                      value={otp}
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
                      onClick={()=> setOTP({ phoneNumber: values.phoneNumber })}
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
