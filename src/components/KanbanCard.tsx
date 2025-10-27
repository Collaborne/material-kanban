import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
	HTMLAttributes,
	ReactElement,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { makeStyles } from 'tss-react/mui';

import * as Data from '../data';

export const CARD_DRAG_TYPE = 'card' as const;
export const CARD_DROP_TARGET_TYPE = 'card-position' as const;
export const CARD_LIST_DROP_TARGET_TYPE = 'card-list' as const;

export interface CardDragData {
	type: typeof CARD_DRAG_TYPE;
	cardId: string;
	columnId: string;
	index: number;
}

export interface CardDropTargetData {
	type: typeof CARD_DROP_TARGET_TYPE;
	columnId: string;
	index: number;
}

export interface CardListDropTargetData {
	type: typeof CARD_LIST_DROP_TARGET_TYPE;
	columnId: string;
	index: number;
}

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

export type RenderCard<TCard extends Data.Card> = (
	card: TCard,
	provided: DraggableProvided,
	snapshot: DraggableStateSnapshot,
) => ReactElement<HTMLElement>;

interface Props<TCard extends Data.Card = Data.Card> {
	card: TCard;
	index: number;
	columnId: string;
	className?: string;

	isDragDisabled?: boolean;

	children?: RenderCard<TCard>;
}

const useStyles = makeStyles()(() => ({
	card: {
		cursor: 'pointer!important',
		position: 'relative',
	},
}));

interface DefaultCardProps<TCard extends Data.Card> {
	card: TCard;
	provided: DraggableProvided;
}
function DefaultCard<TCard extends Data.Card>({
	card,
	provided,
}: DefaultCardProps<TCard>) {
	const { classes } = useStyles();

	return (
		<Card
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			ref={provided.innerRef}
			className={classes.card}
			variant="outlined"
		>
			<CardContent>{card.id}</CardContent>
		</Card>
	);
}

function KanbanCardFunc<TCard extends Data.Card = Data.Card>({
	card,
	index,
	columnId,
	isDragDisabled,
	children = (card, provided) => (
		<DefaultCard card={card} provided={provided} />
	),
}: Props<TCard>) {
	const [element, setElement] = useState<HTMLElement | null>(null);
	const [dragHandle, setDragHandle] = useState<HTMLElement | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const setElementRef = useCallback((node: HTMLElement | null) => {
		setElement(node);
	}, []);

	const setDragHandleRef = useCallback((node: HTMLElement | null) => {
		setDragHandle(node);
	}, []);

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
		[setElementRef, setDragHandleRef],
	);

	const snapshot = useMemo<DraggableStateSnapshot>(
		() => ({
			isDragging,
		}),
		[isDragging],
	);

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
				const data = {
					type: CARD_DROP_TARGET_TYPE,
					columnId,
					index: targetIndex,
				};
				return data;
			},
			getDropEffect: () => 'move',
		});
	}, [element, columnId, index]);

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

	const rendered = children(card, provided, snapshot);

	return rendered || <div />;
}

const typedMemo: <T>(c: T) => T = memo;
export const KanbanCard = typedMemo(KanbanCardFunc);
