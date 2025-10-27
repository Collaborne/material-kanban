import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
	HTMLAttributes,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';

import * as Data from '../data';
import { CARD_DRAG_TYPE, CARD_DROP_TARGET_TYPE } from '../drag-and-drop/card';

export interface DraggableProvided {
	draggableProps: HTMLAttributes<HTMLElement> & {
		ref?: (element: HTMLElement | null) => void;
	};
	dragHandleProps: HTMLAttributes<HTMLElement> & {
		ref?: (element: HTMLElement | null) => void;
	};
	innerRef: (element: HTMLElement | null) => void;
}

export interface DraggableStateSnapshot {
	isDragging: boolean;
}

interface UseCardDragAndDropArgs<TCard extends Data.Card> {
	card: TCard;
	columnId: string;
	index: number;
	isDragDisabled?: boolean;
}

export function useCardDragAndDrop<TCard extends Data.Card>({
	card,
	columnId,
	index,
	isDragDisabled,
}: UseCardDragAndDropArgs<TCard>) {
	const [element, setElement] = useState<HTMLElement | null>(null);
	const [dragHandle, setDragHandle] = useState<HTMLElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const setElementRef = useCallback((node: HTMLElement | null) => {
		setElement(node);
	}, []);

	const setDragHandleRef = useCallback((node: HTMLElement | null) => {
		setDragHandle(node);
	}, []);

	useEffect(() => {
		if (!element) {
			return;
		}
		return dropTargetForElements({
			element,
			canDrop: ({ source }) => Boolean(source.data.type === CARD_DRAG_TYPE),
			getData: ({ input }) => {
				const rect = element.getBoundingClientRect();
				const isAfter = input.clientY >= rect.top + rect.height / 2;
				const targetIndex = isAfter ? index + 1 : index;
				return {
					type: CARD_DROP_TARGET_TYPE,
					columnId,
					index: targetIndex,
				};
			},
			getDropEffect: () => 'move',
		});
	}, [columnId, element, index]);

	useEffect(() => {
		if (!element || isDragDisabled) {
			if (element) {
				element.removeAttribute('draggable');
			}
			setIsDragging(false);
			return;
		}
		return draggable({
			element,
			dragHandle: dragHandle ?? undefined,
			canDrag: () => !isDragDisabled,
			getInitialData: () => ({
				type: CARD_DRAG_TYPE,
				cardId: card.id,
				columnId,
				index,
			}),
			onDragStart: () => {
				setIsDragging(true);
			},
			onDrop: () => {
				setIsDragging(false);
			},
		});
	}, [card.id, columnId, dragHandle, element, index, isDragDisabled]);

	const provided = useMemo<DraggableProvided>(
		() => ({
			draggableProps: {
				ref: setElementRef,
			},
			dragHandleProps: {
				ref: setDragHandleRef,
			},
			innerRef: setElementRef,
		}),
		[setDragHandleRef, setElementRef],
	);

	const snapshot = useMemo<DraggableStateSnapshot>(
		() => ({
			isDragging,
		}),
		[isDragging],
	);

	return {
		provided,
		snapshot,
	};
}
