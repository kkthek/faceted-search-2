import {createTheme} from "@mui/material";
import {blueGrey, lightBlue} from "@mui/material/colors";

const DEFAULT_THEME = createTheme({
    palette: {
        primary: blueGrey,
        secondary: lightBlue,
    },
    components: {
        // Inputs
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "#eee", // As an example color
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