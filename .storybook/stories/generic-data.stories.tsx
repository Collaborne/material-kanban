import { useCallback, useState } from 'react';
import MaterialCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { Board, Card, Column } from '../../src';

import { COLUMNS } from './utils/columns';
import { withTheme } from './utils/with-theme';

export default {
	title: 'Data / Generic Data',
	component: Board,
	decorators: [withTheme],
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

	const createMyColumn = useCallback(async () => {
		const index = myColumns.length + 1;
		return { id: `column${index}`, cards: [], index };
	}, [myColumns.length]);

	const createMyCard = useCallback(async (column: MyColumn) => {
		const index = column.cards.length + 1;
		return { id: `card_${column.id}_${index}`, index };
	}, []);

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

export const GenericData = () => <GenericDataStory />;
