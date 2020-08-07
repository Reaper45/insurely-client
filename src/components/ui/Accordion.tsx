/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import styled from "emotion";

import { ReactComponent as CheveronDown } from "assets/icons/icon-cheveron-down.svg";

const AccordionItem = styled("div")<{ active: boolean }>`
  border-bottom: solid 1px ${(props) => props.theme.colors.gray};
  margin-bottom: 1rem;
  :last-of-type {
    border-bottom: none;
  }
  .header {
    display: flex;
    align-item: center;
    justify-content: space-between;
    cursor: pointer;
    margin-bottom: .5rem;
    .title {
      font-weight: 700;
      font-size: 14px;
      color: ${(props) => props.theme.colors.dark};
    }
    svg {
      transform: rotate(${(props) => (props.active ? "180deg" : "0deg")});
      fill: ${(props) => props.theme.colors.dark};
    }
  }
  .content {
    padding: ${(props) => (props.active ? "0 0 1rem" : "0")};
    max-height: ${(props) => (props.active ? "650px" : "0px")};
    overflow: auto;
    opacity: ${(props) => (props.active ? "1" : "0")};
  }
`;

type AccordionType = {
  key: string;
  title: string;
  render: () => React.ReactElement;
};

const Accordion: React.FC<{
  items: AccordionType[];
}> = ({ items }) => {
  const [active, setActive] = useState<null | string>(null);
  useEffect(() => {
    setActive(items[0].key);
  }, []);
  return (
    <>
      {items.map((item) => (
        <AccordionItem active={active === item.key} key={item.key}>
          <div
            className="header"
            onClick={() => {
              if (active === item.key) {
                setActive(null);
              } else {
                setActive(item.key);
              }
            }}
          >
            <div className="title">{item.title}</div>
            <div className="icon">
              <CheveronDown />
            </div>
          </div>
          <div className="content">{item.render()}</div>
        </AccordionItem>
      ))}
    </>
  );
};

export default Accordion;
