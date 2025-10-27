import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useCallback, useEffect, useState } from 'react';

import {
	COLUMN_DRAG_TYPE,
	COLUMN_DROP_TARGET_TYPE,
} from '../drag-and-drop/column';

interface UseColumnDragAndDropArgs {
	columnId: string;
	index: number;
	isDragDisabled?: boolean;
}

export function useColumnDragAndDrop({
	columnId,
	index,
	isDragDisabled,
}: UseColumnDragAndDropArgs) {
	const [element, setElement] = useState<HTMLElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const registerElement = useCallback((node: HTMLElement | null) => {
		setElement(node);
	}, []);

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
				return {
					type: COLUMN_DROP_TARGET_TYPE,
					columnId,
					index: isAfter ? index + 1 : index,
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
			canDrag: () => !isDragDisabled,
			getInitialData: () => ({
				type: COLUMN_DRAG_TYPE,
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
	}, [columnId, element, index, isDragDisabled]);

	return {
		registerElement,
		isDragging,
	};
}
