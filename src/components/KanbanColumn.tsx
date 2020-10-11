import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { Droppable } from 'react-beautiful-dnd';

import * as Data from '../data';

import { AddCardButton, AddCardButtonStyles } from './AddCardButton';
import { ColumnHeader } from './ColumnHeader';
import { KanbanCard, RenderCard } from './KanbanCard';

export interface KanbanColumnProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card
> {
	column: TColumn;
	isDragging: boolean;
	index: number;

	styles?: AddCardButtonStyles;

	onNameChanged?: (name: string) => void;

	onAddCard?: () => void;

	children?: RenderCard<TCard>;

	/**
	 * Render a button or similar control that provides additional per-column actions.
	 */
	actions?: () => React.ReactNode;

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

	onNameChanged,
	getColumnClassName,

	actions: renderActions,
	children,
	...props
}: KanbanColumnProps<TColumn, TCard>) {
	const classes = useStyles();

	function handleNameChange(newName: string) {
		column.name = newName;

		if (onNameChanged) {
			onNameChanged(newName);
		}
	}

	return (
		<Droppable droppableId={column.id} type="card">
			{provided => (
				<Paper
					{...provided.droppableProps}
					elevation={0}
					innerRef={provided.innerRef}
					className={clsx(
						classes.paper,
						getColumnClassName ? getColumnClassName(column) : undefined,
					)}
				>
					<ColumnHeader
						name={column.name}
						onNameChanged={handleNameChange}
						renderActions={renderActions}
					/>

					<List className={classes.list}>
						<InnerObjectsList cards={column.cards} children={children} />
						{provided.placeholder}
						{handleAddCard && (
							<AddCardButton onClick={handleAddCard} styles={props.styles} />
						)}
					</List>
				</Paper>
			)}
		</Droppable>
	);
}
