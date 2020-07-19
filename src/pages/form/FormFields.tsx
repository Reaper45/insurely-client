import React from "react";
import { IFormField } from "types";
import { FieldProps, useField } from "formik";

import styled from "emotion";

import { Input } from "components/ui";
import Radio from "components/ui/RadioButton";
import SelectField from "components/ui/SelectField";

export const FieldWrapper = styled("div")`
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

export const InputField: React.FC<FieldProps & IFormField> = ({
  form: { touched, errors },
  field,
  ...props
}) => {
  return (
    <FieldWrapper>
      <Input
        className={touched[field.name] && errors[field.name] ? "error" : ""}
        {...field}
        {...props}
      />
      {touched[field.name] && errors[field.name] && (
        <FieldError>{errors[field.name]}</FieldError>
      )}
    </FieldWrapper>
  );
};

export const RadioFormField: React.FC<IFormField> = ({ options, name }) => {
  const [, meta] = useField(name || "");
  return (
    <FieldWrapper>
      {options!.map((opt) => (
        <Radio name={name} {...opt} />
      ))}
      {meta.touched && meta.error && <FieldError>{meta.error}</FieldError>}
    </FieldWrapper>
  );
};

export const SelectFormField: React.FC<FieldProps & IFormField> = ({
  form: { touched, errors },
  field,
  ...props
}) => {
  return (
    <FieldWrapper>
      <SelectField {...field} {...props} />
      {touched[field.name] && errors[field.name] && (
        <FieldError>{errors[field.name]}</FieldError>
      )}
    </FieldWrapper>
  );
};
