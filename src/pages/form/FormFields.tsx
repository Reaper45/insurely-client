import React from "react";
import { FieldProps, useField } from "formik";

import { Input, FieldWrapper, FieldError } from "components/ui";
import Radio from "components/ui/RadioButton";
import SelectField from "components/ui/SelectField";
import useClasses from "components/hooks/useClasses";
import useCategories from "components/hooks/useCategories";
import Loader from "components/ui/Loader";

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

export const ClassesFormField: React.FC<IFormField> = ({ name }) => {
  const [, meta] = useField(name || "");
  const [loading, options] = useClasses();

  return (
    <FieldWrapper>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        options!.map((opt) => <Radio name={name} {...opt} />)
      )}
      {meta.touched && meta.error && <FieldError>{meta.error}</FieldError>}
    </FieldWrapper>
  );
};

export const CategoriesFormField: React.FC<IFormField> = ({
  name,
  classFieldName,
}) => {
  const [, meta] = useField(name || "");
  const [field] = useField(classFieldName || "");
  const [loading, options] = useCategories(field.value);

  return (
    <FieldWrapper>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        options!.map((opt) => <Radio name={name} {...opt} />)
      )}
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
