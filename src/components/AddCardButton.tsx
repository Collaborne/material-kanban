import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { IntlContext } from './IntlContext';

interface Props {
	onClick?: () => void;
	className?: string;
}

const useStyles = makeStyles(theme => ({
	button: {
		background: theme.palette.background.paper,
		borderColor: theme.palette.divider,
	},
}));

export function AddCardButton({ onClick, className }: Props) {
	const classes = useStyles();

	return (
		<IntlContext.Consumer>
			{intl => (
				<Button
					startIcon={<AddIcon />}
					onClick={onClick}
					className={clsx(className, classes.button)}
					variant="outlined"
					color="inherit"
					fullWidth
				>
					{intl.addCardButtonLabel}
				</Button>
			)}
		</IntlContext.Consumer>
	);
}
