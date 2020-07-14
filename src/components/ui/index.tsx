import styled from "emotion";

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

const Input = styled("input")`
  border-radius: 6px;
  padding: 1rem;
  border: solid 1px ${(props) => props.theme.colors.light};
  font-size: 14px;
  width: 100%;
  margin-bottom: 2rem;
  ::placeholder {
    color: ${(props) => props.theme.colors.gray};
  }
  :focused {
    transition-duration: 0;
    border-color: ${(props) => props.theme.colors.primary};
  }
  @media (min-width: 768px) {
    padding: 1.25rem 1.375rem;
    font-size: 16px;
    border-radius: 8px;
  }
`;

export { Container, Main, Input, PageFooter };
