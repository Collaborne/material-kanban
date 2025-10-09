import { Board } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';

export default {
	title: 'Read-only',
	component: Board,
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
