import React, { useReducer } from "react";
import { RouteComponentProps } from "react-router-dom";
import numeral from "numeral";

import styled from "emotion";
import { QuoteType } from "types";

import PageLayout from "components/PageLayout";
import { PageFooter, Container } from "components/ui";
import ProductView from "components/product/ProductView";
import ProductBenefits from "components/product/ProductBenefits";
import ProductOptionalBenefits from "components/product/ProductOptionalBenefits";
import Accordion from "components/ui/Accordion";
import Checkout from "./Checkout";

import { ReactComponent as CheveronLeftIcon } from "assets/icons/icon-cheveron-left.svg";

const QuotesWrapper = styled("div")`
  margin-top: 1.5rem;
  > .title {
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;
    margin-bottom: 2rem;
    display: block;
  }
`;

const ProductsWrapper = styled("div")`
  display: flex;
`;

const ProductList = styled("div")`
  flex-grow: 1;
  @media (min-width: 768px) {
    margin-right: 1.5rem;
  }
`;

const ProductSummary = styled("div")<{ showDetails: boolean }>`
  flex-grow: 1;
  position: fixed;
  z-index: 10;
  left: 0;
  top: ${(props) => (props.showDetails ? "72px" : "85%")};
  width: 100%;
  border-top: solid 1px
    ${(props) => (props.showDetails ? props.theme.colors.light : "transparent")};
  background: #fff;
  padding: 2rem 1rem;
  height: 100%;
  .toggle-container {
    position: absolute;
    left: 50%;
    top: -1rem;
    .btn-toggle {
      color: ${(props) => props.theme.colors.white};
      font-size: 14px;
      font-weight: 700;
      position: relative;
      left: -50%;
      border-radius: 2rem;
    }
    .icon-insurer {
      width: 15px;
      height: 15px;
      vertical-align: middle;
      margin-left: 8px;
    }
  }
  .summary {
    visibility: ${(props) => (props.showDetails ? "visible" : "hidden")};
    opacity: ${(props) => (props.showDetails ? "1" : "0")};
  }
  .floating-amount {
    position: absolute;
    left: 50%;
    bottom: 22%;
    .amount {
      position: relative;
      left: -50%;
      background: ${(props) => props.theme.colors.green};
      padding: 0.75rem 1.5rem;
      border-radius: 2rem;
      color: ${(props) => props.theme.colors.white};
      font-weight: bold;
    }
  }
  @media (min-width: 768px) {
    position: initial;
    margin-left: 1.5rem;
    width: auto;
    border: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 0 1rem;
    .summary {
      visibility: visible;
      opacity: 1;
    }
    .toggle-container {
      display: none;
    }
    .floating-amount {
      display: none;
    }
  }
`;

interface IQuotesProps {
  quotes: QuoteType[];
}

enum QuoteStates {
  initial = "initial",
  paid = "paid",
  paying = "paying",
  emailed = "emailed",
}

interface IState {
  productId: string | null;
  showDetails: boolean;
  quote: QuoteStates;
}

const initialState: IState = {
  productId: null,
  showDetails: false,
  quote: QuoteStates.initial,
};

enum ActionTypes {
  productId = "PRODUCT_ID",
  showDetails = "SHOW_DETAILS",
  quote = "QUOTE_STATE",
}

interface IAction {
  type: ActionTypes;
  payload?: any;
}

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.productId:
      return { ...state, productId: action.payload };
    case ActionTypes.showDetails:
      return { ...state, showDetails: action.payload };
    case ActionTypes.quote:
      return { ...state, quote: action.payload };
    default:
      return state;
  }
};

const quotes: QuoteType[] = [
  {
    product_id: "1",
    insurer: {
      logo: require("../../assets/img/icea_lion.png"),
    },
    has_ipf: true,
  },
  {
    product_id: "2",
    insurer: {
      logo: require("../../assets/img/icea_lion.png"),
    },
    has_ipf: false,
  },
  {
    product_id: "3",
    insurer: {
      logo: require("../../assets/img/icea_lion.png"),
    },
    has_ipf: false,
  },
];
const Quotes: React.FC<IQuotesProps & RouteComponentProps> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { productId, showDetails, quote } = state;
  const activeQuote = quotes.find((q) => q.product_id === productId);

  const handleProductClick = (id: string) => {
    dispatch({
      type: ActionTypes.productId,
      payload: id,
    });
  };

  return (
    <PageLayout title="Quotations">
      {() => (
        <>
          <Container>
            <QuotesWrapper>
              <div className="title">Choose your preferred insurer</div>
              <ProductsWrapper>
                <ProductList>
                  {quotes.map((q) => (
                    <ProductView
                      key={q.product_id}
                      handleClick={() => handleProductClick(q.product_id)}
                      logo={q.insurer?.logo}
                      amount="28555"
                      hasIPF={q.has_ipf}
                      active={productId === q.product_id}
                    />
                  ))}
                </ProductList>
                {activeQuote && (
                  <ProductSummary showDetails={showDetails}>
                    <div className="toggle-container">
                      <button
                        className="btn btn-toggle btn-primary"
                        onClick={() => {
                          dispatch({
                            type: ActionTypes.showDetails,
                            payload: !showDetails,
                          });
                        }}
                      >
                        {showDetails ? "Hide details" : "Click to see details"}
                        <img
                          className="icon-insurer"
                          src={activeQuote.insurer?.logo}
                          alt={activeQuote.insurer?.name}
                        />
                      </button>
                    </div>
                    <div className="summary">
                      <Accordion
                        items={[
                          {
                            key: "cover-summary",
                            title: "Cover Summary",
                            render: () => <ProductBenefits benefits={[]} />,
                          },
                          {
                            key: "select-optional-benefits",
                            title: "Select optional benefits",
                            render: () => (
                              <ProductOptionalBenefits benefits={[]} />
                            ),
                          },
                        ]}
                      />
                    </div>
                    <div className="floating-amount">
                      <div className="amount">
                        Ksh. {numeral("25444").format("0,0")}
                      </div>
                    </div>
                  </ProductSummary>
                )}
              </ProductsWrapper>
            </QuotesWrapper>
          </Container>
          <PageFooter>
            <Container className="flex justify-space-between">
              <button
                // onClick={() => prev()}
                className="btn btn-primary link icon-left sm-hidden"
                type="button"
              >
                <CheveronLeftIcon />
                Back
              </button>
              <div className="flex justify-space-between sm-flex-1">
                <button
                  className="btn btn-light link icon-left mr-2"
                  type="button"
                >
                  Email me the quotation
                </button>
                <button
                  onClick={() =>
                    dispatch({
                      type: ActionTypes.quote,
                      payload: QuoteStates.paying,
                    })
                  }
                  className="btn btn-primary"
                  type="submit"
                >
                  Pay now
                </button>
              </div>
            </Container>
          </PageFooter>
          <Checkout
            show={quote === QuoteStates.paying}
            close={() => {
              dispatch({
                type: ActionTypes.quote,
                payload: quote === QuoteStates.initial,
              });
            }}
            phoneNumber="0719747908"
            amount="23577"
          />
        </>
      )}
    </PageLayout>
  );
};

export default Quotes;
