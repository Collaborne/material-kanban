import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { Droppable } from 'react-beautiful-dnd';

import * as Data from '../data';

import { AddCardButton, AddCardButtonStyles } from './AddCardButton';
import {
	ColumnHeader,
	ColumnHeaderProps,
	ColumnHeaderStyles,
} from './ColumnHeader';
import { KanbanCard, RenderCard } from './KanbanCard';

export interface KanbanColumnStyles
	extends AddCardButtonStyles,
		ColumnHeaderStyles {
	column?: string;
}

export interface KanbanColumnProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card
> extends ColumnHeaderProps {
	column: TColumn;
	isDragging: boolean;
	index: number;

	styles?: KanbanColumnStyles;

	onAddCard?: () => void;

	children?: RenderCard<TCard>;

	/**
	 * Render a button or similar control that provides additional per-column actions.
	 */
	renderColumnActions?: (colum: TColumn) => React.ReactNode;

	/**
	 * Allows clients to style columns
	 *
	 * @param colum To be styled column
	 *
	 * @returns Name of the CSS class that should be attached to the column. Return
	 * 	`undefined` to keep standard styling
	 */
	getColumnClassName?: (colum: TColumn) => string | undefined;
}

interface InnerObjectsListProps<TCard extends Data.Card = Data.Card> {
	cards: TCard[];

	children?: RenderCard<TCard>;
}

const useStyles = makeStyles(theme => ({
	paper: {
		width: '240px',
		height: '100%',
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
	},
	list: {
		flexGrow: 1,
		overflowY: 'auto',
		padding: theme.spacing(0.25, 1, 1, 1),
	},
}));

// FIXME: Bring back React.memo()
function InnerObjectsList<TCard extends Data.Card = Data.Card>({
	cards,
	children,
}: InnerObjectsListProps<TCard>) {
	return (
		<>
			{cards.map((card, index) => (
				<KanbanCard key={card.id} card={card} index={index}>
					{children}
				</KanbanCard>
			))}
		</>
	);
}

export function KanbanColumn<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card
>({
	column,
	onAddCard: handleAddCard,

	renderColumnActions,
	getColumnClassName,

	children,
	...props
}: KanbanColumnProps<TColumn, TCard>) {
	const classes = useStyles();

	return (
		<Paper
			elevation={0}
			className={clsx(
				classes.paper,
				props.styles?.column,
				getColumnClassName ? getColumnClassName(column) : undefined,
			)}
		>
			<Droppable droppableId={column.id} type="card">
				{provided => (
					<>
						<ColumnHeader
							{...props}
							name={column.name}
							renderActions={
								renderColumnActions
									? () => renderColumnActions(column)
									: undefined
							}
						/>

						<List className={classes.list}>
							<div {...provided.droppableProps} ref={provided.innerRef}>
								<InnerObjectsList cards={column.cards}>
									{children}
								</InnerObjectsList>
								{provided.placeholder}
								{handleAddCard && (
									<AddCardButton
										onClick={handleAddCard}
										styles={props.styles}
									/>
								)}
							</div>
						</List>
					</>
				)}
			</Droppable>
		</Paper>
	);
}
