import { InputHTMLAttributes } from "react";

declare global {
  export type OptionType = {
    key: string;
    value: string;
    label: string;
  };
  //
  export interface IField extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
  }

  export interface IFormField extends IField {
    children?: IField[];
    options?: OptionType[];
    classFieldName?: string;
  }

  interface IMessage {
    key: string;
    message: string;
  }

  export interface IForm {
    messages: IMessage[];
    fields: IFormField[];
  }

  export interface IFormSection {
    form: IForm;
    stepNumber: number;
    section: string;
    validationSchema?: object;
    // requiresVerification?: boolean;
  }

  // API
  export type InsurerType = {
    id: string;
    name: string;
    logo: string;
  };

  export type QuoteType = {
    id?: string;
    product_id: string;
    name?: string;
    insurer?: Partial<InsurerType>;
    has_ipf: boolean;
  };

  export type BenefitType = {
    id: string;
    name: string;
    product?: Partial<ProductType>;
    tariffs?: Partial<TariffType>;
    charges?: Partial<ChargeType>;
  };

  export type ProductType = {
    id: string;
    name: string;
    is_active: string;
    insurer_id: string;
    category_id: string;
    insurance_class_id: string;
    insurer?: Partial<InsurerType>;
    category?: Partial<CategoryType>;
  };

  export type CategoryType = {
    id: string;
    name: string;
  };

  export type TariffType = {
    id: string;
    name: string;
    value: string;
    is_percentage: string;
    is_active: string;
  };

  export type ChargeType = {
    id: string;
    name: string;
    value: string;
    is_percentage: string;
  };

  export type InsuranceClassType = {
    id: string;
    name: string;
  };
}
