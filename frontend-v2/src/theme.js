import { blue, lightGreen, pink, purple, yellow } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
export const appTheme = createTheme({
  palette: {
    primary: {
      light: yellow[300],
      main: yellow[700],
      dark: yellow[700],
    },
    secondary: {
      light: blue[300],
      main: blue[500],
      dark: blue[700],
    },
  },
});