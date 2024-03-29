import React, { ChangeEvent, useState } from "react";

import styled from "emotion";

import CheckboxInput from "components/ui/CheckboxInput";
import { FieldWrapper, Input } from "components/ui";

const OptionalBenefitWrapper = styled("div")`
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

declare global {
  type handleBenefitChangeFn = (props: {
    benefit: Partial<BenefitType>;
    selected: boolean;
  }) => void;
}

interface IProductOptionalBenefitsProps {
  benefits: BenefitType[];
  handleChange: handleBenefitChangeFn;
}

const OptionalBenefit: React.FC<{
  handleChange: handleBenefitChangeFn;
  benefit: Partial<BenefitType>;
}> = ({ benefit, handleChange }) => {
  const [sumInsured, setSumInsured] = useState("");
  const [checked, setChecked] = useState(false);

  // if (benefit!.is_adjustable) {
  //   console.log({ benefit });
  // }

  const handleOnCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget!.checked;
    setChecked(value);

    handleChange({
      benefit: { ...benefit, sumInsured },
      selected: value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget!.value;
    setSumInsured(value);
    handleChange({
      benefit: { ...benefit, sumInsured: value },
      selected: checked,
    });
  };

  return (
    <OptionalBenefitWrapper>
      <CheckboxInput label={benefit!.name} onChange={handleOnCheck} />
      {benefit!.description && (
        <div className="description">{benefit!.description}</div>
      )}
      {benefit!.is_adjustable && checked && (
        <div className="form">
          <FieldWrapper style={{ marginBottom: "0px" }}>
            <BenefitInput
              name="sumInsured"
              placeholder="Estimated value"
              value={sumInsured}
              onChange={handleInputChange}
            />
            <span className="label">KSH</span>
          </FieldWrapper>
        </div>
      )}
    </OptionalBenefitWrapper>
  );
};

const ProductOptionalBenefits: React.FC<IProductOptionalBenefitsProps> = ({
  benefits,
  handleChange,
}) => {
  return (
    <div>
      {benefits.map((benefit) => {
        return (
          <OptionalBenefit
            key={benefit.id}
            benefit={benefit}
            handleChange={handleChange}
          />
        );
      })}
    </div>
  );
};

export default ProductOptionalBenefits;
