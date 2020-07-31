import * as React from "react";
import { createRef, RefObject } from "react";
import ReactDOM from "react-dom";

import styled from "emotion";
import Loader from "components/ui/Loader";

import { ReactComponent as CloseIcon } from "assets/icons/icon-x.svg";

export type CloseFn = () => void;

declare global {
  export interface IModalProps {
    show: boolean;
    close?: CloseFn;
    title: string;
    loading?: boolean;
  }
}

const ModalBackdrop = styled("div")<{ show: boolean }>`
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(17, 74, 175, 0.33);
  left: 0;
  top: 0;
  z-index: 100;
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem;
`;

const ModalWrapper = styled("div")<Partial<IModalProps>>`
  position: relative;
  margin: 0 auto;
  transition: all 200ms ease-in-out;
  transform: translateY(${(props) => (props.show ? "0%" : "-100%")});
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  opacity: ${(props) => (props.show ? "1" : "0")};
  background: ${(props) => props.theme.colors.white};
  border-radius: 10px;
  width: 100%;
  @media (min-width: 768px) {
    width: 35%;
    min-width: 420px;
  }
`;

const ModalContent = styled("div")`
  border-radius: 5px;
  padding: 1em 1.5em;
  width: 100%;
  background: ${(props) => props.theme.colors.white};
  box-sizing: border-box;
  position: relative;
`;

const ModalHeader = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  div {
    color: ${(props) => props.theme.colors.accent};
    font-size: 18px;
    font-weight: bold;
  }
  svg {
    fill: ${(props) => props.theme.colors.gray};
  }
`;

const ModalLoader = styled("div")`
  position: absolute;
  z-index: 100;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  justify-content: center;
`;

const modalRoot = document.getElementById("modal-root");

class Modal extends React.Component<IModalProps> {
  node: RefObject<HTMLDivElement> = createRef();

  containerEl: HTMLDivElement = document.createElement("div");

  componentDidMount() {
    modalRoot?.appendChild(this.containerEl);
  }

  componentWillUnmount() {
    modalRoot?.removeChild(this.containerEl);
  }

  public render() {
    const { close, children, show, title, loading } = this.props;

    return ReactDOM.createPortal(
      <ModalBackdrop show={show}>
        <ModalWrapper ref={this.node} show={show}>
          <ModalContent>
            <ModalHeader>
              <div>{title}</div>
              <button onClick={close}>
                <CloseIcon />
              </button>
            </ModalHeader>
            {children}
            {loading && (
              <ModalLoader className="flex align-center ">
                <Loader />
              </ModalLoader>
            )}
          </ModalContent>
        </ModalWrapper>
      </ModalBackdrop>,
      this.containerEl
    );
  }
}

export default Modal;
