import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';

import * as Data from '../data';

import { AddCardButton, AddCardButtonStyles } from './AddCardButton';
import {
	ColumnHeader,
	ColumnHeaderProps,
	ColumnHeaderStyles,
} from './ColumnHeader';
import {
	CARD_DRAG_TYPE,
	CARD_LIST_DROP_TARGET_TYPE,
	KanbanCard,
	RenderCard,
} from './KanbanCard';

export interface KanbanColumnStyles
	extends AddCardButtonStyles,
		ColumnHeaderStyles {
	column?: string;
	columnCards?: string;
}

export interface KanbanColumnProps<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
> extends ColumnHeaderProps<TColumn, TCard> {
	column: TColumn;
	isDragging: boolean;
	index: number;

	styles?: KanbanColumnStyles;

	onAddCard?: () => void;

	children?: RenderCard<TCard>;

	isCardDragDisabled?: boolean;

	cardDropIndicatorIndex?: number | null;

	renderColumnName?: (colum: TColumn) => ReactNode;
	renderColumnActions?: (colum: TColumn) => ReactNode;
	getColumnClassName?: (colum: TColumn) => string | undefined;
}

interface InnerObjectsListProps<TCard extends Data.Card = Data.Card> {
	columnId: string;
	cards: readonly TCard[];
	isDragDisabled?: boolean;
	dropIndicatorIndex?: number | null;
	children?: RenderCard<TCard>;
}

const useStyles = makeStyles()(theme => ({
	paper: {
		width: '240px',
		height: '100%',
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
	},
	list: {
		flexGrow: 1,
		padding: theme.spacing(0.5, 1 / 8, 1, 1 / 8),
	},
	cardDropIndicator: {
		borderRadius: theme.shape.borderRadius,
		height: theme.spacing(0.25),
		margin: theme.spacing(0.5, 1 / 8),
		pointerEvents: 'none',
	},
	visibleIndicator: {
		backgroundColor: theme.palette.primary.main,
	},
}));

function DropZoneIndicator(props: { visible: boolean }) {
	const { classes, cx } = useStyles();

	return (
		<div
			aria-hidden="true"
			className={cx(classes.cardDropIndicator, {
				[classes.visibleIndicator]: props.visible,
			})}
		/>
	);
}

function InnerObjectsList<TCard extends Data.Card = Data.Card>({
	columnId,
	cards,
	isDragDisabled,
	dropIndicatorIndex,
	children,
}: InnerObjectsListProps<TCard>) {
	return (
		<>
			{cards.map((card, index) => (
				<Fragment key={card.id}>
					<DropZoneIndicator visible={dropIndicatorIndex === index} />
					<KanbanCard
						card={card}
						index={index}
						columnId={columnId}
						isDragDisabled={isDragDisabled}
					>
						{children}
					</KanbanCard>
				</Fragment>
			))}
			<DropZoneIndicator visible={dropIndicatorIndex === cards.length} />
		</>
	);
}

export function KanbanColumn<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
>({
	column,
	onAddCard: handleAddCard,
	isDragging: _isDragging,
	renderColumnActions,
	renderColumnName,
	getColumnClassName,
	isCardDragDisabled,
	cardDropIndicatorIndex,
	children,
	...props
}: KanbanColumnProps<TColumn, TCard>) {
	const { classes, cx } = useStyles();
	const [listElement, setListElement] = useState<HTMLElement | null>(null);

	void _isDragging;

	const renderName = useCallback(
		() => (renderColumnName ? renderColumnName(column) : undefined),
		[renderColumnName, column],
	);
	const renderActions = useCallback(
		() => (renderColumnActions ? renderColumnActions(column) : undefined),
		[renderColumnActions, column],
	);

	useEffect(() => {
		if (!listElement) {
			return;
		}
		return dropTargetForElements({
			element: listElement,
			canDrop: ({ source }) => Boolean(source.data.type === CARD_DRAG_TYPE),
			getData: () => ({
				type: CARD_LIST_DROP_TARGET_TYPE,
				columnId: column.id,
				index: column.cards.length,
			}),
			getDropEffect: () => 'move',
		});
	}, [column.cards.length, column.id, listElement]);

	const listRef = useCallback((node: HTMLElement | null) => {
		setListElement(node);
	}, []);

	return (
		<Paper
			elevation={0}
			className={cx(
				classes.paper,
				props.styles?.column,
				getColumnClassName ? getColumnClassName(column) : undefined,
			)}
		>
			<ColumnHeader
				column={column}
				styles={props.styles}
				renderName={renderName}
				renderActions={renderActions}
			/>

			<List
				className={cx(classes.list, props.styles?.columnCards)}
				ref={listRef}
			>
				<InnerObjectsList
					columnId={column.id}
					cards={column.cards}
					isDragDisabled={isCardDragDisabled}
					dropIndicatorIndex={cardDropIndicatorIndex ?? undefined}
				>
					{children}
				</InnerObjectsList>
				{handleAddCard && (
					<AddCardButton onClick={handleAddCard} styles={props.styles} />
				)}
			</List>
		</Paper>
	);
}
