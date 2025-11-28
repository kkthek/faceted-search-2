import {styled} from "@mui/material/styles";

const Span = styled('span', {

    shouldForwardProp: (prop: string) => prop !== 'color' && prop !== 'variant' && prop !== 'sx'

})(({ theme }) => ({

    ...theme.typography.body1,
    color: ((theme as any).vars || theme).palette.text.primary,
    fontSize: '1em',
}));

export const Span2 = styled('span', {

    shouldForwardProp: (prop: string) => prop !== 'color' && prop !== 'variant' && prop !== 'sx'

})(({ theme }) => ({

    ...theme.typography.body1,
    color: ((theme as any).vars || theme).palette.text.secondary,
    fontSize: '1em',
}));

export default Span;