import { makeStyles } from '@mui/styles';

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import { IntlContext } from './IntlContext';

export interface AddCardButtonStyles {
	addCardButton: string;
}
export interface AddCardButtonProps {
	onClick?: () => void;
	styles?: AddCardButtonStyles;
}

const useStyles = makeStyles(() => ({
	buttonLabel: {
		justifyContent: 'left',
	},
}));

export function AddCardButton({
	onClick,
	styles,
}: AddCardButtonProps): JSX.Element {
	const classes = useStyles();

	return (
		<IntlContext.Consumer>
			{intl => (
				<Button
					startIcon={<AddIcon />}
					onClick={onClick}
					className={styles?.addCardButton}
					classes={{ text: classes.buttonLabel }}
					color="inherit"
					fullWidth
				>
					{intl.addCardButtonLabel}
				</Button>
			)}
		</IntlContext.Consumer>
	);
}
