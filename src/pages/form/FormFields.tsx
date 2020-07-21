import React from "react";
import { IFormField } from "types";
import { FieldProps, useField } from "formik";

import { Input, FieldWrapper, FieldError } from "components/ui";
import Radio from "components/ui/RadioButton";
import SelectField from "components/ui/SelectField";

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
