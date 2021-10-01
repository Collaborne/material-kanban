import { createElement, useCallback } from 'react';
import { action } from '@storybook/addon-actions';
import IconButton from '@mui/material/IconButton';
import CallToAction from '@mui/icons-material/CallToAction';

import { Board, Column } from '../../src';

import { withDescription } from '../utils';
import { useColumns, COLUMNS } from './utils/columns';
import { withTheme } from './utils/with-theme';

export default {
	title: 'Customization / Column',
	component: Board,
	decorators: [withTheme],
};

function ColumnActionsStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	const columnMenu = useCallback((column: Column) => {
		const columnActionClicked = action('column action');
		return (
			<IconButton
				onClick={() => columnActionClicked(`column ${column.id}`, { column })}
			>
				{createElement(CallToAction)}
			</IconButton>
		);
	}, []);

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

	const columnName = useCallback((column: Column) => <u>{column.name}</u>, []);

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
