import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Board, Card, Column, Intl } from '../../src';

import { withDescription } from '../utils';

export default {
	title: 'Kanban',
	component: Board,
	decorators: [],
};

const COLUMNS: Column[] = [
	{ id: 'column1', name: 'Column 1', cards: [ { id: 'card_column1_1' } ] },
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

function SimpleCard<TCard extends Card = Card>({ card, children }: { card: TCard, children?: (card: TCard) => string }) {
	return (
		<Typography variant="body1" component="div">
			{children ? children(card) : card.id}
		</Typography>
	);
}

export const Basic = withDescription('The Kanban board provides columns and cards that can be dragged around', () => {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	const columnMoved = action('column moved');
	function handleColumnMove(column: Column, newIndex: number, oldIndex: number) {
		columnMoved(`${column.id} from ${oldIndex} to ${newIndex}`, {column});
	}
	const cardMoved = action('card moved');
	function handleCardMove(card: Card, newColumn: Column, newIndex: number, oldColumn: Column, oldIndex: number) {
		cardMoved(`${card.id} from ${oldColumn.id} position ${oldIndex} to ${newColumn.id} position ${newIndex}`, {card, oldColumn, newColumn});
	}

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			onCardMoved={handleCardMove}
			onColumnMoved={handleColumnMove}
		>
			{card => <SimpleCard card={card}/>}
		</Board>
	);
});

export const Empty = withDescription('A board can be empty initially', () => {
	const [columns, setColumns, createColumn, createCard] = useColumns([] as Column[]);

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
		>
			{card => <SimpleCard card={card}/>}
		</Board>
	);
});

export const ReadOnly = withDescription('By not providing the `createColumn` and/or `createCard` parameters the board no longer allows creating columns and cards, respectively.', () => {
	const [columns, setColumns] = useColumns(COLUMNS);

	return (
		<Board
			columns={columns}
			onChange={setColumns}
		>
			{card => <SimpleCard card={card}/>}
		</Board>
	);
});

export const I18n = withDescription('The `intl` parameter can be used to configure the texts in the board controls', () => {
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
			{card => <SimpleCard card={card}/>}
		</Board>
	);
});
I18n.storyName = 'I18n';

export const GenericData = withDescription('The board handles generic data types and provides the correctly typed "card" in the render prop', () => {
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
			{card => <SimpleCard card={card}>{card => `${card.id}: ${card.index}`}</SimpleCard>}
		</Board>
	)

});

export const ExternalChange = withDescription('Changing the data from the outside requires re-creating the component', () => {
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

});

export const CardInteraction = withDescription('Provide a handler for reacting on card clicks', () => {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	const clickAction = action('card clicked');

	function handleClick(card: Card, column: Column) {
		clickAction({card, column});
	}

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			onCardClicked={handleClick}
		>
			{card => <SimpleCard card={card}/>}
		</Board>
	);
});

export const Styling = withDescription('The board components can be styled', () => {
	return <div>TODO: Implement an example for providing style overrides through 'classes'</div>
});
