import React from "react";

import styled from "emotion";

import { ReactComponent as XIcon } from "assets/icons/icon-exclamation.svg";
import { ReactComponent as CheckCircleIcon } from "assets/icons/icon-check-circle.svg";

interface IProductBenefitsProps {
  benefits: BenefitType[];
}

const ProductBenefit = styled("div")<{ included?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin-bottom: .25rem;
  color: ${(props) =>
    props.included ? props.theme.colors.secondary : props.theme.colors.red};
  span {
    margin-left: .5rem;
    font-size: 16px;
    :first-of-type {
      flex-grow: 1;
    }
  }
  svg {
    height: 18px;
    width: 18px;
    fill: ${(props) =>
      props.included ? props.theme.colors.green : props.theme.colors.red};
  }
`;

const ProductBenefits: React.FC<IProductBenefitsProps> = ({ benefits }) => {
  return (
    <div>
      {benefits.map((benefit) => (
        <ProductBenefit included key={benefit.id}>
          {benefit.in_build ? <CheckCircleIcon /> : <XIcon />}
          <span>{benefit.name}</span>
          {benefit.limit && <span>{benefit.limit}</span>}
        </ProductBenefit>
      ))}
    </div>
  );
};

export default ProductBenefits;
