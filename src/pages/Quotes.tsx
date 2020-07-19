import React, { useReducer } from "react";

import styled from "emotion";
import { QuoteType } from "types";

import PageLayout from "components/PageLayout";
import { PageFooter, Container } from "components/ui";
import ProductView from "components/product/ProductView";
import ProductBenefits from "components/product/ProductBenefits";
import ProductOptionalBenefits from "components/product/ProductOptionalBenefits";
import Accordion from "components/ui/Accordion";

import { ReactComponent as CheveronUpIcon } from "assets/icons/icon-cheveron-up.svg";

const QuotesWrapper = styled("div")`
  margin-top: 1.5rem;
  >.title {
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;
    margin-bottom: 2rem;
    display: block;
  }
  @media (min-width: 768px) {
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
  z-index: 15;
  left: 0;
  top: ${(props) => (props.showDetails ? "18%" : "80%")};
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background: #fff;
  border: solid 2px ${(props) => props.theme.colors.light};
  padding: 1rem;
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
      svg {
        transform: rotate(
          ${(props) => (props.showDetails ? "180deg" : "0deg")}
        );
      }
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
    .toggle-container {
      display: none;
    }
  }
`;

// const ProductBenefits = styled("div")``;

interface IQuotesProps {
  quotes: QuoteType[];
}

interface IState {
  productId: string | null;
  showDetails: boolean;
}

const initialState: IState = {
  productId: null,
  showDetails: false,
};

enum ActionTypes {
  productId = "PRODUCT_ID",
  showDetails = "SHOW_DETAILS",
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
    default:
      return state;
  }
};

const quotes: QuoteType[] = [
  {
    product_id: "1",
    insurer: {
      logo: require("../assets/img/icea_lion.png"),
    },
    has_ipf: true,
  },
  {
    product_id: "2",
    insurer: {
      logo: require("../assets/img/icea_lion.png"),
    },
    has_ipf: false,
  },
  {
    product_id: "3",
    insurer: {
      logo: require("../assets/img/icea_lion.png"),
    },
    has_ipf: false,
  },
];
const Quotes: React.FC<IQuotesProps> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { productId, showDetails } = state;
  const activeQuote = quotes.find((quote) => quote.product_id === productId);

  const handleProductClick = (productId: string) => {
    dispatch({
      type: ActionTypes.productId,
      payload: productId,
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
                  {quotes.map((quote) => (
                    <ProductView
                      key={quote.product_id}
                      handleClick={() => handleProductClick(quote.product_id)}
                      logo={require("../assets/img/icea_lion.png")}
                      amount="28555"
                      hasIPF={quote.has_ipf}
                      active={productId === quote.product_id}
                    />
                  ))}
                </ProductList>
                {activeQuote && (
                  <ProductSummary showDetails={showDetails}>
                    <div className="toggle-container">
                      <button
                        className="btn btn-toggle btn-primary icon-right"
                        onClick={() => {
                          dispatch({
                            type: ActionTypes.showDetails,
                            payload: !showDetails,
                          });
                        }}
                      >
                        {showDetails ? "Hide" : "Click to see details"}

                        <CheveronUpIcon />
                      </button>
                    </div>
                    <Accordion
                      items={[
                        {
                          key: "cover-summary",
                          title: "Cover Summary",
                          render: () => <ProductBenefits benefits={[
                          ]} />,
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
                  </ProductSummary>
                )}
              </ProductsWrapper>
            </QuotesWrapper>
          </Container>
          <PageFooter>
            <Container></Container>
          </PageFooter>
        </>
      )}
    </PageLayout>
  );
};

export default Quotes;
