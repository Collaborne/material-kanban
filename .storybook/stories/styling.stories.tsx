import { makeStyles } from 'tss-react/mui';

import { Board, Column } from '../../src';

import { useColumns } from './utils/columns';
import { withTheme } from './utils/with-theme';

export default {
	title: 'Customization / Styling',
	component: Board,
	decorators: [withTheme],
};

interface ColoredColumn extends Column {
	color?: string;
}

const COLUMNS: ColoredColumn[] = [
	{
		id: 'column1',
		name: 'Green',
		color: 'green',
		cards: [{ id: 'card_column1_1' }],
	},
	{ id: 'column2', name: 'Blue', color: 'blue', cards: [] },
	{ id: 'column3', name: 'No color', cards: [] },
];

const useStyles = makeStyles()(theme => ({
	green: {
		background: 'lightgreen',
	},
	blue: {
		background: 'lightblue',
	},
	addCardButton: {
		color: theme.palette.text.secondary,
		textTransform: 'none',
	},
	addColumnButton: {
		color: theme.palette.text.disabled,
		textTransform: 'none',
		padding: '1px 16px',
	},
	column: {
		width: theme.spacing(33),
	},
	columnHeaderName: {
		color: 'red',
	},
	columnHeaderRoot: {
		background: 'lightblue',
	},
}));

function StylingStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);
	const { classes } = useStyles();

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
			styles={{
				addCardButton: classes.addCardButton,
				addColumnButton: classes.addColumnButton,
				column: classes.column,
				columnHeaderName: classes.columnHeaderName,
				columnHeaderRoot: classes.columnHeaderRoot,
			}}
		/>
	);
}

export const Styling = () => <StylingStory />;
