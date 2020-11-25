import { Board } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';

export function ViewOnlyStory() {
	const [columns] = useColumns(COLUMNS);

	return <Board columns={columns} />;
}
