import { ReactNode, memo, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

import * as Data from '../data';
import { Intl, IntlContext } from './IntlContext';

export interface ColumnHeaderStyles {
	columnHeaderRoot?: string;
	columnHeaderName?: string;
}

export interface ColumnHeaderProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
> {
	column: TColumn;
	styles?: ColumnHeaderStyles;

	/**
	 * Render the name of the column
	 */
	renderName?: (column: TColumn) => ReactNode;

	/**
	 * Render a button or similar control that provides additional per-column actions.
	 */
	renderActions?: () => ReactNode;
}

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		minHeight: theme.spacing(4),
	},
	name: {
		flexGrow: 1,
		paddingRight: theme.spacing(1),
		overflow: 'hidden',
	},
	defaultNameLabel: {
		fontWeight: 'bold',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
}));

export const ColumnHeader = memo(
	<TColumn extends Data.Column<TCard>, TCard extends Data.Card = Data.Card>({
		column,
		renderName: propsRenderName,
		...props
	}: ColumnHeaderProps<TColumn, TCard>) => {
		const classes = useStyles();

		const renderName = useCallback(
			(column: TColumn, intl: Intl) => {
				if (propsRenderName) {
					return propsRenderName(column);
				}
				return column.name || intl.columnNamePlaceholder;
			},
			[propsRenderName],
		);

		return (
			<IntlContext.Consumer>
				{intl => (
					<div className={clsx(classes.root, props.styles?.columnHeaderRoot)}>
						<div className={clsx(classes.name, props.styles?.columnHeaderName)}>
							{renderName(column, intl)}
						</div>
						{props.renderActions && props.renderActions()}
					</div>
				)}
			</IntlContext.Consumer>
		);
	},
);
