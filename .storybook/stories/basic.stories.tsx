import { action } from '@storybook/addon-actions';
import { useCallback } from 'react';

import { Board, Card, Column } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';

export default {
	title: 'Basic',
	component: Board,
};

function BasicStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	const handleColumnMove = useCallback(
		(column: Column, newIndex: number, oldIndex: number) => {
			const columnMoved = action('column moved');
			columnMoved(`${column.id} from ${oldIndex} to ${newIndex}`, { column });
		},
		[],
	);
	const handleCardMove = useCallback(
		(
			card: Card,
			newColumn: Column,
			newIndex: number,
			oldColumn: Column,
			oldIndex: number,
		) => {
			const cardMoved = action('card moved');
			cardMoved(
				`${card.id} from ${oldColumn.id} position ${oldIndex} to ${newColumn.id} position ${newIndex}`,
				{ card, oldColumn, newColumn },
			);
		},
		[],
	);

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			onCardMoved={handleCardMove}
			onColumnMoved={handleColumnMove}
			canReorderColumn={column => column.id !== 'column3'}
		/>
	);
}

export const Basic = () => <BasicStory />;
