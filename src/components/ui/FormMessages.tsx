import React from "react";

import styled from "emotion";

const FormMessagesWrapper = styled("div")`
  padding: 1.5rem 0;
  margin-bottom: 1rem;
  > div:first-of-type > div {
    border-bottom-left-radius: 0;
  }
  > div:nth-of-type(2) > div {
    border-top-left-radius: 0;
  }
  > div:last-of-type > div {
    margin-bottom: 0;
  }
  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const FormMessage = styled("div")`
  padding: 8px 16px;
  border: solid 1px ${(props) => props.theme.colors.gray};
  color: ${(props) => props.theme.colors.dark};
  background: ${(props) => props.theme.colors.white};
  font-size: 0.75rem;
  margin-bottom: 8px;
  align-items: center;
  border-radius: 8px;
  display: inline-flex;
  width: auto;
  align-items: center;
  min-height: 38px;
  @media (min-width: 768px) {
    min-height: 42px;
    font-size: 0.9rem;
  }
`;

const FormMessages: React.FC<{ messages: IMessage[] }> = ({ messages }) => {
  return (
    <FormMessagesWrapper>
      {messages.map((message) => (
        <div key={message.key}>
          <FormMessage>{message.message}</FormMessage>
        </div>
      ))}
    </FormMessagesWrapper>
  );
};

export default FormMessages;
