import React from "react";
import { Link, NavLink } from "react-router-dom";

import styled from "emotion";
import { Container } from "./ui";

import { ReactComponent as CloseIcon } from "assets/icons/icon-x.svg";

const HeaderWrapper = styled("header")`
  padding: 15px 0;
  border-bottom: solid 1px ${(props) => props.theme.colors.light};
  position: fixed;
  width: 100%;
  background: #fff;
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
      background: ${(props) => props.theme.colors.white};
      border: solid 1px ${(props) => props.theme.colors.light};
      position: relative;
      left: -50%;
      top: 37px;
      transition-delay: 100ms;
      font-size: 0.75rem;
      @media (min-width: 481px) {
        border: none;
        position: initial;
        font-size: 1rem;
      }
    }
    @media (min-width: 481px) {
      position: initial;
    }
  }
  .btn-close {
    color: ${(props) => props.theme.colors.secondary};
    text-align: right;
    min-width: 113px;
    text-decoration: none;
    svg {
      fill: ${(props) => props.theme.colors.secondary};
      vertical-align: middle;
      margin-left: 8px;
    }
    @media (min-width: 768px) {
      min-width: 142px;
    }
  }
`;

const Brand = styled("img")`
  height: 40px;
  @media (min-width: 768px) {
    height: 50px;
  }
`;

const Header: React.FC<{
  onLogoClick?: (props: any) => void;
  title?: string;
  cancelable?: boolean;
}> = ({ onLogoClick, title, cancelable = true }) => {
  return (
    <HeaderWrapper>
      <Container>
        <NavWrapper>
          <Link onClick={onLogoClick && onLogoClick} to="/">
            <Brand src={require("../assets/img/logo.png")} alt="Insurely" />
          </Link>
          {title && (
            <div className="title">
              <div>{title}</div>
            </div>
          )}
          {cancelable && (
            <div>
              <NavLink to="/" className="btn-close">
                Cancel
                <CloseIcon />
              </NavLink>
            </div>
          )}
        </NavWrapper>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
