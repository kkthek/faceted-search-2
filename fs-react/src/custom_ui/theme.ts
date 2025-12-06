import {createTheme} from "@mui/material";
import {blueGrey, indigo} from "@mui/material/colors";

const DEFAULT_THEME = createTheme({
    palette: {
        primary: indigo,
        secondary: blueGrey,
        text: {primary: indigo[800], secondary: blueGrey[600]}
    },
    components: {
        // Inputs
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "#fff", // As an example color
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: "none"
                    },
                    "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: "none"
                        }
                    }
                }
            }
        }
    }
});

export default DEFAULT_THEME;