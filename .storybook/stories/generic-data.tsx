import React, { useState } from 'react';

import { Board, Card, Column } from '../../src';

import { COLUMNS } from './utils/columns';
import { SimpleCard } from './utils/card';

export function GenericDataStory() {
	interface MyCard extends Card {
		index: number;
	}
	interface MyColumn extends Column<MyCard> {
		index: number;
	}
	const myInitialColumns: MyColumn[] = COLUMNS.map((column, index) => {
		return {
			...column,
			index: index + 1,
			cards: column.cards.map((card, index) => ({
				...card,
				index: index + 1,
			})),
		};
	});

	const [myColumns, setMyColumns] = useState(myInitialColumns);

	async function createMyColumn() {
		const index = myColumns.length + 1;
		return { id: `column${index}`, cards: [], index };
	}

	async function createMyCard(column: MyColumn) {
		const index = column.cards.length + 1;
		return { id: `card_${column.id}_${index}`, index };
	}

	return (
		<Board
			columns={myColumns}
			onChange={setMyColumns}
			createColumn={createMyColumn}
			createCard={createMyCard}
		>
			{card => <SimpleCard card={card}>{card => `${card.id}: ${card.index}`}</SimpleCard>}
		</Board>
	);
}
