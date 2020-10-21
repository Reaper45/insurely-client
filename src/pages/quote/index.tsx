/* eslint-disable react-hooks/exhaustive-deps */
import React, { useReducer, useEffect } from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import numeral from "numeral";
import swal from "sweetalert";

import styled from "emotion";
import { getQuotes, emailQuote } from "lib/api";

import PageLayout from "components/PageLayout";
import { PageFooter, Container } from "components/ui";
import ProductView from "components/product/ProductView";
import ProductBenefits from "components/product/ProductBenefits";
import ProductOptionalBenefits from "components/product/ProductOptionalBenefits";
import Accordion from "components/ui/Accordion";
import Loader from "components/ui/Loader";
import { IQuotationFormValues } from "pages/form/quotation-form";
import Checkout from "./Checkout";

import { ReactComponent as NoDataIcon } from "assets/icons/no-data.svg";

const QuotesWrapper = styled("div")`
  margin-top: 1.5rem;
  height: 100%;
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
    top: ${(props) => (props.showDetails ? "-1rem" : "0")};
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
    bottom: 20%;
    .amount {
      position: relative;
      left: -50%;
      background: ${(props) => props.theme.colors.dark};
      border: solid 1px ${(props) => props.theme.colors.white};
      padding: 0.75rem 1.5rem;
      border-radius: 2rem;
      color: ${(props) => props.theme.colors.white};
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

const EmptyCatalog = styled("div")`
  justify-content: center;
  height: 100%;
  margin: -4rem auto 0;
  text-align: center;
  max-width: 250px;
  svg {
    height: 100px;
    width: auto;
    margin-bottom: 2rem;
  }
  .title {
    color: ${(props) => props.theme.colors.dark};
    font-weight: 700;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    display: block;
  }
  p {
    color: ${(props) => props.theme.colors.secondary};
    line-height: 1.4;
    font-size: small;
  }
  @media (min-width: 768px) {
  }
