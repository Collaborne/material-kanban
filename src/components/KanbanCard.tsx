import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import clsx from 'clsx';
import { Draggable } from 'react-beautiful-dnd';

import * as Data from '../data';

interface Props {
	card: Data.Card;
	index: number;
	className?: string;
	onClick?: () => void;

	children: (item: Data.Card) => React.ReactNode;
}

const useStyles = makeStyles(() => ({
	card: {
		cursor: 'pointer!important',
		position: 'relative',
	},
}));

export function KanbanCard({
	card,
	index,
	className,
	onClick,
	children,
}: Props) {
	const classes = useStyles();

	return (
		<Draggable draggableId={card.id} index={index}>
			{provided => (
				<Card
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					innerRef={provided.innerRef}
					className={clsx(classes.card, className)}
					variant="outlined"
					onClick={onClick}
				>
					<CardContent>{children(card)}</CardContent>
				</Card>
			)}
		</Draggable>
	);
}
