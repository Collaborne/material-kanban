import { ReactNode, memo, useCallback } from 'react';
import { makeStyles } from 'tss-react/mui';

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

const useStyles = makeStyles()(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
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
		renderActions,
		styles,
	}: ColumnHeaderProps<TColumn, TCard>) => {
		const { classes, cx } = useStyles();

		const renderName = useCallback(
			(column: TColumn, intl: Intl) => {
				if (propsRenderName) {
					return propsRenderName(column);
				}
				return column.name || intl.columnNamePlaceholder;
			},
			[propsRenderName],
		);

		const renderContent = useCallback(
			(intl: Intl) => (
				<div className={cx(classes.root, styles?.columnHeaderRoot)}>
					<div className={cx(classes.name, styles?.columnHeaderName)}>
						{renderName(column, intl)}
					</div>
					{renderActions && renderActions()}
				</div>
			),
			[classes, column, cx, renderName, renderActions, styles],
		);

		return <IntlContext.Consumer>{renderContent}</IntlContext.Consumer>;
	},
);
