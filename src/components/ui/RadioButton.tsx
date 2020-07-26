import React from "react";
import { Field, useField } from "formik";

import styled from "emotion";

const RadioWrapper = styled("label")<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 6px;
  padding: 1rem;
  border: solid 1px
    ${(props) =>
      props.checked ? props.theme.colors.primary : props.theme.colors.light};
  font-size: 14px;
  margin-bottom: 1.5rem;
  position: relative;
  color: ${(props) => props.checked ? props.theme.colors.dark : props.theme.colors.gray};
  :focused {
    transition-duration: 0;
    border-color: ${(props) => props.theme.colors.primary};
  }
  @media (min-width: 768px) {
    padding: 1.25rem 1.375rem;
    font-size: 16px;
    border-radius: 8px;
  }
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  .checkmark {
    height: 22px;
    width: 22px;
    background-color: ${(props) => props.theme.colors.light};
    border-radius: 12px;
  }
  input:checked ~ .checkmark {
    background-color: ${(props) => props.theme.colors.primary};
  }
  input:checked ~ {
    border-color: ${(props) => props.theme.colors.primary};
  }
  .checkmark:after {
    content: "";
    display: block;
  }
  .checkmark:after {
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 4px;
    position: relative;
    top: 7px;
    left: 7px;
  }
`;

const Radio: React.FC<{ label: string; value: string; name?: string }> = ({
  label,
  value,
  name,
}) => {
  const [field] = useField(name || "");

  return (
    <RadioWrapper htmlFor={label.replace(/\s/g, "")} checked={field.value === value}>
      {label}
      <Field
        id={label.replace(/\s/g, "")}
        type="radio"
        name={name}
        value={value}
      />
      <span className="checkmark"></span>
    </RadioWrapper>
  );
};

export default Radio;