`;

const QuoteStateComponent: React.FC<{ loading: boolean }> = ({ loading }) => (
  <EmptyCatalog className="flex align-center ">
    {loading ? (
      <Loader />
    ) : (
      <div>
        <NoDataIcon />
        <div className="title">Oh no!</div>
        <p>
          We've got nothing for you at the moment. We hope you don't mind
          checking with us later!{" "}
        </p>
      </div>
    )}
  </EmptyCatalog>
);

enum QuoteStates {
  initial = "initial",
  fetching = "fetching",
  paid = "paid",
  paying = "paying",
  emailed = "emailed",
  loading = "loading",
  sending = "sending",
}

interface IState {
  activeQuote: QuoteType | null;
  showDetails: boolean;
  quoteState: QuoteStates;
  quotes: QuoteType[];
  optionalBenefits: {
    id: string;
    premium: string;
    name: string;
  }[];
}

const initialState: IState = {
  activeQuote: null,
  showDetails: false,
  quoteState: QuoteStates.initial,
  quotes: [],
  optionalBenefits: [],
};

enum ActionTypes {
  activeQuote = "ACTIVE_QUOTE",
  showDetails = "SHOW_DETAILS",
  quotes = "QUOTES",
  quoteState = "QUOTE_STATE",
  addOptionalBenefits = "ADD_OPTIONAL_BENEFITS",
  removeOptionalBenefits = "REMOVE_OPTIONAL_BENEFITS",
}

interface IAction {
  type: ActionTypes;
  payload?: any;
}

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.activeQuote:
      return { ...state, activeQuote: action.payload };

    case ActionTypes.showDetails:
      return { ...state, showDetails: action.payload };

    case ActionTypes.quotes:
      return { ...state, quotes: action.payload };

    case ActionTypes.quoteState:
      return { ...state, quoteState: action.payload };

    case ActionTypes.addOptionalBenefits:
      return {
        ...state,
        optionalBenefits: [...state.optionalBenefits, action.payload],
      };

    case ActionTypes.removeOptionalBenefits:
      const updatedOptionalBenefits = state.optionalBenefits.filter(
        (benefit) => benefit.name !== action.payload.name
      );
      return { ...state, optionalBenefits: updatedOptionalBenefits };

    default:
      return state;
  }
};

const optionalBenefits = (benefits: BenefitType[]): BenefitType[] =>
  benefits.filter((benefit) => benefit.is_optional);

const Quotes: React.FC<RouteComponentProps<
  any,
  any,
  { form: IQuotationFormValues }
>> = ({ location }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleProductClick = (quote: QuoteType) => {
    dispatch({
      type: ActionTypes.activeQuote,
      payload: quote,
    });
  };

  const sendEmail = async () => {
    dispatch({
      type: ActionTypes.quoteState,
      payload: QuoteStates.sending,
    });

    emailQuote({
      quote: state.activeQuote,
      name: `${location.state.form.firstName} ${location.state.form.lastName}`,
      phoneNumber: location.state.form.phoneNumber,
      email: location.state.form.email,
    })
      .then(() => {
        swal({
          title: "Email sent!",
          text: `Quote sent to ${location.state.form.email}`,
          icon: "success",
          // @ts-ignore
          button: "Done",
        });
        dispatch({
          type: ActionTypes.quoteState,
          payload: QuoteStates.emailed,
        });
      })
      .catch(() => {
        swal({
          title: "Failed!",
          text: "Couldn't send email. Retry!",
          icon: "warning",
          dangerMode: true,
        });
        dispatch({
          type: ActionTypes.quoteState,
          payload: QuoteStates.emailed,
        });
      });
  };

  const calcBenefitPremium = (benefit: Partial<BenefitType>): number => {
    let premium = 0;
    if (benefit?.tariffs) {
      const tariff = benefit.tariffs[0];

      if (tariff.is_percentage && tariff.value) {
        premium =
          (parseInt(tariff.value, 10) / 100) *
          parseInt(location.state.form.sumInsured, 10);
      } else {
        premium = tariff.value ? parseInt(tariff.value, 10) : 0;
      }
    }
    return premium;
  };

  const calculateUpdateTotalPremium = (
    quote: QuoteType | null,
    premium: number
  ): QuoteType | null => {
    let updatedActiveQuote = quote;
    if (state.activeQuote?.premium) {
      updatedActiveQuote = {
        ...state.activeQuote,
        premium: state.activeQuote?.premium + premium,
      };
      dispatch({
        type: ActionTypes.activeQuote,
        payload: updatedActiveQuote,
      });
    }

    return updatedActiveQuote;
  };

  const handleOptionalBenefitChange: handleBenefitChangeFn = ({
    benefit,
    selected,
  }) => {
    const premium = calcBenefitPremium(benefit);

    if (selected) {
      // Add to selected benefit array
      dispatch({
        type: ActionTypes.addOptionalBenefits,
        payload: {
          id: benefit.id,
          name: benefit.name,
          premium,
        },
      });
      const updatedActiveQuote = calculateUpdateTotalPremium(
        state.activeQuote,
        premium
      );
      dispatch({
        type: ActionTypes.activeQuote,
        payload: updatedActiveQuote,
      });
    } else {
      // Remove to selected benefit array
      dispatch({
        type: ActionTypes.removeOptionalBenefits,
        payload: benefit,
      });
      const updatedActiveQuote = calculateUpdateTotalPremium(
        state.activeQuote,
        -premium
      );

      dispatch({
        type: ActionTypes.activeQuote,
        payload: updatedActiveQuote,
      });
    }
  };

  useEffect(() => {
    if (location.state && location.state.form) {
      dispatch({
        type: ActionTypes.quoteState,
        payload: QuoteStates.fetching,
      });
      const { sumInsured, typeOfCover } = location.state.form;

      (async () => {
        const { data } = await getQuotes({
          sumInsured,
          categoryId: typeOfCover,
        });
        dispatch({
          type: ActionTypes.quotes,
          payload: data.quotes,
        });
        dispatch({
          type: ActionTypes.quoteState,
          payload: QuoteStates.initial,
        });
      })();
    }
  }, []);

  if (
    location.state === undefined ||
    typeof location.state.form === "undefined"
  ) {
    return <Redirect to="/" />;
  }

  return (
    <PageLayout title="Quotations">
      {() => (
        <>
          <Container style={{ height: "100%" }}>
            <QuotesWrapper>
              {state.quoteState === QuoteStates.fetching ||
              state.quotes.length === 0 ? (
                <QuoteStateComponent
                  loading={state.quoteState === QuoteStates.fetching}
                />
              ) : (
                <>
                  <div className="title">Choose your preferred insurer</div>
                  <ProductsWrapper>
                    <ProductList>
                      {state.quotes.map((q) => (
                        <ProductView
                          key={q.product_id}
                          handleClick={() => handleProductClick(q)}
                          quote={q}
                          activeQuote={state.activeQuote}
                        />
                      ))}
                    </ProductList>
                    {state.activeQuote && (
                      <ProductSummary showDetails={state.showDetails}>
                        <div className="toggle-container">
                          <button
                            className="btn btn-toggle btn-primary"
                            onClick={() => {
                              dispatch({
                                type: ActionTypes.showDetails,
                                payload: !state.showDetails,
                              });
                            }}
                          >
                            {state.showDetails
                              ? "Hide details"
                              : "Click to see details"}
                            <img
                              className="icon-insurer"
                              src={`${process.env.REACT_APP_API_URL}/insurer/${state.activeQuote.insurer?.id}/logo`}
                              alt={state.activeQuote.insurer?.name}
                            />
                          </button>
                        </div>
                        <div className="summary">
                          <Accordion
                            items={[
                              {
                                key: "cover-summary",
                                title: "Cover Summary",
                                render: () => (
                                  <ProductBenefits
                                    benefits={state.activeQuote!.benefits}
                                  />
                                ),
                              },
                              {
                                key: "select-optional-benefits",
                                title: "Select optional benefits",
                                render: () => (
                                  <ProductOptionalBenefits
                                    handleChange={handleOptionalBenefitChange}
                                    benefits={[
                                      ...state.activeQuote!.optional_benefits,
                                      ...optionalBenefits(
                                        state.activeQuote!.benefits
                                      ),
                                    ]}
                                  />
                                ),
                              },
                            ]}
                          />
                        </div>
                        <div className="floating-amount">
                          <div className="amount">
                            Ksh.{" "}
                            {numeral(state.activeQuote.premium).format(
                              "0,0.00"
                            )}
                          </div>
                        </div>
                      </ProductSummary>
                    )}
                  </ProductsWrapper>
                </>
              )}
            </QuotesWrapper>
          </Container>
          <PageFooter>
            <Container className="flex justify-space-between">
              <div />
              <div className="flex justify-space-between sm-flex-1">
                <button
                  onClick={sendEmail}
                  className="btn btn-light link icon-left mr-2"
                  type="button"
                  disabled={
                    !state.activeQuote ||
                    state.quoteState === QuoteStates.emailed
                  }
                >
                  {state.quoteState === QuoteStates.sending
                    ? "Sending..."
                    : state.quoteState === QuoteStates.emailed
                    ? "Email sent"
                    : "Email me the quotation"}
                </button>
                <button
                  onClick={() =>
                    dispatch({
                      type: ActionTypes.quoteState,
                      payload: QuoteStates.paying,
                    })
                  }
                  disabled={!state.activeQuote}
                  className="btn btn-primary"
                  type="submit"
                >
                  Pay now
                </button>
              </div>
            </Container>
          </PageFooter>
          <Checkout
            show={state.quoteState === QuoteStates.paying}
            close={() => {
              dispatch({
                type: ActionTypes.quoteState,
                payload: QuoteStates.initial,
              });
            }}
            customer={{
              phoneNumber: location.state.form.phoneNumber,
              email: location.state.form.email,
              name: location.state.form.firstName,
            }}
            amount={numeral(state.activeQuote?.premium).format("0,0")}
            quote={state.activeQuote}
          />
        </>
      )}
    </PageLayout>
  );
};

export default Quotes;
