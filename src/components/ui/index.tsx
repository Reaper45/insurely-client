import styled from "emotion";
import { css } from "@emotion/core";

const Container = styled("div")`
  width: 90%;
  margin: 0 auto;
`;

const Main = styled("main")`
  width: 100%;
  height: calc(100% - 73px);
  padding-top: 73px;
  @media (min-width: 768px) {
    height: calc(100% - 83px);
    padding-top: 83px;
  }
`;

const PageFooter = styled("div")`
  width: 100%;
  border-top: solid 1px ${(props) => props.theme.colors.light};
  padding: 1rem 0;
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;
  background: #fff;
  @media (min-width: 768px) {
    padding: 1.5rem 0;
  }
`;

const baseInputStyles = css(`
  border-radius: 4px;
  padding: 1rem;
  font-size: 14px;
  width: 100%;
  @media (min-width: 768px) {
    padding: 1.25rem 1.375rem;
    font-size: 16px;
    border-radius: 8px;
  }
`);

const Input = styled("input")`
  ${baseInputStyles}
  color: ${(props) => props.theme.colors.dark};
  border: solid 1px ${(props: any) => props.theme.colors.light};
  ::placeholder {
    color: ${(props) => props.theme.colors.gray};
  }
  :focused {
    transition-duration: 0;
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.dark};
  }
  &.error {
    border-color: ${(props) => props.theme.colors.red};
  }

`;

const FieldWrapper = styled("div")`
  margin-bottom: 1.375rem;
  position: relative;
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
  span.label {
    font-weight: bold;
    font-size: 14px;
    color: ${(props) => props.theme.colors.secondary};
    position: absolute;
    right: 1rem;
    @media (min-width: 768px) {
      font-size: 16px;
      top: 1.25rem;
      right: 1.375rem;
    }
  }
`;

const FieldError = styled("div")`
  color: ${(props) => props.theme.colors.red};
  font-style: italic;
  font-size: x-small;
  margin-left: 5px;
  margin-top: 4px;
`;

const Message = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin-bottom: 1rem;
  &.error {
    background: rgba(229, 62, 62, 0.15);
    border-left: solid 2px ${(props) => props.theme.colors.red};
    div {
      color: ${(props) => props.theme.colors.red};
    }
    svg {
      fill: ${(props) => props.theme.colors.red};
      height: 20px;
    }
  }
  &.success {
    background: rgba(56, 161, 105, 0.15);
    border-left: solid 2px ${(props) => props.theme.colors.green};
    div {
      color: ${(props) => props.theme.colors.green};
    }
    svg {
      fill: ${(props) => props.theme.colors.green};
    }
  }
`;

const FieldLoader = styled("div")`
  width: 100%;
  height: 100%;
  justify-content: center;
`;

export {
  baseInputStyles,
  Container,
  Main,
  Input,
  PageFooter,
  FieldWrapper,
  FieldError,
  Message,
  FieldLoader,
};
