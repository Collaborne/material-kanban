import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import { IntlContext } from './IntlContext';

interface Styles {
	container: string;
}
interface Props {
	onClick?: () => void;
	styles?: Styles;
}

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(1),
		width: '240px',
	},
	button: {
		padding: theme.spacing(2),
		border: 0,
	},
}));

export function AddColumnButton({ onClick, styles }: Props) {
	const classes = useStyles();

	return (
		<div className={styles?.container}>
			<IntlContext.Consumer>
				{intl => (
					<Paper elevation={0} className={classes.paper}>
						<Button
							startIcon={<AddIcon />}
							onClick={onClick}
							className={classes.button}
							fullWidth
							variant="outlined"
							color="inherit"
						>
							{intl.addColumnButtonLabel}
						</Button>
					</Paper>
				)}
			</IntlContext.Consumer>
		</div>
	);
}
