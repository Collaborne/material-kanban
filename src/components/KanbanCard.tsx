import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { Draggable, DraggableProvided } from 'react-beautiful-dnd';

import * as Data from '../data';

export type RenderCard<TCard extends Data.Card> = (
	card: TCard,
	provided: DraggableProvided,
) => React.ReactElement<HTMLElement>;

interface Props<TCard extends Data.Card = Data.Card> {
	card: TCard;
	index: number;
	className?: string;

	children?: RenderCard<TCard>;
}

const useStyles = makeStyles(theme => ({
	card: {
		cursor: 'pointer!important',
		position: 'relative',
		marginBottom: theme.spacing(1),
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
	const classes = useStyles();

	return (
		<Card
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			innerRef={provided.innerRef}
			className={classes.card}
			variant="outlined"
		>
			<CardContent>{card.id}</CardContent>
		</Card>
	);
}

export function KanbanCard<TCard extends Data.Card = Data.Card>({
	card,
	index,
	children = (card, provided) => (
		<DefaultCard card={card} provided={provided} />
	),
}: Props<TCard>) {
	return (
		<Draggable
			draggableId={card.id}
			index={index}
			disableInteractiveElementBlocking
		>
			{provided => children(card, provided) || <div />}
		</Draggable>
	);
}
