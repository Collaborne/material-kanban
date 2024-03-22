import { Board, Intl } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { withTheme } from './utils/with-theme';

export default {
	title: 'Customization / I18n',
	component: Board,
	decorators: [withTheme],
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

export const I18n = () => <I18nStory />;
I18n.storyName = 'I18n';
