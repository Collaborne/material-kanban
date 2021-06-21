import { Board, Intl } from '../../src';

import { withDescription } from '../utils';
import { useColumns, COLUMNS } from './utils/columns';

export default {
	title: 'Customization / I18n',
	component: Board,
	decorators: [],
};

function I18nStory() {
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
		/>
	);
}

export const I18n = withDescription(
	'The `intl` parameter can be used to configure the texts in the board controls',
	() => <I18nStory />,
);
I18n.storyName = 'I18n';
