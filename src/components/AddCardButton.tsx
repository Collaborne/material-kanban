import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { memo, useMemo } from 'react';
import { makeStyles } from 'tss-react/mui';

import { IntlContext } from './IntlContext';

export interface AddCardButtonStyles {
	addCardButton: string;
}
export interface AddCardButtonProps {
	onClick?: () => void;
	styles?: AddCardButtonStyles;
}

const useStyles = makeStyles()(() => ({
	buttonLabel: {
		justifyContent: 'left',
	},
}));

export const AddCardButton = memo(({ onClick, styles }: AddCardButtonProps) => {
	const { classes } = useStyles();

	const buttonClasses = useMemo(
		() => ({ text: classes.buttonLabel }),
		[classes],
	);

	return (
		<IntlContext.Consumer>
			{intl => (
				<Button
					startIcon={<AddIcon />}
					onClick={onClick}
					className={styles?.addCardButton}
					classes={buttonClasses}
					color="inherit"
					fullWidth
				>
					{intl.addCardButtonLabel}
				</Button>
			)}
		</IntlContext.Consumer>
	);
});
