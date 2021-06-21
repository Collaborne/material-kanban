import { useState } from 'react';
import MaterialCard from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { Board, Card, Column } from '../../src';

import { withDescription } from '../utils';
import { COLUMNS } from './utils/columns';

export default {
	title: 'Data / Generic Data',
	component: Board,
	decorators: [],
};

function GenericDataStory() {
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
			{(card, provided) => (
				<MaterialCard
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					ref={provided.innerRef}
				>
					<CardContent>
						{card.id}: {card.index}
					</CardContent>
				</MaterialCard>
			)}
		</Board>
	);
}

export const GenericData = withDescription(
	'The board handles generic data types and provides the correctly typed "card" in the render prop',
	() => <GenericDataStory />,
);
