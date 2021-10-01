import * as React from 'react';

import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import {
	Draggable,
	DraggableProvided,
	DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import * as Data from '../data';

export type RenderCard<TCard extends Data.Card> = (
	card: TCard,
	provided: DraggableProvided,
	snapshot: DraggableStateSnapshot,
) => React.ReactElement<HTMLElement>;

interface Props<TCard extends Data.Card = Data.Card> {
	card: TCard;
	index: number;
	className?: string;

	isDragDisabled?: boolean;

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
			ref={provided.innerRef}
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
	isDragDisabled,
	children = (card, provided) => (
		<DefaultCard card={card} provided={provided} />
	),
}: Props<TCard>): JSX.Element {
	return (
		<Draggable
			draggableId={card.id}
			index={index}
			disableInteractiveElementBlocking
			isDragDisabled={isDragDisabled}
		>
			{(provided, snapshot) => children(card, provided, snapshot) || <div />}
		</Draggable>
	);
}
