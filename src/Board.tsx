/* eslint-disable max-lines */
import {
	draggable,
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import Container from '@mui/material/Container';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles } from 'tss-react/mui';

import { AddCardButtonStyles } from './components/AddCardButton';
import {
	AddColumnButton,
	AddColumnButtonStyles,
} from './components/AddColumnButton';
import { Intl, IntlContext, DEFAULT_INTL } from './components/IntlContext';
import {
	CARD_DRAG_TYPE,
	CARD_DROP_TARGET_TYPE,
	CARD_LIST_DROP_TARGET_TYPE,
	CardDragData,
	CardDropTargetData,
	CardListDropTargetData,
	RenderCard,
} from './components/KanbanCard';
import {
	KanbanColumn,
	KanbanColumnProps,
	KanbanColumnStyles,
} from './components/KanbanColumn';
import * as Data from './data';

const COLUMN_DRAG_TYPE = 'column' as const;
const COLUMN_DROP_TARGET_TYPE = 'column-position' as const;

interface ColumnDragData {
	type: typeof COLUMN_DRAG_TYPE;
	columnId: string;
	index: number;
}

interface ColumnDropTargetData {
	type: typeof COLUMN_DROP_TARGET_TYPE;
	columnId?: string;
	index: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isCardDragData(value: unknown): value is CardDragData {
	if (!isRecord(value)) {
		return false;
	}
	return (
		value.type === CARD_DRAG_TYPE &&
		typeof value.cardId === 'string' &&
		typeof value.columnId === 'string' &&
		typeof value.index === 'number'
	);
}

function isColumnDragData(value: unknown): value is ColumnDragData {
	if (!isRecord(value)) {
		return false;
	}
	return (
		value.type === COLUMN_DRAG_TYPE &&
		typeof value.columnId === 'string' &&
		typeof value.index === 'number'
	);
}

function isCardDropTargetData(value: unknown): value is CardDropTargetData {
	if (!isRecord(value)) {
		return false;
	}
	return (
		value.type === CARD_DROP_TARGET_TYPE &&
		typeof value.columnId === 'string' &&
		typeof value.index === 'number'
	);
}

function isCardListDropTargetData(
	value: unknown,
): value is CardListDropTargetData {
	if (!isRecord(value)) {
		return false;
	}
	return (
		value.type === CARD_LIST_DROP_TARGET_TYPE &&
		typeof value.columnId === 'string' &&
		typeof value.index === 'number'
	);
}

function isColumnDropTargetData(value: unknown): value is ColumnDropTargetData {
	if (!isRecord(value)) {
		return false;
	}
	return (
		value.type === COLUMN_DROP_TARGET_TYPE && typeof value.index === 'number'
	);
}

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
		marginRight: theme.spacing(2),
		padding: '0!important',
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

	children?: RenderCard<TCard>;
}

