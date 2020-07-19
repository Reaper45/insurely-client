import styled from "emotion";
import { css } from "@emotion/core";

const Container = styled("div")`
  width: 90%;
  margin: 0 auto;
`;

const Main = styled("main")`
  width: 100%;
  border-top: solid 1px ${(props) => props.theme.colors.light};
`;

const PageFooter = styled("div")`
  width: 100%;
  border-top: solid 1px ${(props) => props.theme.colors.light};
  padding: 1.5rem 0;
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;
  background: #fff;
`;

const baseInputStyles = css(`
  border-radius: 4px;
  padding: 1rem;
  font-size: 14px;
  width: 100%;
  outline: none;
  @media (min-width: 768px) {
    padding: 1.25rem 1.375rem;
    font-size: 16px;
    border-radius: 8px;
  }
`);

const Input = styled("input")`
  ${baseInputStyles}
  border: solid 1px ${(props: any) => props.theme.colors.light};
  ::placeholder {
    color: ${(props) => props.theme.colors.gray};
  }
  :focused {
    transition-duration: 0;
    border-color: ${(props) => props.theme.colors.primary};
  }
  &.error {
    border-color: ${(props) => props.theme.colors.red};
  }

`;

export { baseInputStyles, Container, Main, Input, PageFooter };
