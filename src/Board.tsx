/* eslint-disable max-lines */
import Container from '@mui/material/Container';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { makeStyles } from 'tss-react/mui';

import { AddCardButtonStyles } from './components/AddCardButton';
import {
	AddColumnButton,
	AddColumnButtonStyles,
} from './components/AddColumnButton';
import { Intl, IntlContext, DEFAULT_INTL } from './components/IntlContext';
import { RenderCard } from './components/KanbanCard';
import {
	KanbanColumn,
	KanbanColumnProps,
	KanbanColumnStyles,
} from './components/KanbanColumn';
import * as Data from './data';
import {
	useBoardDragAndDrop,
	type CardDropIndicator,
} from './hooks/useBoardDragAndDrop';
import { useColumnDragAndDrop } from './hooks/useColumnDragAndDrop';

/** Styles that can be modified by a caller */
export type BoardClassKey = never;

const useStyles = makeStyles()(theme => ({
	content: {
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1,
		overflowX: 'auto',
		overflowY: 'hidden',
	},
	deleteButton: {
		marginRight: theme.spacing(1),
	},
	list: {
		display: 'flex',
		flexDirection: 'row',
	},
	columnContainer: {
		padding: '0!important',
	},
	columnDropIndicator: {
		alignSelf: 'stretch',
		borderRadius: theme.shape.borderRadius,
		flex: '0 0 auto',
		marginRight: theme.spacing(0.85),
		marginLeft: theme.spacing(0.85),
		pointerEvents: 'none',
		width: theme.spacing(0.25),
	},
	visibleIndicator: {
		backgroundColor: theme.palette.primary.main,
	},
	addButtonContainer: {
		marginTop: theme.spacing(1),
	},
}));

interface InnerColumnListProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
> extends Pick<
		BoardProps<TColumn, TCard>,
		'getColumnClassName' | 'styles' | 'renderColumnActions' | 'renderColumnName'
	> {
	columns: readonly TColumn[];

	onChangeColumnName?: (column: TColumn, name: string) => void;

	onAddCard?: (column: TColumn) => void;

	columnActions?: (column: TColumn) => React.ReactNode;

	isColumnDragDisabled?: boolean;
	isCardDragDisabled?: boolean;

	columnDropIndicatorIndex?: number | null;
	cardDropIndicator?: CardDropIndicator | null;

	children?: RenderCard<TCard>;
}

interface ColumnItemProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
> extends Omit<
		InnerColumnListProps<TColumn, TCard>,
		'columns' | 'columnDropIndicatorIndex' | 'cardDropIndicator'
	> {
	column: TColumn;
	index: number;
	className: string;
	cardDropIndicatorIndex?: number | null;
}

function ColumnItem<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
>({
	column,
	index,
	className,
	onAddCard: handleAddCard,
	isColumnDragDisabled,
	cardDropIndicatorIndex,
	children,
	...props
}: ColumnItemProps<TColumn, TCard>) {
	const { registerElement, isDragging } = useColumnDragAndDrop({
		columnId: column.id,
		index,
		isDragDisabled: isColumnDragDisabled,
	});

	return (
		<Container ref={registerElement} className={className}>
			<KanbanColumn
				{...props}
				cardDropIndicatorIndex={cardDropIndicatorIndex ?? undefined}
				isDragging={isDragging}
				index={index}
				column={column}
				onAddCard={handleAddCard ? () => handleAddCard(column) : undefined}
			>
				{children}
			</KanbanColumn>
		</Container>
	);
}

function InnerColumnList<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
>({
	columns,
	columnDropIndicatorIndex,
	cardDropIndicator,
	onAddCard: handleAddCard,

	children,
	...props
}: InnerColumnListProps<TColumn, TCard>) {
	const { classes, cx } = useStyles();
	return (
		<>
			{columns.map((column, index) => {
				const cardDropIndicatorIndex =
					cardDropIndicator?.columnId === column.id
						? cardDropIndicator.index
						: null;
				return (
					<React.Fragment key={column.id}>
						<div
							aria-hidden="true"
							className={cx(classes.columnDropIndicator, {
								[classes.visibleIndicator]: columnDropIndicatorIndex === index,
							})}
						/>
						<ColumnItem
							className={classes.columnContainer}
							column={column}
							index={index}
							onAddCard={handleAddCard}
							cardDropIndicatorIndex={cardDropIndicatorIndex ?? undefined}
							{...props}
						>
							{children}
						</ColumnItem>
					</React.Fragment>
				);
			})}
		</>
	);
}

