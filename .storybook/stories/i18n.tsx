import React from 'react';

import { Board, Intl } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { SimpleCard } from './utils/card';

export function I18nStory() {
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
			{card => <SimpleCard card={card} />}
		</Board>
	);
}
