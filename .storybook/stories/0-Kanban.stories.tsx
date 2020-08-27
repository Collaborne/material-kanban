import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';

import { Board, Card, Column, Intl } from '../../src';

export default {
	title: 'Kanban',
	component: Board,
	decorators: [],
};

const COLUMNS: Column[] = [
	{ id: 'column1', name: 'Column 1', cards: [ { id: 'card_1_1' } ] },
	{ id: 'column2', name: 'Column 2', cards: [] },
];

function useColumns(initialColumns: Column[]): [Column[], React.Dispatch<React.SetStateAction<Column[]>>, () => Promise<Column>, (column: Column) => Promise<Card>] {
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

export const Basic = () => {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

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
};
Basic.parameters = {
	docs: {
		description: {
			story: 'The Kanban board provides columns and cards that can be dragged around',
		},
	},
};

export const ReadOnly = () => {
	const [columns, setColumns] = useColumns(COLUMNS);

	return (
		<Board
			columns={columns}
			onChange={setColumns}
		>
			{card => (
				<Typography variant="body1" component="div">
					{card.id}
				</Typography>
			)}
		</Board>
	);
};
ReadOnly.parameters = {
	docs: {
		description: {
			story: 'By not providing the `createColumn` and/or `createCard` parameters the board no longer allows creating columns and cards, respectively.',
		},
	},
};

export const I18n = () => {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	const intl: Intl = {
		addCardButtonLabel: 'Neue Karte',
		addColumnButtonLabel: 'Neue Spalte',
		columnNamePlaceholder: 'Namenlos',
	};
	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			intl={intl}
		>
			{card => (
				<Typography variant="body1" component="div">
					{card.id}
				</Typography>
			)}
		</Board>
	);
}
I18n.parameters = {
	docs: {
		description: {
			story: 'The `intl` parameter can be used to configure the texts in the board controls',
		},
	},
};
I18n.storyName = 'I18n';

export const GenericData = () => {
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
			{card => (
				<Typography variant="body1" component="div">
					{card.id}: {card.index}
				</Typography>
			)}
		</Board>
	)

};
GenericData.parameters = {
	docs: {
		description: {
			story: 'The board handles generic data types and provides the correctly typed "card" in the render prop',
		},
	},
};
