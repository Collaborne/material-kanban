import React from 'react';
import { action } from '@storybook/addon-actions';
import IconButton from '@material-ui/core/IconButton';
import CallToAction from '@material-ui/icons/CallToAction';

import { Board, Column } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';

export function ColumnActionsStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	const columnActionClicked = action('column action');

	function columnMenu(column: Column) {
		return (
			<IconButton
				onClick={() => columnActionClicked(`column ${column.id}`, { column })}
			>
				{React.createElement(CallToAction)}
			</IconButton>
		);
	}

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			columnActions={columnMenu}
		/>
	);
}
