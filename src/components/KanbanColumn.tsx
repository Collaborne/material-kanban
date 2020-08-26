import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { Droppable } from 'react-beautiful-dnd';

import * as Data from '../data';

import { AddCardButton } from './AddCardButton';
import { ColumnHeader } from './ColumnHeader';
import { KanbanCard } from './KanbanCard';

interface Props {
	column: Data.Column;
	isDragging: boolean;
	index: number;

	onNameChanged?: (name: string) => void;

	onAddCard?: () => void;
	onOpenCard?: (card: Data.Card) => void;

	children: (card: Data.Card) => React.ReactNode;

	/**
	 * Render a button or similar control that provides additional per-column actions.
	 */
	renderActions?: () => React.ReactNode;
}

interface InnerObjectsListProps {
	cards: Data.Card[];

	onClick?: (card: Data.Card) => void;

	children: (card: Data.Card) => React.ReactNode;
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
	draggingOver: {
		backgroundColor: theme.palette.secondary.main,
	},
	object: {
		marginBottom: theme.spacing(1),
	},
	list: {
		flexGrow: 1,
		overflowY: 'auto',
		padding: theme.spacing(0, 1, 1, 1),
	},
}));

const InnerObjectsList = React.memo(
	({ cards, onClick: handleClick, children }: InnerObjectsListProps) => {
		const classes = useStyles();

		return (
			<>
				{cards.map((card, index) => (
					<KanbanCard
						key={card.id}
						card={card}
						index={index}
						className={classes.object}
						onClick={handleClick ? () => handleClick(card) : undefined}
					>
						{children}
					</KanbanCard>
				))}
			</>
		);
	},
);

export function KanbanColumn({
	column,
	onAddCard: handleAddCard,
	onOpenCard: handleClick,

	onNameChanged,

	renderActions,
	children,
}: Props) {
	const classes = useStyles();

	function handleNameChange(newName: string) {
		column.name = newName;

		if (onNameChanged) {
			onNameChanged(newName);
		}
	}

	return (
		<Droppable droppableId={column.id} type="card">
			{(provided, snapshot) => (
				<Paper
					{...provided.droppableProps}
					elevation={0}
					innerRef={provided.innerRef}
					className={clsx(classes.paper, {
						[classes.draggingOver]: snapshot.isDraggingOver,
					})}
				>
					<ColumnHeader
						name={column.name}
						onNameChanged={handleNameChange}
						renderActions={renderActions}
					/>

					<List className={classes.list}>
						<InnerObjectsList cards={column.cards} onClick={handleClick}>
							{children}
						</InnerObjectsList>
						{provided.placeholder}
						<AddCardButton onClick={handleAddCard} />
					</List>
				</Paper>
			)}
		</Droppable>
	);
}
