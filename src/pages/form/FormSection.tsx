import React from "react";
import { Field } from "formik";

import styled from "emotion";

import FormMessages from "components/ui/FormMessages";
import {
  InputField,
  ClassesFormField,
  CategoriesFormField,
  SelectFormField,
} from "./FormFields";

const GroupInput = styled("div")`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  @media (max-width: 767px) {
    flex-wrap: wrap;
    > div {
      padding: 0 !important;
    }
  }
  > div {
    width: 100%;
    flex: 1 1 auto;
    :first-of-type {
      padding-right: 0.5rem;
    }
    :last-of-type {
      padding-left: 0.5rem;
    }
  }
`;

const FormSectionWrapper = styled("div")<{ active: boolean }>`
  display: ${(props) => (props.active ? "block" : "none")};
`;

const FormSection: React.FC<{
  form: IForm;
  active: boolean;
}> = ({ active, form }) => {
  return (
    <FormSectionWrapper active={active}>
      <FormMessages messages={form.messages} />
      {form.fields.map((field: IFormField) => {
        if (field.type === "group") {
          return (
            <GroupInput key={field.name}>
              {field.children!.map((child: any) => (
                <Field component={InputField} key={child.name} {...child} />
              ))}
            </GroupInput>
          );
        }
        if (field.type === "classes") {
          return (
            <ClassesFormField
              key={field.name}
              name={field.name}
            />
          );
        }
        if (field.type === "categories") {
          return (
            <CategoriesFormField
              key={field.name}
              name={field.name}
              classFieldName={field.classFieldName}
            />
          );
        }
        if (field.type === "select") {
          return (
            <Field component={SelectFormField} key={field.name} {...field} />
          );
        }
        return <Field component={InputField} key={field.name} {...field} />;
      })}
    </FormSectionWrapper>
  );
};

export default FormSection;
