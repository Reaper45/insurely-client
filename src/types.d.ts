import { InputHTMLAttributes } from "react";

type OptionType = {
  key: string;
  value: string;
  label: string;
};
// 
interface IField extends InputHTMLAttributes<HTMLInputElement>  {}

interface IFormField extends IField {
  children?: IField[];
  options?: OptionType[];
}

interface IForm {
  messages: {
    key: string;
    message: string;
  }[];
  fields: IFormField[];
}

interface IFormSection {
  form: IForm;
  step: number;
  section: string;
}
