/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createRef, RefObject, useEffect } from "react";
import { FieldProps, useField } from "formik";

import styled from "emotion";
import { baseInputStyles } from "components/ui";

import { ReactComponent as CheveronDown } from "assets/icons/icon-cheveron-down.svg";

const SelectFormFieldWrapper = styled("div")<{ active: boolean }>`
  ${baseInputStyles}
  border: solid 1px ${(props: any) =>
    props.active ? props.theme.colors.primary : props.theme.colors.light};
  color: ${(props) => props.theme.colors.gray};
  position: relative;
`;

const SelectFormFieldInput = styled("div")<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  svg {
    fill: ${(props) => props.theme.colors.gray};
    transform: rotate(${(props) => (props.active ? "180deg" : "0")});
    margin-right: -5px;
  }
  span {
    &.placeholder {
      font-size: 14px;
    }
    &.icon {
      max-height: 16px;
      margin-top: -6px;
    }
    @media (min-width: 768px) {
      &.placeholder {
        font-size: 16px;
      }
    }
  }
`;

const SelectFormFieldOptions = styled("div")<{ active: boolean }>`
  background: #fff;
  position: absolute;
  z-index: ${(props) => (props.active ? "10" : "-1")};
  width: 100%;
  left: 0;
  top: 110%;
  border-radius: 6px;
  border: solid 1px ${(props: any) => props.theme.colors.light};
  box-shadow: 0 5px 30px rgba(226, 232, 240, 0.55);
  box-sizing: content-box;
  opacity: ${(props) => (props.active ? "1" : "0")};
  max-height: ${(props) => (props.active ? "300px" : "0")};
  overflow: auto;
  transform: translateY(${(props) => (props.active ? "0" : "-30%")});
  transition: all ease-in-out 150ms;

  @media (min-width: 768px) {
    border-radius: 8px;
  }
`;

const SelectFormFieldOption = styled("div")<{ selected?: boolean }>`
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  color: ${(props) =>
    props.selected ? props.theme.colors.dark : props.theme.colors.secondary};
  border-bottom: solid 1px ${(props) => props.theme.colors.light};
  padding: 1rem;
  font-size: 14px;
  cursor: pointer;
  :last-of-type {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    padding: 1.25rem 1.375rem;
    font-size: 16px;
  }
`;

const SelectField: React.FC<Partial<FieldProps> & Partial<IFormField>> = ({
  options,
  placeholder,
  name,
  disabledIf,
}) => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [field, , helpers] = useField(name || "");
  const disabledOn = useField(disabledIf?.key || "");
  console.log(disabledOn);

  // Handle options when selected
  const handleChange = (selectedOption: OptionType) => {
    setSelected(selectedOption.value);
    helpers.setValue(selectedOption.value);
    setActive(false);
  };

  const selectNode: RefObject<HTMLDivElement> = createRef();

  useEffect(() => {
    // Close select option if clicked outside
    const handleOutsideClicks = (e: MouseEvent) => {
      // @ts-ignore
      if (selectNode.current && selectNode.current?.contains(e!.target)) {
        setActive(true);
      } else {
        setActive(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClicks, false);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClicks, false);
    };
  }, []);

  const label = (value: string) => {
    const option = options?.find((opt) => opt.value === value);
    return option ? option.label : null;
  };

  return (
    <SelectFormFieldWrapper active={active} ref={selectNode}>
      <SelectFormFieldInput active={active} onClick={() => setActive(!active)}>
        <span className="placeholder">{label(field.value) || placeholder}</span>
        <span className="icon">
          <CheveronDown />
        </span>
      </SelectFormFieldInput>
      <SelectFormFieldOptions active={active}>
        {options!.map((opt) => (
          <SelectFormFieldOption
            key={opt.key}
            selected={opt.value === selected}
            onClick={() => handleChange(opt)}
          >
            {opt.label}
          </SelectFormFieldOption>
        ))}
      </SelectFormFieldOptions>
    </SelectFormFieldWrapper>
  );
};

export default SelectField;
