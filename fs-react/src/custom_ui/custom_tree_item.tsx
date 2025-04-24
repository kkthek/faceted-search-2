import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
    TreeItemContent,
    TreeItemIconContainer,
    TreeItemRoot,
    TreeItemGroupTransition,
} from '@mui/x-tree-view/TreeItem';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

interface StyledTreeItemProps
    extends Omit<UseTreeItemParameters, 'rootRef'>,
        React.HTMLAttributes<HTMLLIElement> {
    bgColor?: string;
    bgColorForDarkMode?: string;
    color?: string;
    colorForDarkMode?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
}

type CustomTreeItemRootOwnerState = Pick<
    StyledTreeItemProps,
    'color' | 'bgColor' | 'colorForDarkMode' | 'bgColorForDarkMode'
    >;

const CustomTreeItemRoot = styled(TreeItemRoot)<{
    ownerState: CustomTreeItemRootOwnerState;
}>(({ theme, ownerState }) => ({
    '--tree-view-color': ownerState.color,
    '--tree-view-bg-color': ownerState.bgColor,
    color: (theme.vars || theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        '--tree-view-color': ownerState.colorForDarkMode,
        '--tree-view-bg-color': ownerState.bgColorForDarkMode,
    }),
}));

const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
    marginBottom: theme.spacing(0.3),
    color: (theme.vars || theme).palette.text.secondary,
    borderRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
    fontWeight: theme.typography.fontWeightMedium,
    '&[data-expanded]': {
        fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
        backgroundColor: (theme.vars || theme).palette.action.hover,
    },
    '&[data-focused], &[data-selected], &[data-selected][data-focused]': {
        backgroundColor: `var(--tree-view-bg-color, ${(theme.vars || theme).palette.action.selected})`,
        color: 'var(--tree-view-color)',
    },
}));

const CustomTreeItemIconContainer = styled(TreeItemIconContainer)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: StyledTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const {
        id,
        itemId,
        label,
        disabled,
        children,
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        colorForDarkMode,
        bgColorForDarkMode,
        ...other
    } = props;

    const {
        getContextProviderProps,
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getLabelProps,
        getGroupTransitionProps,
        status,
    } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

    const treeItemRootOwnerState = {
        color,
        bgColor,
        colorForDarkMode,
        bgColorForDarkMode,
    };

    return (
        <TreeItemProvider {...getContextProviderProps()}>
            <CustomTreeItemRoot
                {...getRootProps(other)}
                ownerState={treeItemRootOwnerState}
            >
                <CustomTreeItemContent {...getContentProps()}>
                    <CustomTreeItemIconContainer {...getIconContainerProps()}>
                        <TreeItemIcon status={status} />
                    </CustomTreeItemIconContainer>
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                            alignItems: 'center',
                            p: 0.5,
                            pr: 0,
                        }}
                    >
                        <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                        <Typography
                            {...getLabelProps({
                                variant: 'body2',
                                sx: { display: 'flex', fontWeight: 'inherit', flexGrow: 1 },
                            })}
                        />
                        <Typography variant="caption" color="inherit">
                            {labelInfo}
                        </Typography>
                    </Box>
                </CustomTreeItemContent>
                {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
            </CustomTreeItemRoot>
        </TreeItemProvider>
    );
});


