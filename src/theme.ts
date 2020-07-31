export interface ITheme {
  colors: {
    primary: string;
    dark: string;
    light: string;
    secondary: string;
    accent: string;
    gray: string;
    white: string;
    red: string;
    green: string;
    orange: string;
  };
}

export const theme: ITheme = {
  colors: {
    primary: "#114AAF",
    dark: "#2A4365",
    light: "#E2E8F0",
    secondary: "#718096",
    accent: "#1A202C",
    //
    gray: "#A0AEC0", // placeholders
    white: "#FFFFFF",
    // Status colors
    red: "#E53E3E", // Error
    green: "#38A169", // Success
    orange: "#D69E2E", // Warn
  },
};
