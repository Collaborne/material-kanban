import React from 'react';

import { Board, Column } from '../../src';

import { useColumns } from './utils/columns';

export function EmptyStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(
		[] as Column[],
	);

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
		/>
	);
}
