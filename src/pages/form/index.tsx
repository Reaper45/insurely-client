import React from 'react';

import styled from "emotion";
import { Container, Main, PageFooter } from "components/ui";
import { ReactComponent as CloseLeftIcon } from "assets/icons/icon-cheveron-left.svg";
import PersonalInfoForm from "./PersonalInfoForm";

const FormContainer = styled("div")`
  width: 100%;
  @media (min-width: 768px) {
    max-width: 50%;
  }
`;

const QuotationForm = () => {
  return (
    <Main>
      <Container>
        <FormContainer style={{
            padding: "1.5rem 0"
        }}>
          <PersonalInfoForm />
        </FormContainer>
      </Container>
      <PageFooter>
        <Container>
          <FormContainer className="flex justify-space-between">
            <button className="btn btn-primary link icon-left">
              <CloseLeftIcon />
              Back
            </button>
            <button className="btn btn-primary">Next</button>
          </FormContainer>
        </Container>
      </PageFooter>
    </Main>
  );
}

export default QuotationForm;
