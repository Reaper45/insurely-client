import React from "react";

import { BenefitType } from "types";

interface IProductOptionalBenefitsProps {
  benefits: BenefitType[];
}

const ProductOptionalBenefits: React.FC<IProductOptionalBenefitsProps> = ({
  benefits,
}) => {
  return (
    <div>
      <p></p>
    </div>
  );
};

export default ProductOptionalBenefits;
