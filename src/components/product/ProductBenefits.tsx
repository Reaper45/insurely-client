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
  @media (max-width: 481px) {
    margin-bottom: 0.25rem;
  }
  color: ${(props) =>
    props.included ? props.theme.colors.secondary : props.theme.colors.red};
  div {
    flex-grow: 1;
    display: flex;
    align-items: center;
    @media (max-width: 481px) {
      flex-wrap: wrap;
    }
    span {
      margin-left: 0.5rem;
      font-size: 16px;
      :first-of-type {
        flex-grow: 1;
      }
      @media (max-width: 481px) {
        font-size: 14px;
        width: 100%;
        :last-of-type {
          font-size: small;
          margin-top: 3px;
          opacity: 0.66;
        }
      }
    }
  }
  svg {
    height: 18px;
    width: 18px;
    fill: ${(props) =>
      props.included ? props.theme.colors.green : props.theme.colors.red};
  }
`;

const ProductBenefits: React.FC<IProductBenefitsProps & { selected?: boolean }> = ({
  benefits,
  selected,
}) => {
  return (
    <div>
      {benefits.map((benefit) => (
        <ProductBenefit
          included={!benefit.is_optional || (benefit.is_optional && selected)}
          key={benefit.id}
        >
          {!benefit.is_optional || (benefit.is_optional && selected) ? (
            <CheckCircleIcon />
          ) : (
            <XIcon />
          )}
          <div>
            <span>{benefit.name}</span>
            {benefit.limit && <span>{benefit.limit}</span>}
          </div>
        </ProductBenefit>
      ))}
    </div>
  );
};

export default ProductBenefits;
