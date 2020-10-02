import React, { useState } from 'react';
import MaterialCard from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { Board, Card } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { DraggableProvided } from 'react-beautiful-dnd';

function AsciiArtCard({ card, provided }: { card: Card; provided: DraggableProvided}) {
	return (
		<div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
			+--------------------------------+<br />
			| {card.id} |<br />
			+--------------------------------+<br />
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
