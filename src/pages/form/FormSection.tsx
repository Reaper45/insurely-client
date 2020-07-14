import React from "react";

import styled from "emotion";
import { Input } from "components/ui";

import { IForm, IFormField } from "types";
import Radio from "components/ui/RadioButton";

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

const FormSectionWrapper = styled("div")<{ active: boolean }>`
  display: ${props => props.active ? "block" : "none"};
`;

const FormSection: React.FC<{ form: IForm; active: boolean }> = ({
  active, form,
}) => {
  return (
    <FormSectionWrapper active={active}>
      {form.fields.map((field: IFormField) => {
        let input = <Input key={field.name} {...field} />;
        if (field.type === "group") {
          input = (
            <InputGroup key={field.name}>
              {field.children!.map((child: any) => (
                <div key={child.name}>
                  <Input {...child} />
                </div>
              ))}
            </InputGroup>
          );
        }
        if (field.type === "radio") {
          input = (
            <div key={field.name}>
              {field.options!.map((opt) => (
                <Radio
                  key={opt.key}
                  name={field.name}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </div>
          );
        }
        return input;
      })}
    </FormSectionWrapper>
  );
};

export default FormSection;
