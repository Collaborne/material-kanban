import { Board } from '../../src';

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

export const ReadOnly = () => <ReadOnlyStory />;

function ViewOnlyStory() {
	const [columns] = useColumns(COLUMNS);

	return <Board columns={columns} />;
}

export const ViewOnly = () => <ViewOnlyStory />;
