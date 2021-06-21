import { createElement } from 'react';
import { action } from '@storybook/addon-actions';
import IconButton from '@material-ui/core/IconButton';
import CallToAction from '@material-ui/icons/CallToAction';

import { Board, Column } from '../../src';

import { withDescription } from '../utils';
import { useColumns, COLUMNS } from './utils/columns';

export default {
	title: 'Customization / Column',
	component: Board,
	decorators: [],
};

function ColumnActionsStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	const columnActionClicked = action('column action');

	function columnMenu(column: Column) {
		return (
			<IconButton
				onClick={() => columnActionClicked(`column ${column.id}`, { column })}
			>
				{createElement(CallToAction)}
			</IconButton>
		);
	}

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			renderColumnActions={columnMenu}
		/>
	);
}

export const ColumnActions = withDescription(
	'The column header (actions) can be customized',
	() => <ColumnActionsStory />,
);

function ColumnNameStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	function columnName(column: Column) {
		return <u>{column.name}</u>;
	}

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			renderColumnName={columnName}
		/>
	);
}

export const ColumnName = withDescription(
	'The column header (name) can be customized',
	() => <ColumnNameStory />,
);
