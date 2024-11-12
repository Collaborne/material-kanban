import Button from '@mui/material/Button';
import { useCallback, useState } from 'react';

import { Board } from '../../src';

import { useColumns, COLUMNS } from './utils/columns';
import { withTheme } from './utils/with-theme';

export default {
	title: 'Data / External Change',
	component: Board,
	decorators: [withTheme],
};

function ExternalChangeStory() {
	const [columns, setColumns] = useColumns(COLUMNS);
	const [lastChange, setLastChange] = useState(Date.now());

	const addColumn = useCallback(() => {
		setColumns([...columns, { id: `column${columns.length + 1}`, cards: [] }]);
		setLastChange(Date.now());
	}, [columns, setColumns]);

	return (
		<>
			<Board key={lastChange} columns={columns} onChange={setColumns} />

			<Button onClick={addColumn}>Add column (external)</Button>
		</>
	);
}

export const ExternalChange = () => <ExternalChangeStory />;
