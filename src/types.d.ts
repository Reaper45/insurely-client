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
  stepNumber: number;
  section: string;
  validationSchema?: object;
  // requiresVerification?: boolean;
}


// API
type InsurerType = {
  id: string;
  name: string;
  logo: string;
}

type QuoteType = {
  id?: string;
  product_id: string;
  name?: string;
  insurer?: Partial<InsurerType>;
  has_ipf: boolean;
}

type BenefitType = {
  id: string;
  name: string;
  product?: Partial<ProductType>;
  tariffs?: Partial<TariffType>;
  charges?: Partial<ChargeType>;
}

type ProductType = {
  id: string;
  name: string;
  is_active: string;
  insurer_id: string;
  category_id: string;
  insurance_class_id: string;
  insurer?: Partial<InsurerType>;
  category?: Partial<CategoryType>
}

type CategoryType = {
  id: string;
  name: string;
}

type TariffType = {
  id: string;
  name: string;
  value: string;
  is_percentage: string;
  is_active: string
}

type ChargeType = {
  id: string;
  name: string;
  value: string;
  is_percentage: string;
}