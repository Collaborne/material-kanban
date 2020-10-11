import React from 'react';

import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import InputBase from '@material-ui/core/InputBase';

import { IntlContext } from './IntlContext';

interface Props {
	name?: string;
	onNameChanged: (name: string) => void;

	renderActions?: () => React.ReactNode;
}

const useStyles = makeStyles(theme => ({
	name: {
		padding: theme.spacing(0, 1),
		fontWeight: 'bold',
	},
}));

export const ColumnHeader = React.memo((props: Props) => {
	const classes = useStyles();
	const [name, setName] = React.useState(props.name ?? '');

	function handleBlur() {
		const initialName = props.name ?? '';
		if (initialName !== name) {
			props.onNameChanged(name);
		}
	}

	return (
		<IntlContext.Consumer>
			{intl => (
				<Box display="flex" mx={1} alignItems="center">
					<InputBase
						className={classes.name}
						value={name}
						placeholder={intl.columnNamePlaceholder}
						fullWidth
						onChange={e => setName(e.target.value)}
						onBlur={handleBlur}
					/>
					{props.renderActions ? props.renderActions() : undefined}
				</Box>
			)}
		</IntlContext.Consumer>
	);
});
