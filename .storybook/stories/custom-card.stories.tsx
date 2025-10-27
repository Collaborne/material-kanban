import { Board, Card } from '../../src';
import { DraggableProvided } from '../../src/hooks/useCardDragAndDrop';

import { useColumns, COLUMNS } from './utils/columns';

export default {
	title: 'Customization / Custom Card',
	component: Board,
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

export const CustomCard = () => <CustomCardStory />;
