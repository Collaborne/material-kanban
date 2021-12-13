import { useCallback, ReactNode } from 'react';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import clsx from 'clsx';
import { Droppable } from 'react-beautiful-dnd';

import * as Data from '../data';

import { AddCardButton, AddCardButtonStyles } from './AddCardButton';
import {
	ColumnHeader,
	ColumnHeaderProps,
	ColumnHeaderStyles,
} from './ColumnHeader';
import { KanbanCard, RenderCard } from './KanbanCard';

export interface KanbanColumnStyles
	extends AddCardButtonStyles,
		ColumnHeaderStyles {
	column?: string;
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

	/**
	 * Render name of a column
	 */
	renderColumnName?: (colum: TColumn) => ReactNode;

	/**
	 * Render a button or similar control that provides additional per-column actions.
	 */
	renderColumnActions?: (colum: TColumn) => ReactNode;

	/**
	 * Allows clients to style columns
	 *
	 * @param colum To be styled column
	 *
	 * @returns Name of the CSS class that should be attached to the column. Return
	 * 	`undefined` to keep standard styling
	 */
	getColumnClassName?: (colum: TColumn) => string | undefined;
}

interface InnerObjectsListProps<TCard extends Data.Card = Data.Card> {
	cards: TCard[];

	isDragDisabled?: boolean;

	children?: RenderCard<TCard>;
}

const useStyles = makeStyles(theme => ({
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
		overflowY: 'auto',
		padding: theme.spacing(0.5, 1 / 8, 1, 1 / 8),
	},
}));

function InnerObjectsList<TCard extends Data.Card = Data.Card>({
	cards,
	isDragDisabled,
	children,
}: InnerObjectsListProps<TCard>) {
	return (
		<>
			{cards.map((card, index) => (
				<KanbanCard
					key={card.id}
					card={card}
					index={index}
					isDragDisabled={isDragDisabled}
				>
					{children}
				</KanbanCard>
			))}
		</>
	);
}

export function KanbanColumn<
	TColumn extends Data.Column<TCard>,
	TCard extends Data.Card = Data.Card,
>({
	column,
	onAddCard: handleAddCard,

	renderColumnActions,
	renderColumnName,
	getColumnClassName,

	isCardDragDisabled,

	children,
	...props
}: KanbanColumnProps<TColumn, TCard>): JSX.Element {
	const classes = useStyles();

	const renderName = useCallback(
		() => (renderColumnName ? renderColumnName(column) : undefined),
		[renderColumnName, column],
	);
	const renderActions = useCallback(
		() => (renderColumnActions ? renderColumnActions(column) : undefined),
		[renderColumnActions, column],
	);

	return (
		<Paper
			elevation={0}
			className={clsx(
				classes.paper,
				props.styles?.column,
				getColumnClassName ? getColumnClassName(column) : undefined,
			)}
		>
			<Droppable droppableId={column.id} type="card">
				{provided => (
					<>
						<ColumnHeader
							column={column}
							renderName={renderName}
							renderActions={renderActions}
						/>

						<List className={classes.list}>
							<div {...provided.droppableProps} ref={provided.innerRef}>
								<InnerObjectsList
									cards={column.cards}
									isDragDisabled={isCardDragDisabled}
								>
									{children}
								</InnerObjectsList>
								{provided.placeholder}
								{handleAddCard && (
									<AddCardButton
										onClick={handleAddCard}
										styles={props.styles}
									/>
								)}
							</div>
						</List>
					</>
				)}
			</Droppable>
		</Paper>
	);
}
