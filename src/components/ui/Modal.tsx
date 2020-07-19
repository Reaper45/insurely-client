import * as React from "react";
import { createRef, RefObject, useEffect } from "react";
import ReactDOM from 'react-dom'

import styled from "emotion";

import { ReactComponent as CloseIcon } from "assets/icons/icon-x.svg";

export type CloseFn = () => void;

interface IModalProps {
  show: boolean;
  close: CloseFn;
  title: string;
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
    width: 33%;
    top: -20%;
  }
`;
const ModalContent = styled("div")`
  border-radius: 5px;
  padding: 1em 1.5em;
  width: 100%;
  background: ${(props) => props.theme.colors.white};
  box-sizing: border-box;
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

const modalRoot = document.getElementById("modal-root");

const Modal: React.FC<IModalProps> = ({ close, children, show, title }) => {
  const node: RefObject<HTMLDivElement> = createRef();
  const containerEl: HTMLDivElement = document.createElement("div");

  useEffect(() => {
    modalRoot?.appendChild(containerEl);
    // @ts-ignore
    return () => {
      // @ts-ignore
      modalRoot?.removeChild(containerEl);
    };
  }, [containerEl, node]);

  return ReactDOM.createPortal(
    <ModalBackdrop show={show}>
      <ModalWrapper ref={node} show={show}>
        <ModalContent>
          <ModalHeader>
            <div>{title}</div>
            <button onClick={close}>
              <CloseIcon />
            </button>
          </ModalHeader>
          {children}
        </ModalContent>
      </ModalWrapper>
    </ModalBackdrop>,
    containerEl
  );
};

export default Modal;
