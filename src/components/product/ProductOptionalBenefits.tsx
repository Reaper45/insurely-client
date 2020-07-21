import React from "react";

import styled from "emotion";
import { BenefitType } from "types";

import CheckboxInput from "components/ui/CheckboxInput";
import { FieldWrapper, Input } from "components/ui";

const OptionalBenefit = styled("div")`
  margin-bottom: 0.25rem;
  .checkbox-label {
    font-size: 15px;
  }
  > label > input {
    padding: 6px !important;
  }
  .description {
    font-size: small;
    color: ${(props) => props.theme.colors.gray};
  }
  .form {
    margin-top: 0.5rem;
    max-width: 100%;
    @media (min-width: 768px) {
      max-width: 45%;
      min-width: 220px;
    }
    span.label {
      top: 8px;
      right: 16px;
      font-size: 14px;
      @media (max-width: 768px) {
        top: 12px;
      }
    }
  }
`;

const BenefitInput = styled(Input)`
  padding: 8px 16px !important;
  font-size: 14px !important;
  border-radius: 5px !important;
  @media (max-width: 768px) {
    padding: 12px 16px !important;
  }
`;

interface IProductOptionalBenefitsProps {
  benefits: BenefitType[];
}

const ProductOptionalBenefits: React.FC<IProductOptionalBenefitsProps> = ({
  benefits,
}) => {
  return (
    <div>
      <OptionalBenefit>
        <CheckboxInput label="Road Rescue" />
        {/* <div className="description">Road rescue services from AA</div> */}
      </OptionalBenefit>
      <OptionalBenefit>
        <CheckboxInput label="Entertainment unit" />
        <div className="form">
          <FieldWrapper style={{ marginBottom: "0px" }}>
            <BenefitInput name="sumInsured" placeholder="Estimated value" />
            <span className="label">KSH</span>
          </FieldWrapper>
        </div>
      </OptionalBenefit>
      <OptionalBenefit>
        <CheckboxInput label="Excess protector" />
      </OptionalBenefit>
    </div>
  );
};

export default ProductOptionalBenefits;
