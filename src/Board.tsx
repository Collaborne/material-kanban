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

interface InnerColumnListProps {
	columns: Data.Column[];

	onChangeColumnName?: (column: Data.Column, name: string) => void;

	onAddCard?: (column: Data.Column) => void;

	children: (card: Data.Card) => React.ReactNode;
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

function InnerColumnList({
	columns,
	onAddCard: handleAddCard,
	onChangeColumnName: handleChangeColumnName,
	children,
}: InnerColumnListProps) {
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
										? (name: string) => handleChangeColumnName(column, name)
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

interface Props {
	columns: Data.Column[];
	onChange?: (newColumns: Data.Column[]) => void;

	intl?: Intl;

	// Factory methods for data items
	createColumn?: () => Promise<Data.Column>;
	createCard?: (column: Data.Column) => Promise<Data.Card>;

	// Callbacks
	// TODO: Review these, in particular the parameters (ids vs the things) and the return values (who modifies the arrays?)

	onColumnAdded?: (column: Data.Column, index: number) => void;
	onColumnMoved?: (column: Data.Column, newIndex: number) => void;
	onColumnNameChanged?: (column: Data.Column, name: string) => Promise<void>;

	onCardAdded?: (card: Data.Card, column: Data.Column, index: number) => void;
	onCardMoved?: (
		card: Data.Card,
		newColumn: Data.Column,
		newIndex: number,
	) => void;

	children: (card: Data.Card) => React.ReactNode;
}

export function Board({
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
	intl,
}: Props) {
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
		let newColumn: Data.Column | undefined;
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
				newColumns: [] as Data.Column[],
				column: undefined as Data.Column | undefined,
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

	async function handleAddCard(column: Data.Column) {
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
		<>
			<div className={classes.content}>
				<IntlContext.Provider value={intl ?? DEFAULT_INTL}>
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
		</>
	);
}
