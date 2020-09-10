import React from 'react';

import { Board } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { SimpleCard } from './utils/card';

export function ReadOnlyStory() {
	const [columns, setColumns] = useColumns(COLUMNS);

	return (
		<Board
			columns={columns}
			onChange={setColumns}
		>
			{card => <SimpleCard card={card}/>}
		</Board>
	);
}
