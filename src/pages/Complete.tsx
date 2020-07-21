import React from 'react';

import styled from "emotion";
import Header from "components/Header";

import { ReactComponent as CompleteIcon } from "assets/icons/icon-success.svg";
import { ReactComponent as CheveronLeftIcon } from "assets/icons/icon-cheveron-left.svg";

const CompleteContent = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: calc(100% - 83px);
  .icon {
    svg {
      height: 130px;
    }
  }
  .content {
    margin: 2rem 0;
    color: ${(props) => props.theme.colors.secondary};
  }
  h1 {
    color: ${(props) => props.theme.colors.dark};
    font-size: 2rem;
    padding: 0.5rem;
  }
  .description {
    font-size: 1rem;
    color: ${(props) => props.theme.colors.secondary};
  }
  .link {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
    position: relative;
    display: inline-flex;
    svg {
      margin-right: 0.5rem;
      margin-left: -0.5rem;
      fill: ${(props) => props.theme.colors.primary};
    }
    :after {
      content: "";
      height: 1px;
      background: ${(props) => props.theme.colors.primary};
      width: 100%;
      position: absolute;
      bottom: 0;
    }
  }
`;



const Complete = () => {
  return (
    <>
      <Header cancelable={false} />
      <CompleteContent>
        <div>
          <div className="icon">
            <CompleteIcon />
          </div>
          <div className="content">
            <h1>Purchase Complete</h1>
            <div className="description">
              You will be receiving an Email with your policy details
            </div>
          </div>
          <a className="link align-center justify-center" href="/">
            <CheveronLeftIcon />
            Go back to our website
          </a>
        </div>
      </CompleteContent>
    </>
  );
};

export default Complete;
