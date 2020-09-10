import React from 'react';
import { action } from '@storybook/addon-actions';

import { Board, Card, Column } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { SimpleCard } from './utils/card';

export function BasicStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	const columnMoved = action('column moved');
	function handleColumnMove(column: Column, newIndex: number, oldIndex: number) {
		columnMoved(`${column.id} from ${oldIndex} to ${newIndex}`, {column});
	}
	const cardMoved = action('card moved');
	function handleCardMove(card: Card, newColumn: Column, newIndex: number, oldColumn: Column, oldIndex: number) {
		cardMoved(`${card.id} from ${oldColumn.id} position ${oldIndex} to ${newColumn.id} position ${newIndex}`, {card, oldColumn, newColumn});
	}

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			onCardMoved={handleCardMove}
			onColumnMoved={handleColumnMove}
		>
			{card => <SimpleCard card={card}/>}
		</Board>
	);
}
