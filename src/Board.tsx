import React from 'react';

import { makeStyles, WithStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import clsx from 'clsx';
import {
	DragDropContext,
	DropResult,
	Droppable,
	Draggable,
} from 'react-beautiful-dnd';

import * as Data from './data';

import {
	KanbanColumn,
	KanbanColumnProps,
	KanbanColumnStyles,
} from './components/KanbanColumn';
import { AddCardButtonStyles } from './components/AddCardButton';
import {
	AddColumnButton,
	AddColumnButtonStyles,
} from './components/AddColumnButton';
import { Intl, IntlContext, DEFAULT_INTL } from './components/IntlContext';
import { RenderCard } from './components/KanbanCard';

/** Styles that can be modified by a caller */
export type BoardClassKey = never;

const useStyles = makeStyles(theme => ({
	content: {
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1,
		overflowX: 'auto',
		overflowY: 'hidden',
		padding: theme.spacing(0, 3, 1, 3),
	} as CSSProperties,
	deleteButton: {
		marginRight: theme.spacing(1),
	} as CSSProperties,
	list: {
		display: 'flex',
		flexDirection: 'row',
	} as CSSProperties,
	columnContainer: {
		marginRight: theme.spacing(2),
		padding: 0,
	} as CSSProperties,
	addColumnButton: {
		// Keep space for scrolling
		paddingRight: theme.spacing(3),
	} as CSSProperties,
}));

interface InnerColumnListProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card
> extends Partial<WithStyles<BoardClassKey>>,
		Pick<
			BoardProps<TColumn, TCard>,
			'getColumnClassName' | 'styles' | 'renderColumnActions'
		> {
	columns: TColumn[];

	onChangeColumnName?: (column: TColumn, name: string) => void;

	onAddCard?: (column: TColumn) => void;

	columnActions?: (column: TColumn) => React.ReactNode;

	isColumnDragDisabled?: boolean;
	isCardDragDisabled?: boolean;

	children?: RenderCard<TCard>;
}

function InnerColumnList<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card
>({
	columns,
	onAddCard: handleAddCard,

	children,
	...props
}: InnerColumnListProps<TColumn, TCard>) {
	const classes = useStyles();
	return (
		<>
			{columns.map((column, index) => (
				<Draggable
					key={column.id}
					draggableId={column.id}
					index={index}
					isDragDisabled={props.isColumnDragDisabled}
				>
					{(draggableProvided, snapshot) => (
						<Container
							{...draggableProvided.draggableProps}
							{...draggableProvided.dragHandleProps}
							innerRef={draggableProvided.innerRef}
							className={classes.columnContainer}
						>
							<KanbanColumn
								{...props}
								isDragging={snapshot.isDragging}
								key={column.id}
								index={index}
								column={column}
								onAddCard={
									handleAddCard ? () => handleAddCard(column) : undefined
								}
							>
								{children}
							</KanbanColumn>
						</Container>
					)}
				</Draggable>
			))}
		</>
	);
}

type Styles = AddCardButtonStyles & AddColumnButtonStyles & KanbanColumnStyles;

export interface BoardProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card
> extends Partial<WithStyles<BoardClassKey>>,
		Pick<
			KanbanColumnProps<TColumn, TCard>,
			'getColumnClassName' | 'renderColumnActions'
		> {
	columns: TColumn[];

	intl?: Intl;
	styles?: Styles;

	// Factory methods for data items
	createColumn?: () => Promise<TColumn | undefined>;
	createCard?: (column: TColumn) => Promise<TCard | undefined>;

	/**
	 * Update the current columns with the given new columns
	 *
	 * This callback will be invoked when the column order and/or content needs to be changed, and will always
	 * be invoked before the more the specific callback. For instance, when both `onChange` and `onColumnMoved` are
	 * provided the `onChange` callback will be invoked before the `onColumnMoved` callback.
	 */
	onChange?: (newColumns: TColumn[]) => void;

	/**
	 * A column was added
	 */
	onColumnAdded?: (column: TColumn, index: number) => void;
	/**
	 * A column was moved
	 */
	onColumnMoved?: (column: TColumn, newIndex: number, oldIndex: number) => void;

	/**
	 * A card was added
	 */
	onCardAdded?: (card: TCard, column: TColumn, index: number) => void;
	/**
	 * A column was moved
	 */
	onCardMoved?: (
		card: TCard,
		newColumn: TColumn,
		newIndex: number,
		oldColumn: TColumn,
		oldIndex: number,
	) => void;

	children?: RenderCard<TCard>;
}

/**
 * A basic kanban-style board
 *
 * This component renders the provided columns and their cards, and allows the user to manipulate the board.
 *
 * From a developer perspective most props are optional, and if they are not provided may disable the related
 * functionality: If there is no `createCard` available, then the board will not allow to create cards, for example.
 *
 * The component provides essentially two levels of granularity for learning about the changes:
 * * The `onChange` callback reports changes for the rendered columns, which is easy to use but may require diff-ing against
 *   the original `columns` property to understand the change
 * * The `on{Column,Card}{Added,Moved}` callbacks provide information on the level of individual columns and cards
 *
 * Note that the board doesn't provide means to delete columns or cards; these functionalities can be provided through
 * the `renderColumnActions` callback for columns or the `children` for rendering cards, respectively.
 */
export function Board<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card
>({
	columns,
	onChange: handleChange,

	createColumn,
	createCard,

	onColumnAdded: handleColumnAdded,
	onColumnMoved: handleColumnMoved,
	onCardAdded: handleCardAdded,
	onCardMoved: handleCardMoved,

	children,

	intl = DEFAULT_INTL,
	...props
}: BoardProps<TColumn, TCard>) {
	const classes = useStyles();

	const handlesColumnAdded = Boolean(handleChange || handleColumnAdded);
	const handlesColumnMoved = Boolean(handleChange || handleColumnMoved);
	const handlesCardAdded = Boolean(handleChange || handleCardAdded);
	const handlesCardMoved = Boolean(handleChange || handleCardMoved);

	function moveCard(cardId: string, columnId: string, index: number) {
		if (!handlesCardMoved) {
			// No point in working out the details
			return;
		}

		// Move it in the provided data and then invoke the callback.
		const found = columns
			.map(column => {
				const index = column.cards.findIndex(card => card.id === cardId);
				if (index === -1) {
					return undefined;
				}
				return {
					column,
					index,
				};
			})
			.reduce((result, entry) => result ?? entry, undefined);

		if (!found) {
			// Huuuuh? What did the user move then?
			console.error(`Cannot find card ${cardId}`);
			return;
		}

		const { column: oldColumn, index: oldIndex } = found;
		const card = oldColumn.cards[oldIndex];

		// Now that we have the card: update all columns.
		let newColumn: TColumn | undefined;
		const newColumns = columns.map(column => {
			const newCards = column.cards.filter(card => card.id !== cardId);
			if (column.id !== columnId) {
				return {
					...column,
					cards: newCards,
				};
			}

			newCards.splice(index, 0, card);
			newColumn = {
				...column,
				cards: newCards,
			};
			return newColumn;
		});
		if (!newColumn) {
			console.error(`Cannot find new column ${columnId}`);
			return;
		}

		if (handleChange) {
			handleChange(newColumns);
		}
		if (handleCardMoved) {
			handleCardMoved(
				card,
				newColumn,
				newColumn.cards.findIndex(card => card.id === cardId),
				oldColumn,
				oldIndex,
			);
		}
	}

	function moveColumn(columnId: string, index: number) {
		if (!handlesColumnMoved) {
			// No point in working out the details
			return;
		}

		const { newColumns, column, index: oldIndex } = columns.reduce(
			(result, column, index) => {
				if (column.id === columnId) {
					return {
						...result,
						column,
						index,
					};
				} else {
					return {
						...result,
						newColumns: [...result.newColumns, column],
					};
				}
			},
			{
				newColumns: [] as TColumn[],
				column: undefined as TColumn | undefined,
				index: -1,
			},
		);
		if (!column) {
			// Huuuuh? What did the user move then?
			console.error(`Cannot find column ${columnId}`);
			return;
		}
		newColumns.splice(index, 0, column);

		if (handleChange) {
			handleChange(newColumns);
		}
		if (handleColumnMoved) {
			handleColumnMoved(column, newColumns.indexOf(column), oldIndex);
		}
	}

	async function handleAddColumn() {
		// Adding a column involves two steps:
		// 1. Trigger the side-effect
		// 2. Report the change in the column contents
		if (!createColumn) {
			// Caller shouldn't have called this in the first place!
			return;
		}

		const newColumn = await createColumn();
		if (!newColumn) {
			return;
		}

		if (!handlesColumnAdded) {
			return;
		}

		const newColumns = [...columns, newColumn];

		if (handleChange) {
			handleChange(newColumns);
		}
		if (handleColumnAdded) {
			handleColumnAdded(newColumn, newColumns.length - 1);
		}
	}

	async function handleAddCard(column: TColumn) {
		// Adding a card involves two steps:
		// 1. Trigger the side-effect
		// 2. Report the change in the column contents
		if (!createCard) {
			return;
		}

		const newCard = await createCard(column);
		if (!newCard) {
			return;
		}

		if (!handlesCardAdded) {
			return;
		}

		let newIndex: number | undefined;
		const newColumns = columns.map(existingColumn => {
			if (existingColumn.id === column.id) {
				const newCards = [...column.cards, newCard];
				newIndex = newCards.length - 1;
				return {
					...existingColumn,
					cards: newCards,
				};
			} else {
				return existingColumn;
			}
		});
		if (typeof newIndex === 'undefined') {
			console.log(`Cannot find column ${column.id}`);
			return;
		}

		if (handleChange) {
			handleChange(newColumns);
		}
		if (handleCardAdded) {
			handleCardAdded(newCard, column, newIndex);
		}
	}

	function handleDragEnd(result: DropResult) {
		const { destination, source, draggableId, type } = result;
		if (!destination) {
			// No drop happened, e.g. cancelled
			return;
		}
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			// User dropped object into original position
			return;
		}

		if (type === 'card') {
			moveCard(draggableId, destination.droppableId, destination.index);
		} else {
			moveColumn(draggableId, destination.index);
		}
	}

	return (
		<div className={classes.content}>
			<IntlContext.Provider value={intl}>
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable
						droppableId="container"
						type="column"
						direction="horizontal"
					>
						{provided => (
							<>
								<List
									{...provided.droppableProps}
									innerRef={provided.innerRef}
									component="nav"
									className={classes.list}
								>
									<InnerColumnList
										{...props}
										columns={columns}
										onAddCard={createCard && handleAddCard}
										isColumnDragDisabled={!handlesColumnMoved}
										isCardDragDisabled={!handlesCardMoved}
									>
										{children}
									</InnerColumnList>
								</List>
								{provided.placeholder}
								{createColumn && (
									<AddColumnButton
										onClick={handleAddColumn}
										styles={{
											addColumnButton: clsx(
												classes.addColumnButton,
												props.styles?.addColumnButton,
											),
										}}
									/>
								)}
							</>
						)}
					</Droppable>
				</DragDropContext>
			</IntlContext.Provider>
		</div>
	);
}
