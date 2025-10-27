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