type Styles = AddCardButtonStyles &
	AddColumnButtonStyles &
	KanbanColumnStyles & {
		root?: string;
	};

export interface BoardProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
> extends Pick<
		KanbanColumnProps<TColumn, TCard>,
		'getColumnClassName' | 'renderColumnActions' | 'renderColumnName'
	> {
	columns: readonly TColumn[];

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

	/**
	 * Custom element to add columns
	 */
	AddColumnButton?: React.ReactElement | null;

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
	TCard extends Data.Card,
>({
	columns,
	onChange: handleChange,

	createColumn,
	createCard,

	onColumnAdded: handleColumnAdded,
	onColumnMoved: handleColumnMoved,
	onCardAdded: handleCardAdded,
	onCardMoved: handleCardMoved,

	getColumnClassName,
	styles,
	renderColumnActions,
	renderColumnName,

	AddColumnButton: AddColumnButtonParam,

	children,

	intl = DEFAULT_INTL,
}: BoardProps<TColumn, TCard>) {
	const { classes, cx } = useStyles();
	const handlesColumnAdded = Boolean(handleChange || handleColumnAdded);
	const handlesColumnMoved = Boolean(handleChange || handleColumnMoved);
	const handlesCardAdded = Boolean(handleChange || handleCardAdded);
	const handlesCardMoved = Boolean(handleChange || handleCardMoved);

	const moveCard = useCallback(
		(cardId: string, columnId: string, index: number) => {
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
		},
		[columns, handleCardMoved, handleChange, handlesCardMoved],
	);

	const moveColumn = useCallback(
		(columnId: string, index: number) => {
			if (!handlesColumnMoved) {
				// No point in working out the details
				return;
			}

			const {
				newColumns,
				column,
				index: oldIndex,
			} = columns.reduce(
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
		},
		[columns, handleChange, handleColumnMoved, handlesColumnMoved],
	);

	const { columnDropIndicatorIndex, cardDropIndicator, setListRef } =
		useBoardDragAndDrop<TColumn, TCard>({
			columns,
			moveCard,
			moveColumn,
		});

	const handleAddColumn = useCallback(async () => {
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
	}, [
		columns,
		createColumn,
		handleChange,
		handleColumnAdded,
		handlesColumnAdded,
	]);

	const handleAddCard = useCallback(
		async (column: TColumn) => {
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
		},
		[columns, createCard, handleCardAdded, handleChange, handlesCardAdded],
	);

	const addColumnButton = useMemo(() => {
		if (AddColumnButtonParam || AddColumnButtonParam === null) {
			return AddColumnButtonParam;
		}
		if (createColumn) {
			return (
				<AddColumnButton
					onClick={handleAddColumn}
					styles={{
						addColumnButton: styles?.addColumnButton ?? '',
					}}
				/>
			);
		}
		return null;
	}, [createColumn, handleAddColumn, AddColumnButtonParam, styles]);

	return (
		<div className={cx(classes.content, styles?.root)}>
			<IntlContext.Provider value={intl}>
				<div className={classes.list} ref={setListRef}>
					<InnerColumnList
						getColumnClassName={getColumnClassName}
						styles={styles}
						renderColumnActions={renderColumnActions}
						renderColumnName={renderColumnName}
						columns={columns}
						columnDropIndicatorIndex={columnDropIndicatorIndex ?? undefined}
						cardDropIndicator={cardDropIndicator ?? undefined}
						onAddCard={createCard && handleAddCard}
						isColumnDragDisabled={!handlesColumnMoved}
						isCardDragDisabled={!handlesCardMoved}
					>
						{children}
					</InnerColumnList>
				</div>
				<div className={classes.addButtonContainer}>{addColumnButton}</div>
			</IntlContext.Provider>
		</div>
	);
}
