import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import clsx from 'clsx';
import { Draggable } from 'react-beautiful-dnd';

import * as Data from '../data';

interface Props<TCard extends Data.Card = Data.Card> {
	card: TCard;
	index: number;
	className?: string;
	onClick?: () => void;

	children: (item: TCard) => React.ReactNode;
}

const useStyles = makeStyles(() => ({
	card: {
		cursor: 'pointer!important',
		position: 'relative',
	},
}));

export function KanbanCard<TCard extends Data.Card = Data.Card>({
	card,
	index,
	className,
	onClick: handleClick,
	children,
}: Props<TCard>) {
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
					onClick={handleClick}
				>
					<CardContent>{children(card)}</CardContent>
				</Card>
			)}
		</Draggable>
	);
}
