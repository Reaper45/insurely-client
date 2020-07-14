import React, { useState } from "react";

import { IFormSection } from "types";

import styled from "emotion";
import { Container, PageFooter } from "components/ui";
import PageLayout from "components/PageLayout";
import FormSection from "./FormSection";
import quotationForm from "./quotation-form";

import { ReactComponent as CloseLeftIcon } from "assets/icons/icon-cheveron-left.svg";

const FormContainer = styled("div")`
  width: 100%;
  @media (min-width: 768px) {
    max-width: 530px;
    width: 50%;
  }
`;

const QuotationForm = () => {
  const [step, setStep] = useState(1);

  const next = (state: number) => {
    if (state !== quotationForm.length) setStep(state + 1);
  };

  const prev = (state: number) => {
    if (state > 1) setStep(state - 1);
  };

  // Get form section to reflect on the title
  const getSection = () => quotationForm.find((sec) => sec.step === step);

  return (
    <PageLayout title={`Step ${getSection()?.section} of 4`}>
      {() => (
        <>
          <Container>
            <FormContainer
              style={{
                padding: "1.5rem 0",
              }}
            >
              {quotationForm.map(formSection => (
                <FormSection
                  key={formSection.step}
                  form={formSection.form}
                  active={formSection.step === step}
                />
              ))}
            </FormContainer>
          </Container>
          <PageFooter>
            <Container>
              <FormContainer className="flex justify-space-between">
                <button
                  onClick={() => prev(step)}
                  disabled={step === 1}
                  className="btn btn-primary link icon-left"
                >
                  <CloseLeftIcon />
                  Back
                </button>
                <button
                  // disabled={}
                  onClick={() => next(step)}
                  className="btn btn-primary"
                >
                  {step === quotationForm.length ? "Get Quote" : "Next"}
                </button>
              </FormContainer>
            </Container>
          </PageFooter>
        </>
      )}
    </PageLayout>
  );
};

export default QuotationForm;
