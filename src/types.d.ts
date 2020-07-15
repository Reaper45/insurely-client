import { InputHTMLAttributes } from "react";

type OptionType = {
  key: string;
  value: string;
  label: string;
};
// 
interface IField extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

interface IFormField extends IField {
  children?: IField[];
  options?: OptionType[];
}

interface IMessage {
  key: string;
  message: string;
}

interface IForm {
  messages: IMessage[];
  fields: IFormField[];
}

interface IFormSection {
  form: IForm;
  step: number;
  section: string;
}
