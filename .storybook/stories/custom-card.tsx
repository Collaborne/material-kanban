import { Board, Card } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { DraggableProvided } from 'react-beautiful-dnd';

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

export function CustomCardStory() {
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
