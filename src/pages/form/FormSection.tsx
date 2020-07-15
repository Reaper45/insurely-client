import React from "react";

import { IForm, IFormField } from "types";

import styled from "emotion";
import { Input } from "components/ui";
import Radio from "components/ui/RadioButton";
import FormMessages from "components/ui/FormMessages";
import SelectFormField from "components/ui/SelectFormField";

const InputGroup = styled("div")`
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

const FieldWrapper = styled("div")`
  position: relative;
  span.label {
    font-weight: bold;
    font-size: 14px;
    color: ${(props) => props.theme.colors.secondary};
    position: absolute;
    right: 1rem;
    top: 1rem;
    @media (min-width: 768px) {
      font-size: 16px;
      right: 1.375rem;
      top: 1.25rem;
    }
  }
`;

const FormSectionWrapper = styled("div")<{ active: boolean }>`
  display: ${(props) => (props.active ? "block" : "none")};
`;

const FormSection: React.FC<{ form: IForm; active: boolean }> = ({
  active,
  form,
}) => {
  return (
    <FormSectionWrapper active={active}>
      <FormMessages messages={form.messages} />
      {form.fields.map((field: IFormField) => {
        let input = (
          <FieldWrapper key={field.name}>
            <Input {...field} />
            {field.label && <span className="label">{field.label}</span>}
          </FieldWrapper>
        );
        if (field.type === "group") {
          input = (
            <InputGroup key={field.name}>
              {field.children!.map((child: any) => (
                <FieldWrapper key={child.name}>
                  <Input {...child} />
                </FieldWrapper>
              ))}
            </InputGroup>
          );
        }
        if (field.type === "radio") {
          input = (
            <FieldWrapper key={field.name}>
              {field.options!.map((opt) => (
                <Radio
                  key={opt.key}
                  name={field.name}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </FieldWrapper>
          );
        }
        if (field.type === "select") {
          input = <SelectFormField key={field.name} field={field} />;
        }
        return input;
      })}
    </FormSectionWrapper>
  );
};

export default FormSection;
