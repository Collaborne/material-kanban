import { Board } from '../../src';

import { withDescription } from '../utils';
import { useColumns, COLUMNS } from './utils/columns';
import { withTheme } from './utils/with-theme';

export default {
	title: 'Read-only',
	component: Board,
	decorators: [withTheme],
};

function ReadOnlyStory() {
	const [columns, setColumns] = useColumns(COLUMNS);

	return <Board columns={columns} onChange={setColumns} />;
}

export const ReadOnly = withDescription(
	'By not providing the `createColumn` and/or `createCard` parameters the board no longer allows creating columns and cards, respectively.',
	() => <ReadOnlyStory />,
);

function ViewOnlyStory() {
	const [columns] = useColumns(COLUMNS);

	return <Board columns={columns} />;
}

export const ViewOnly = withDescription(
	'By not providing any callbacks the board will only show the content',
	() => <ViewOnlyStory />,
);
