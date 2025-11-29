import {styled} from "@mui/material/styles";

interface SpanProps {
    color?: 'primary' | 'secondary';
    variant?: 'normal' | 'dashed';
}


const Span = styled('span', {
    // Configure which props should be forwarded on DOM
    shouldForwardProp: (prop) =>
        prop !== 'color' && prop !== 'variant' && prop !== 'sx',
    name: 'Span',
    slot: 'Root',
    // We are specifying here how the styleOverrides are being applied based on props
    overridesResolver: (props, styles) => [
        styles.root,
        props.color === 'primary' && styles.primary,
        props.color === 'secondary' && styles.secondary,
    ],
})<SpanProps>((props) => {
    const textPalette = ((props.theme as any).vars || props.theme).palette.text;
    return ({
    ...props.theme.typography.body1,
    color: props.color === 'secondary' ? textPalette.secondary: textPalette.primary,
    fontSize: '1em',
    });
});

export default Span;