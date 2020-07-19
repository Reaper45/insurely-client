import React, { InputHTMLAttributes } from "react";

import styled from "emotion";

export const CheckboxFieldWrapper = styled("div")<{
  disabled?: boolean;
}>`
  padding: 8px 0;
  input {
    width: auto;
    appearance: none;
    padding: 8px;
    border-radius: 2px;
    border: solid 2px ${(props) => props.theme.colors.light};
    background-position: center;
    outline: none;
    :checked {
      background: #fff url(${require("../../assets/icons/icon-check.png")}) no-repeat
        center;
    }
  }
`;

interface ICheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const CheckboxInput: React.FC<ICheckboxInputProps & { label?: string }> = ({
  label,
  ...rest
}) => {
  return (
    <CheckboxFieldWrapper>
      <input type="checkbox" {...rest} onChange={console.log} />
    </CheckboxFieldWrapper>
  );
};

export default CheckboxInput;
