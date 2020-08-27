import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';

import { Board, Column } from '../../src';

export default {
	title: 'Kanban',
	component: Board,
	decorators: [],
};

const COLUMNS: Column[] = [
	{ id: 'column1', name: 'Column 1', cards: [ { id: 'card_1_1' } ] },
	{ id: 'column2', name: 'Column 2', cards: [] },
];

export const Basic = () => {
	const [columns, setColumns] = useState(COLUMNS);

	async function createColumn() {
		const index = columns.length + 1;
		return { id: `column${index}`, name: `Column ${index}`, cards: [] };
	}

	async function createCard(column: Column) {
		return { id: `item_${column.id}_${column.cards.length + 1}`};
	}

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
		>
			{card => (
				<Typography variant="body1" component="div">
					{card.id}
				</Typography>
			)}
		</Board>
	);
}
