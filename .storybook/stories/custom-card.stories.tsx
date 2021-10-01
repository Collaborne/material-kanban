import { DraggableProvided } from 'react-beautiful-dnd';

import { Board, Card } from '../../src';

import { withDescription } from '../utils';
import { useColumns, COLUMNS } from './utils/columns';
import { withTheme } from './utils/with-theme';

export default {
	title: 'Customization / Custom Card',
	component: Board,
	decorators: [withTheme],
};

interface AsciiArtCardProps {
	card: Card;
	provided: DraggableProvided;
}
function AsciiArtCard({ card, provided }: AsciiArtCardProps) {
	return (
		<button
			{...provided.dragHandleProps}
			{...provided.draggableProps}
			ref={provided.innerRef}
			onClick={() => window.alert('Clicked')}
		>
			+--------------------------------+
			<br />| {card.id} |<br />
			+--------------------------------+
		</button>
	);
}

function CustomCardStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
		>
			{(card, provided) => <AsciiArtCard card={card} provided={provided} />}
		</Board>
	);
}

export const CustomCard = withDescription(
	'Card renderer can be changed',
	() => <CustomCardStory />,
);