interface ColumnItemProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
> extends Omit<InnerColumnListProps<TColumn, TCard>, 'columns'> {
	column: TColumn;
	index: number;
	className: string;
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
	children,
	...props
}: ColumnItemProps<TColumn, TCard>) {
	const [element, setElement] = useState<HTMLElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		if (!element) {
			return;
		}
		return dropTargetForElements({
			element,
			canDrop: ({ source }) => {
				return source.data?.type === COLUMN_DRAG_TYPE;
			},
			getData: ({ input }) => {
				const rect = element.getBoundingClientRect();
				const isAfter = input.clientX >= rect.left + rect.width / 2;
				const data = {
					type: COLUMN_DROP_TARGET_TYPE,
					columnId: column.id,
					index: isAfter ? index + 1 : index,
				};
				return data;
			},
			getDropEffect: () => 'move',
		});
	}, [column.id, element, index]);

	useEffect(() => {
		if (!element || isColumnDragDisabled) {
			if (element) {
				element.removeAttribute('draggable');
			}
			setIsDragging(false);
			return;
		}
		return draggable({
			element,
			canDrag: () => !isColumnDragDisabled,
			getInitialData: () => ({
				type: COLUMN_DRAG_TYPE,
				columnId: column.id,
				index,
			}),
			onDragStart: () => {
				setIsDragging(true);
			},
			onDrop: () => {
				setIsDragging(false);
			},
		});
	}, [column.id, element, index, isColumnDragDisabled]);

	return (
		<Container ref={setElement} className={className}>
			<KanbanColumn
				{...props}
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
	onAddCard: handleAddCard,

	children,
	...props
}: InnerColumnListProps<TColumn, TCard>) {
	const { classes } = useStyles();
	return (
		<>
			{columns.map((column, index) => (
				<ColumnItem
					key={column.id}
					className={classes.columnContainer}
					column={column}
					index={index}
					onAddCard={handleAddCard}
					{...props}
				>
					{children}
				</ColumnItem>
			))}
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
	const [listElement, setListElement] = useState<HTMLDivElement | null>(null);

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

	const handleCardDrop = useCallback(
		(source: CardDragData, dropTargets: Array<{ data: unknown }>) => {
			const cardPositionTarget = dropTargets.find(target =>
				isCardDropTargetData(target.data),
			);
			const cardListTarget = dropTargets.find(target =>
				isCardListDropTargetData(target.data),
			);
			let targetData: CardDropTargetData | CardListDropTargetData | undefined;
			if (cardPositionTarget) {
				targetData = cardPositionTarget.data as CardDropTargetData;
			} else if (cardListTarget) {
				targetData = cardListTarget.data as CardListDropTargetData;
			} else {
				targetData = undefined;
			}
			if (!targetData) {
				return;
			}
			let destinationIndex = targetData.index;
			const destinationColumnId = targetData.columnId;
			if (!destinationColumnId) {
				return;
			}
			if (
				destinationColumnId === source.columnId &&
				destinationIndex > source.index
			) {
				destinationIndex -= 1;
			}
			if (
				destinationColumnId === source.columnId &&
				destinationIndex === source.index
			) {
				return;
			}
			moveCard(source.cardId, destinationColumnId, destinationIndex);
		},
		[moveCard],
	);

	const handleColumnDrop = useCallback(
		(source: ColumnDragData, dropTargets: Array<{ data: unknown }>) => {
			const columnTarget = dropTargets.find(target =>
				isColumnDropTargetData(target.data),
			);
			if (!columnTarget) {
				return;
			}
			const targetData = columnTarget.data as ColumnDropTargetData;
			let destinationIndex = targetData.index;
			const isSameColumn = targetData.columnId
				? targetData.columnId === source.columnId
				: true;
			if (isSameColumn && destinationIndex > source.index) {
				destinationIndex -= 1;
			}
			if (isSameColumn && destinationIndex === source.index) {
				return;
			}
			if (destinationIndex < 0) {
				return;
			}
			moveColumn(source.columnId, destinationIndex);
		},
		[moveColumn],
	);

	useEffect(() => {
		if (!listElement) {
			return;
		}
		return dropTargetForElements({
			element: listElement,
			canDrop: ({ source }) => isColumnDragData(source.data),
			getData: () => ({
				type: COLUMN_DROP_TARGET_TYPE,
				columnId: undefined,
				index: columns.length,
			}),
			getDropEffect: () => 'move',
		});
	}, [columns.length, listElement]);

	useEffect(() => {
		const cleanup = monitorForElements({
			canMonitor: ({ source }) =>
				isCardDragData(source.data) || isColumnDragData(source.data),
			onDrop: ({ source, location }) => {
				if (isCardDragData(source.data)) {
					handleCardDrop(source.data, location.current.dropTargets);
					return;
				}
				if (isColumnDragData(source.data)) {
					handleColumnDrop(source.data, location.current.dropTargets);
				}
			},
		});
		return cleanup;
	}, [handleCardDrop, handleColumnDrop]);

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
				<div className={classes.list} ref={setListElement}>
					<InnerColumnList
						getColumnClassName={getColumnClassName}
						styles={styles}
						renderColumnActions={renderColumnActions}
						renderColumnName={renderColumnName}
						columns={columns}
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
