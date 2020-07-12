import React from 'react';
import {Link} from 'react-router-dom';

import styled from "emotion";

import { ReactComponent as CloseIcon } from "assets/icons/icon-x.svg";
import { Container } from "./ui";

const HeaderWrapper = styled("header")`
  padding: 15px 0;
`;

const NavWrapper = styled("nav")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .title {
    color: ${(props) => props.theme.colors.secondary};
    font-weight: 700;
    text-align: center;
    flex-grow: 1;
    position: absolute;
    left: 50%;
    > div {
      border-radius: 2rem;
      padding: 8px 15px;
      background: ${(props) => props.theme.colors.light};
      position: relative;
      left: -50%;
      top: 40px;
      transition-delay: 100ms;
      @media (min-width: 768px) {
        background: ${(props) => props.theme.colors.white};
        position: initial;
      }
    }
    @media (min-width: 768px) {
      position: initial;
    }
  }
  .btn-close {
    color: ${(props) => props.theme.colors.secondary};
    text-align: right;
    min-width: 170px;
    svg {
      fill: ${(props) => props.theme.colors.secondary};
      vertical-align: middle;
      margin-left: 8px;
    }
  }
`;

const Brand = styled('img')`
  height: 50px;
`;

const Header: React.FC<{ page: string }> = ({ page = "0" }) => {
  return (
    <HeaderWrapper>
      <Container>
        <NavWrapper>
          <Link to="/">
            <Brand src={require("../assets/img/logo.png")} alt="Insurely" />
          </Link>
          <div className="title">
            <div>
              Step {page} of 4
            </div>
          </div>
          <button className="btn-close">
            Cancel
            <CloseIcon />
          </button>
        </NavWrapper>
      </Container>
    </HeaderWrapper>
  );
}

export default Header; 
