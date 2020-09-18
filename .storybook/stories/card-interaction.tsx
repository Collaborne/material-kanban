import React from 'react';
import { action } from '@storybook/addon-actions';

import { Board, Card, Column } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { SimpleCard } from './utils/card';

export function CardInteractionStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	const cardClicked = action('card clicked');

	function handleClick(card: Card, column: Column) {
		cardClicked(`card ${card.id} in column ${column.id}`, { card, column });
	}

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			onCardClicked={handleClick}
		>
			{card => <SimpleCard card={card} />}
		</Board>
	);
}
