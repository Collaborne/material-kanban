import React from 'react';
import { makeStyles } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

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

export function AddCardButton({ onClick, styles }: AddCardButtonProps) {
	const classes = useStyles();

	return (
		<IntlContext.Consumer>
			{intl => (
				<Button
					startIcon={<AddIcon />}
					onClick={onClick}
					className={styles?.addCardButton}
					classes={{ label: classes.buttonLabel }}
					color="inherit"
					fullWidth
				>
					{intl.addCardButtonLabel}
				</Button>
			)}
		</IntlContext.Consumer>
	);
}
