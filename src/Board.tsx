import React, { useEffect, useState } from 'react';

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
				<Draggable key={column.id} draggableId={column.id} index={index}>
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
	onChange?: (newColumns: TColumn[]) => void;

	intl?: Intl;
	styles?: Styles;

	// Factory methods for data items
	createColumn?: () => Promise<TColumn | undefined>;
	createCard?: (column: TColumn) => Promise<TCard | undefined>;

	// Callbacks
	// TODO: Review these, in particular the parameters (ids vs the things) and the return values (who modifies the arrays?)

	onColumnAdded?: (column: TColumn, index: number) => void;
	onColumnMoved?: (column: TColumn, newIndex: number, oldIndex: number) => void;

	onCardAdded?: (card: TCard, column: TColumn, index: number) => void;
	onCardMoved?: (
		card: TCard,
		newColumn: TColumn,
		newIndex: number,
		oldColumn: TColumn,
		oldIndex: number,
	) => void;

	children?: RenderCard<TCard>;
}

export function Board<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card
>({
	columns: initialColumns,
	onChange,

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
	const [columns, setColumns] = useState(initialColumns);

	// XXX: If there are no callbacks provided, how would we handle this?
	// - Should we require them?
	// - Should we modify the provided data, and assume the caller is fine with that and will pull it out automatically?
	// - Should we simply ignore that there is a difference appearing between "data we had" and "data we now have"?
	// This also relates to how react would now trigger re-rendering, as the content changes.
	function moveCard(cardId: string, columnId: string, index: number) {
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

		setColumns(newColumns);
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

		setColumns(newColumns);
		if (handleColumnMoved) {
			handleColumnMoved(column, newColumns.indexOf(column), oldIndex);
		}
	}

	async function handleAddColumn() {
		if (!createColumn) {
			// Caller shouldn't have called this in the first place!
			return;
		}

		const newColumn = await createColumn();
		if (!newColumn) {
			return;
		}

		const newColumns = [...columns, newColumn];

		setColumns(newColumns);
		if (handleColumnAdded) {
			handleColumnAdded(newColumn, newColumns.length - 1);
		}
	}

	async function handleAddCard(column: TColumn) {
		if (!createCard) {
			// Caller shouldn't have called this in the first place!
			return;
		}

		const newCard = await createCard(column);
		if (!newCard) {
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

		setColumns(newColumns);
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

	useEffect(() => {
		if (onChange) {
			onChange(columns);
		}
	}, [onChange, columns]);

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
