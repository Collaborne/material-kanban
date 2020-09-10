import React, { useState } from 'react';

import { Card, Column } from '../../src';

export const COLUMNS: Column[] = [
	{ id: 'column1', name: 'Column 1', cards: [ { id: 'card_column1_1' } ] },
	{ id: 'column2', name: 'Column 2', cards: [] },
];

type Response = [
	Column[],
	React.Dispatch<React.SetStateAction<Column[]>>,
	() => Promise<Column>,
	(column: Column) => Promise<Card>,
];
export function useColumns(initialColumns: Column[]): Response {
	const [columns, setColumns] = useState(initialColumns);

	async function createColumn() {
		const index = columns.length + 1;
		return { id: `column${index}`, cards: [] };
	}

	async function createCard(column: Column) {
		return { id: `card_${column.id}_${column.cards.length + 1}`};
	}

	return [columns, setColumns, createColumn, createCard];
}
