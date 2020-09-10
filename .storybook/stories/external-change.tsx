import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import { Board } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { SimpleCard } from './utils/card';

export function ExternalChangeStory() {
	const [columns, setColumns] = useColumns(COLUMNS);
	const [lastChange, setLastChange] = useState(Date.now())

	function addColumn() {
		setColumns([
			...columns,
			{ id: `column${columns.length + 1}`, cards: [] },
		]);
		setLastChange(Date.now());
	}

	return (
		<>
			<Board
				key={lastChange}
				columns={columns}
				onChange={setColumns}
			>
				{card => <SimpleCard card={card}/>}
			</Board>

			<Button onClick={addColumn}>Add column (external)</Button>
		</>
	);
}
