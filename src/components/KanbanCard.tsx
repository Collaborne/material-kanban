import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ReactElement, memo } from 'react';
import { makeStyles } from 'tss-react/mui';

import * as Data from '../data';
import {
	DraggableProvided,
	DraggableStateSnapshot,
	useCardDragAndDrop,
} from '../hooks/useCardDragAndDrop';

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

const useStyles = makeStyles()({
	card: {
		cursor: 'pointer!important',
		position: 'relative',
	},
});

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
	const { provided, snapshot } = useCardDragAndDrop({
		card,
		columnId,
		index,
		isDragDisabled,
	});

	const rendered = children(card, provided, snapshot);

	return rendered || <div />;
}

const typedMemo: <T>(c: T) => T = memo;
export const KanbanCard = typedMemo(KanbanCardFunc);
