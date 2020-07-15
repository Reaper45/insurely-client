import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";

import styled from "emotion";
import { Container, PageFooter } from "components/ui";
import PageLayout from "components/PageLayout";
import FormSection from "./FormSection";
import quotationForm, { IQuotationFormValues } from "./quotation-form";

import { ReactComponent as CloseLeftIcon } from "assets/icons/icon-cheveron-left.svg";

const FormContainer = styled("div")`
  width: 100%;
  @media (min-width: 768px) {
    max-width: 530px;
    width: 50%;
  }
`;

const QuotationForm = () => {
  const [stepNumber, setStepNumber] = useState(1);
  const step = quotationForm[stepNumber - 1];
  const isLastStep = (stepNumber === quotationForm.length);

  const next = (values: Partial<IQuotationFormValues>) => {
    setSnapshot(values);
    setStepNumber(stepNumber + 1);
  };

  const prev = () => {
    // setSnapshot(values);
    if (stepNumber > 1) setStepNumber(stepNumber - 1);
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

  const [snapshot, setSnapshot] = useState(mockInitialValues);

  const handleFormSubmit = async (
    values: Partial<IQuotationFormValues>,
    bag: FormikHelpers<Partial<IQuotationFormValues>>
  ) => {
    if (isLastStep) {
      console.log(values);
    } else {
      bag.setTouched({});
      next(values);
    }
  };

  return (
    <PageLayout
      title={`Step ${step.section} of 4`}
      onLogoClick={() => setStepNumber(1)}
    >
      {() => (
        <Formik
          initialValues={snapshot}
          onSubmit={handleFormSubmit}
          validationSchema={step.validationSchema}
        >
          {({ isSubmitting, handleSubmit }) => (
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
                      <CloseLeftIcon />
                      Back
                    </button>
                    <button
                      // disabled={}
                      // onClick={() => next(stepNumber)}
                      className="btn btn-primary"
                      type="submit"
                    >
                      {isLastStep
                        ? "Get Quote"
                        : "Next"}
                    </button>
                  </FormContainer>
                </Container>
              </PageFooter>
            </Form>
          )}
        </Formik>
      )}
    </PageLayout>
  );
};

export default QuotationForm;
