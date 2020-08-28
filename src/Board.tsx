import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';

import {
	DragDropContext,
	DropResult,
	Droppable,
	Draggable,
} from 'react-beautiful-dnd';

import * as Data from './data';

import { KanbanColumn } from './components/KanbanColumn';
import { AddColumnButton } from './components/AddColumnButton';
import { Intl, IntlContext, DEFAULT_INTL } from './components/IntlContext';

interface InnerColumnListProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card
> {
	columns: TColumn[];

	onChangeColumnName?: (column: TColumn, name: string) => void;

	onAddCard?: (column: TColumn) => void;

	children: (card: TCard) => React.ReactNode;
}

const useStyles = makeStyles(theme => ({
	content: {
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1,
		overflowX: 'auto',
		overflowY: 'hidden',
		padding: theme.spacing(0, 3, 1, 3),
	},
	deleteButton: {
		marginRight: theme.spacing(1),
	},
	tabs: {
		flexGrow: 1,
	},
	list: {
		display: 'flex',
		flexDirection: 'row',
	},
	columnContainer: {
		marginRight: theme.spacing(2),
		padding: 0,
	},
	addColumnButton: {
		// Keep space for scrolling
		paddingRight: theme.spacing(3),
	},
}));

function InnerColumnList<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card
>({
	columns,
	onAddCard: handleAddCard,
	onChangeColumnName: handleChangeColumnName,
	children,
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
								isDragging={snapshot.isDragging}
								key={column.id}
								index={index}
								column={column}
								onNameChanged={
									handleChangeColumnName
										? name => handleChangeColumnName(column, name)
										: undefined
								}
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

interface Props<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card
> {
	columns: TColumn[];
	onChange?: (newColumns: TColumn[]) => void;

	intl?: Intl;

	// Factory methods for data items
	createColumn?: () => Promise<TColumn>;
	createCard?: (column: TColumn) => Promise<TCard>;

	// Callbacks
	// TODO: Review these, in particular the parameters (ids vs the things) and the return values (who modifies the arrays?)

	onColumnAdded?: (column: TColumn, index: number) => void;
	onColumnMoved?: (column: TColumn, newIndex: number) => void;
	onColumnNameChanged?: (column: TColumn, name: string) => Promise<void>;

	onCardAdded?: (card: TCard, column: TColumn, index: number) => void;
	onCardMoved?: (card: TCard, newColumn: TColumn, newIndex: number) => void;

	children: (card: TCard) => React.ReactNode;
}

export function Board<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card
>({
	columns: initialColumns,
	onChange,

	createColumn,
	createCard,

	onColumnAdded,
	onColumnMoved,
	onColumnNameChanged: handleChangeColumnName,
	onCardAdded,
	onCardMoved,
	children,

	intl = DEFAULT_INTL,
}: Props<TColumn, TCard>) {
	const [columns, setColumns] = useState(initialColumns);
	const classes = useStyles();

	// XXX: If there are no callbacks provided, how would we handle this?
	// - Should we require them?
	// - Should we modify the provided data, and assume the caller is fine with that and will pull it out automatically?
	// - Should we simply ignore that there is a difference appearing between "data we had" and "data we now have"?
	// This also relates to how react would now trigger re-rendering, as the content changes.
	function moveCard(cardId: string, columnId: string, index: number) {
		// Move it in the provided data and then invoke the callback.
		const card = columns
			.map(column => column.cards.find(card => card.id === cardId))
			.reduce((result, card) => result ?? card, undefined);

		if (!card) {
			// Huuuuh? What did the user move then?
			console.error(`Cannot find card ${cardId}`);
			return;
		}

		// Now that we have the card: update all columns.
		let newColumn: TColumn | undefined;
		const newColumns = columns.map(column => {
			const newCards = column.cards.filter(card => card.id !== cardId);
			if (column.id === columnId) {
				newCards.splice(index, 0, card);
				newColumn = column;
			}
			return {
				...column,
				cards: newCards,
			};
		});
		if (!newColumn) {
			console.error(`Cannot find new column ${columnId}`);
			return;
		}

		setColumns(newColumns);
		if (onCardMoved) {
			onCardMoved(card, newColumn, newColumn.cards.indexOf(card));
		}
	}

	function moveColumn(columnId: string, index: number) {
		const { newColumns, column } = columns.reduce(
			(result, column) => {
				if (column.id === columnId) {
					return {
						...result,
						column,
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
			},
		);
		if (!column) {
			// Huuuuh? What did the user move then?
			console.error(`Cannot find column ${columnId}`);
			return;
		}
		newColumns.splice(index, 0, column);

		setColumns(newColumns);
		if (onColumnMoved) {
			onColumnMoved(column, newColumns.indexOf(column));
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
		if (onColumnAdded) {
			onColumnAdded(newColumn, newColumns.length - 1);
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
		if (onCardAdded) {
			onCardAdded(newCard, column, newIndex);
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
										columns={columns}
										onChangeColumnName={handleChangeColumnName}
										onAddCard={createCard && handleAddCard}
									>
										{children}
									</InnerColumnList>
								</List>
								{provided.placeholder}
								{createColumn && (
									<AddColumnButton
										onClick={handleAddColumn}
										styles={{ container: classes.addColumnButton }}
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
