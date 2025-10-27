export const COLUMN_DRAG_TYPE = 'column' as const;
export const COLUMN_DROP_TARGET_TYPE = 'column-position' as const;

export interface ColumnDragData {
	type: typeof COLUMN_DRAG_TYPE;
	columnId: string;
	index: number;
}

export interface ColumnDropTargetData {
	type: typeof COLUMN_DROP_TARGET_TYPE;
	columnId?: string;
	index: number;
}
