/* eslint-disable max-lines */
import {
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useCallback, useEffect, useMemo, useState } from 'react';

import * as Data from '../data';
import {
	CARD_DRAG_TYPE,
	CARD_DROP_TARGET_TYPE,
	CARD_LIST_DROP_TARGET_TYPE,
	type CardDragData,
	type CardDropTargetData,
	type CardListDropTargetData,
} from '../drag-and-drop/card';
import {
	COLUMN_DRAG_TYPE,
	COLUMN_DROP_TARGET_TYPE,
	type ColumnDragData,
	type ColumnDropTargetData,
} from '../drag-and-drop/column';

export type CardDropIndicator = Pick<CardDropTargetData, 'columnId' | 'index'>;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isCardDragData(value: unknown): value is CardDragData {
	return (
		isRecord(value) &&
		value.type === CARD_DRAG_TYPE &&
		typeof value.cardId === 'string' &&
		typeof value.columnId === 'string' &&
		typeof value.index === 'number'
	);
}

function isColumnDragData(value: unknown): value is ColumnDragData {
	return (
		isRecord(value) &&
		value.type === COLUMN_DRAG_TYPE &&
		typeof value.columnId === 'string' &&
		typeof value.index === 'number'
	);
}

function isCardDropTargetData(value: unknown): value is CardDropTargetData {
	return (
		isRecord(value) &&
		value.type === CARD_DROP_TARGET_TYPE &&
		typeof value.columnId === 'string' &&
		typeof value.index === 'number'
	);
}

function isCardListDropTargetData(
	value: unknown,
): value is CardListDropTargetData {
	return (
		isRecord(value) &&
		value.type === CARD_LIST_DROP_TARGET_TYPE &&
		typeof value.columnId === 'string' &&
		typeof value.index === 'number'
	);
}

function isColumnDropTargetData(value: unknown): value is ColumnDropTargetData {
	return (
		isRecord(value) &&
		value.type === COLUMN_DROP_TARGET_TYPE &&
		typeof value.index === 'number'
	);
}

interface UseBoardDragAndDropArgs<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card,
> {
	columns: readonly TColumn[];
	moveCard: (cardId: string, columnId: string, index: number) => void;
	moveColumn: (columnId: string, index: number) => void;
	isColumnMoveAllowed?: (args: {
		columnId: string;
		sourceIndex: number;
		destinationIndex: number;
	}) => boolean;
}

export function useBoardDragAndDrop<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card,
>({
	columns,
	moveCard,
	moveColumn,
	isColumnMoveAllowed,
}: UseBoardDragAndDropArgs<TColumn, TCard>) {
	const [listElement, setListElement] = useState<HTMLDivElement | null>(null);
	const [columnDropIndicatorIndex, setColumnDropIndicatorIndex] = useState<
		number | null
	>(null);
	const [cardDropIndicator, setCardDropIndicator] =
		useState<CardDropIndicator | null>(null);

	const setListRef = useCallback((node: HTMLDivElement | null) => {
		setListElement(node);
	}, []);

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
			if (destinationIndex > source.index) {
				destinationIndex -= 1;
			}
			if (destinationIndex === source.index) {
				return;
			}
			if (destinationIndex < 0) {
				return;
			}
			if (
				!isColumnMoveAllowed?.({
					columnId: source.columnId,
					sourceIndex: source.index,
					destinationIndex,
				})
			) {
				return;
			}
			moveColumn(source.columnId, destinationIndex);
		},
		[isColumnMoveAllowed, moveColumn],
	);

	const updateCardDropIndicator = useCallback(
		(source: CardDragData, dropTargets: Array<{ data: unknown }>) => {
			setColumnDropIndicatorIndex(null);
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
			if (!targetData || !targetData.columnId) {
				setCardDropIndicator(null);
				return;
			}
			const isSameColumn = targetData.columnId === source.columnId;
			let destinationIndex = targetData.index;
			if (isSameColumn && destinationIndex > source.index) {
				destinationIndex -= 1;
			}
			if (isSameColumn && destinationIndex === source.index) {
				setCardDropIndicator(null);
				return;
			}
			setCardDropIndicator(previous => {
				if (
					previous &&
					previous.columnId === targetData.columnId &&
					previous.index === targetData.index
				) {
					return previous;
				}
				return {
					columnId: targetData.columnId,
					index: targetData.index,
				};
			});
		},
		[],
	);

	const updateColumnDropIndicator = useCallback(
		(source: ColumnDragData, dropTargets: Array<{ data: unknown }>) => {
			setCardDropIndicator(null);
			const columnTarget = dropTargets.find(target =>
				isColumnDropTargetData(target.data),
			);
			if (!columnTarget) {
				setColumnDropIndicatorIndex(null);
				return;
			}
			const targetData = columnTarget.data as ColumnDropTargetData;
			let destinationIndex = targetData.index;
			if (destinationIndex > source.index) {
				destinationIndex -= 1;
			}
			if (destinationIndex < 0) {
				setColumnDropIndicatorIndex(null);
				return;
			}
			if (destinationIndex === source.index) {
				setColumnDropIndicatorIndex(null);
				return;
			}
			if (
				!isColumnMoveAllowed?.({
					columnId: source.columnId,
					sourceIndex: source.index,
					destinationIndex,
				})
			) {
				setColumnDropIndicatorIndex(null);
				return;
			}
			setColumnDropIndicatorIndex(previous =>
				previous === targetData.index ? previous : targetData.index,
			);
		},
		[isColumnMoveAllowed],
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
			onDragStart: ({ source, location }) => {
				if (isCardDragData(source.data)) {
					updateCardDropIndicator(source.data, location.current.dropTargets);
					return;
				}
				if (isColumnDragData(source.data)) {
					updateColumnDropIndicator(source.data, location.current.dropTargets);
				}
			},
			onDrag: ({ source, location }) => {
				if (isCardDragData(source.data)) {
					updateCardDropIndicator(source.data, location.current.dropTargets);
					return;
				}
				if (isColumnDragData(source.data)) {
					updateColumnDropIndicator(source.data, location.current.dropTargets);
				}
			},
			onDropTargetChange: ({ source, location }) => {
				if (isCardDragData(source.data)) {
					updateCardDropIndicator(source.data, location.current.dropTargets);
					return;
				}
				if (isColumnDragData(source.data)) {
					updateColumnDropIndicator(source.data, location.current.dropTargets);
				}
			},
			onDrop: ({ source, location }) => {
				if (isCardDragData(source.data)) {
					handleCardDrop(source.data, location.current.dropTargets);
				} else if (isColumnDragData(source.data)) {
					handleColumnDrop(source.data, location.current.dropTargets);
				}
				setCardDropIndicator(null);
				setColumnDropIndicatorIndex(null);
			},
		});
		return cleanup;
	}, [
		handleCardDrop,
		handleColumnDrop,
		updateCardDropIndicator,
		updateColumnDropIndicator,
	]);

	return useMemo(
		() => ({
			columnDropIndicatorIndex,
			cardDropIndicator,
			setListRef,
		}),
		[columnDropIndicatorIndex, cardDropIndicator, setListRef],
	);
}
