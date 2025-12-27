import Box from "@mui/material/Box";
import Span from "../../custom_ui/span";

function ErrorComponent(prop: {error: any}) {
    return <><Box sx={
        {width:'100%',
            background: 'red',
            textAlign: 'center',
            fontSize: '5em',
            padding: '10px',
            borderRadius: '5px',
            margin: '10px',
            color: 'white'}
    }>Something went wrong</Box>
        <Box>Status: {prop.error.status} ({prop.error.statusText})</Box>
        <Box>Message: <Span>{prop.error.message}</Span></Box>
    </>
}

export default ErrorComponent;