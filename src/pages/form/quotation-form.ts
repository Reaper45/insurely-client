import * as Yup from "yup";

//
const generateYears = (limit: number): OptionType[] => {
  const currentYear = new Date().getFullYear();
  const options = [];
  for (let index = currentYear; index > currentYear - limit; index--) {
    options.push({
      value: `${index}`,
      label: `${index}`,
      key: `${index}`,
    });
  }
  return options;
};

const generateMonths = (): OptionType[] => {
  const options = [];
  const start = 12;
  for (let index = start; index > 0; index--) {
    options.push({
      value: `${index}`,
      label: `${index} Months`,
      key: `${index}`,
    });
  }
  return options;
};

const quotationFormSections: IFormSection[] = [
  {
    stepNumber: 1,
    section: "1",
    form: {
      messages: [
        {
          key: "1",
          message: "Hello 👋",
        },
        {
          key: "2",
          message: "Let’s work together to get you that perfect price.",
        },
      ],
      fields: [
        {
          type: "group",
          name: "name",
          children: [
            {
              name: "firstName",
              type: "text",
              placeholder: "First name",
              // required: true,
            },
            {
              name: "lastName",
              type: "text",
              placeholder: "Last name",
              // required: true,
            },
          ],
        },
        {
          name: "email",
          type: "email",
          placeholder: "Email address",
          required: true,
        },
        {
          name: "phoneNumber",
          type: "text",
          placeholder: "Phone Number",
          required: true,
        },
      ],
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email"),
      phoneNumber: Yup.number().required("Invalid value for phone number"),
    }),
  },
  {
    stepNumber: 2,
    section: "2",
    form: {
      messages: [
        {
          key: "3",
          message: "Please tell us about the car you want to insure.",
        },
      ],
      fields: [
        {
          name: "vehicleUse",
          type: "classes",
          required: true,
        },
      ],
    },
  },
  {
    stepNumber: 3,
    section: "2",
    form: {
      messages: [
        {
          key: "4",
          message: "What about the value & year of manufacture",
        },
      ],
      fields: [
        {
          name: "yearOfManufacture",
          type: "select",
          placeholder: "Year of manufacture",
          required: true,
          options: generateYears(15),
        },
        {
          name: "sumInsured",
          type: "text",
          placeholder: "Value of my car",
          required: true,
          label: "KSH",
        },
      ],
    },
    validationSchema: Yup.object({
      yearOfManufacture: Yup.string().required(
        "Year of manufacture is required"
      ),
      sumInsured: Yup.number().min(500000),
    }),
  },
  {
    stepNumber: 4,
    section: "3",
    form: {
      messages: [
        {
          key: "5",
          message: "Please tell us about the car you want to insure",
        },
      ],
      fields: [
        {
          name: "typeOfCover",
          type: "categories",
          placeholder: "Type of cover",
          required: true,
          classFieldName: "vehicleUse",
        },
      ],
    },
  },
  {
    stepNumber: 5,
    section: "4",
    form: {
      messages: [
        {
          key: "6",
          message: "One last thing",
        },
        {
          key: "7",
          message: "How long do you want this policy to last.",
        },
      ],
      fields: [
        {
          name: "duration",
          type: "select",
          placeholder: "Type of cover",
          required: true,
          options: generateMonths(),
        },
      ],
    },
  },
];

export interface IQuotationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  vehicleUse: string;
  yearOfManufacture: string;
  sumInsured: string;
  typeOfCover: string;
  duration: string;
}

export const initialValues: Partial<IQuotationFormValues> = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  vehicleUse: "",
  yearOfManufacture: "",
  sumInsured: "",
  typeOfCover: "",
  duration: "12",
};

export default quotationFormSections;
