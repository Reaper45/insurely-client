import React from "react";
import numeral from "numeral";

import styled from "emotion";
import CheckboxInput from "components/ui/CheckboxInput";

import { ReactComponent as CheveronRightIcon } from "assets/icons/icon-cheveron-right.svg";
import { ReactComponent as CheckCircleIcon } from "assets/icons/icon-check-circle.svg";

interface IProductViewProps {
  handleClick: () => void;
  quote: QuoteType;
  activeQuote: QuoteType | null;
}

const ProductViewWrapper = styled("div")<{
  active?: boolean;
  hasIPF?: boolean;
}>`
  border: solid 2px
    ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.light};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  cursor: pointer;
  @media (min-width: 768px) {
    padding: 0.85rem 1.5rem;
    margin-bottom: 2rem;
  }
  >div: first-of-type {

  }
  .logo {
    margin-left: 1.5rem;
    height: 50px;
    flex-grow: 1;
    max-width: 20%;
    img {
      height: 100%;
      border-radius: 8px;
      border: solid 1px ${(props) => props.theme.colors.light};
    }
    @media (min-width: 768px) {
      height: 60px;
    }
  }
  .details {
    flex-grow: 1;
    margin-left: 1rem;
    .name {
      white-space: nowrap;
      b {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        @media (min-width: 768px) {
          font-size: 1rem;
        }
      }
    }

    div {
      color: ${(props) => props.theme.colors.dark};
      margin-bottom: 0.5rem;
      font-size: 16px;
    }
    small {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: ${(props) =>
        props.hasIPF ? props.theme.colors.green : props.theme.colors.orange};
      svg {
        height: 16px;
        width: 16px;
        margin-right: 0.5rem;
        fill: ${(props) =>
          props.hasIPF ? props.theme.colors.green : props.theme.colors.orange};
      }
    }
    @media (min-width: 768px) {
      margin-left: 0;
      div {
        font-size: 18px;
      }
    }
  }
  >div: last-of-type {
    transition-duration: 100ms;
    transition-delay: 0ms;
    svg {
      fill: ${(props) =>
        props.active ? props.theme.colors.primary : props.theme.colors.light};
    }
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

const ProductView: React.FC<IProductViewProps> = ({
  handleClick,
  // insurerId,
  // amount,
  // hasIPF,
  // name,
  quote,
  activeQuote,
}) => {
  return (
    <ProductViewWrapper
      onClick={handleClick}
      active={activeQuote?.product_id === quote.product_id}
      hasIPF={quote.has_ipf}
    >
      <CheckboxInput
        checked={activeQuote?.product_id === quote.product_id}
        onChange={console.log}
      />
      <div className="logo">
        <img
          src={`${process.env.REACT_APP_API_URL}/insurer/${quote.insurer.id}/logo`}
          alt=""
        />
      </div>
      <div className="details">
        <div className="name">
          <b>{quote.name}</b>
        </div>
        <div>
          Ksh.&nbsp;{" "}
          {numeral(
            activeQuote?.product_id === quote.product_id
              ? activeQuote!.premium
              : quote.premium
          ).format("0,0")}
        </div>
        <small>
          {quote.has_ipf && (
            <>
              <CheckCircleIcon /> Financing available
            </>
          )}
        </small>
      </div>
      <div>
        <CheveronRightIcon />
      </div>
    </ProductViewWrapper>
  );
};

export default ProductView;
