import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

import { IntlContext } from './IntlContext';

export interface ColumnHeaderStyles {
	columnHeaderRoot?: string;
	columnHeaderName?: string;
}

export interface ColumnHeaderProps {
	name?: string;
	styles?: ColumnHeaderStyles;

	/**
	 * Render a button or similar control that provides additional per-column actions.
	 */
	renderActions?: () => React.ReactNode;
}

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		margin: theme.spacing(0, 1),
		minHeight: theme.spacing(4),
	},
	name: {
		flexGrow: 1,
		paddingRight: theme.spacing(1),
		fontWeight: 'bold',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
}));

export const ColumnHeader = React.memo((props: ColumnHeaderProps) => {
	const classes = useStyles();

	return (
		<IntlContext.Consumer>
			{intl => (
				<div className={clsx(classes.root, props.styles?.columnHeaderRoot)}>
					<div className={clsx(classes.name, props.styles?.columnHeaderName)}>
						{props.name || intl.columnNamePlaceholder}
					</div>
					{props.renderActions && props.renderActions()}
				</div>
			)}
		</IntlContext.Consumer>
	);
});
