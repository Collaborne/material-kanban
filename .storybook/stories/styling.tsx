import React from 'react';
import { makeStyles } from '@material-ui/core';

import { Board, Column } from '../../src';

import { useColumns } from './utils/columns';
import { SimpleCard } from './utils/card';

interface ColoredColumn extends Column {
	color?: string;
}

const COLUMNS: ColoredColumn[] = [
	{ id: 'column1', name: 'Green', color: 'green', cards: [ { id: 'card_column1_1' } ] },
	{ id: 'column2', name: 'Blue', color: 'blue', cards: [] },
	{ id: 'column3', name: 'No color', cards: [] },
];

const useStyles = makeStyles(() => ({
	green: {
		background: 'lightgreen',
	},
	blue: {
		background: 'lightblue',
	},
}));

export function StylingStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);
	const classes = useStyles()

	const getColumnClassName = (column: ColoredColumn) => {
		switch (column.color) {
			case 'green':
				return classes.green;
			case 'blue':
				return classes.blue;
			default:
				return undefined;
		}
	};

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			getColumnClassName={getColumnClassName}
		>
			{card => <SimpleCard card={card}/>}
		</Board>
	);
}
