import CallToAction from '@mui/icons-material/CallToAction';
import IconButton from '@mui/material/IconButton';
import { action } from '@storybook/addon-actions';
import { createElement, useCallback } from 'react';

import { Board, Column } from '../../src';

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

export const ColumnActions = () => <ColumnActionsStory />;

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

export const ColumnName = () => <ColumnNameStory />;
