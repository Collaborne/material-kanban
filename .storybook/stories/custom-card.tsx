import React from 'react';

import { Board, Card } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { DraggableProvided } from 'react-beautiful-dnd';

interface AsciiArtCardProps {
	card: Card;
	provided: DraggableProvided;
}
function AsciiArtCard({ card, provided }: AsciiArtCardProps) {
	return (
		<div
			{...provided.dragHandleProps}
			{...provided.draggableProps}
			ref={provided.innerRef}
		>
			+--------------------------------+
			<br />| {card.id} |<br />
			+--------------------------------+
		</div>
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
