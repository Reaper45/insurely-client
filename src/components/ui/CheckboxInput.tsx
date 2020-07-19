import React, { InputHTMLAttributes } from "react";

import styled from "emotion";

const CheckboxFieldWrapper = styled("label")<{
  disabled?: boolean;
  checked?: boolean;
}>`
  padding: 8px 0;
  display: flex;
  align-items: center;
  input {
    width: auto;
    appearance: none;
    padding: 8px;
    border-radius: 2px;
    border: solid 2px ${(props) => props.theme.colors.light};
    background-position: center;
    outline: none;
    :checked {
      background: #fff url(${require("../../assets/icons/icon-check.png")})
        no-repeat center;
      background-size: 90%;
      & + span {
        color: ${(props) => props.theme.colors.dark};
      }
    }
  }
  .checkbox-label {
    margin-left: 0.75rem;
    color: ${(props) => props.theme.colors.secondary};
  }
`;

interface ICheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const CheckboxInput: React.FC<ICheckboxInputProps & { label?: string }> = ({
  label,
  ...rest
}) => {
  return (
    <CheckboxFieldWrapper htmlFor={rest.name} checked={rest.checked}>
      <input type="checkbox" id={rest.name} {...rest} onChange={console.log} />
      {label && <span className="checkbox-label">{label}</span>}
    </CheckboxFieldWrapper>
  );
};

export default CheckboxInput;
