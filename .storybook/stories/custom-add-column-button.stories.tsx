import { Board } from '../../src';

import { withDescription } from '../utils';
import { useColumns, COLUMNS } from './utils/columns';
import { withTheme } from './utils/with-theme';

export default {
	title: 'Customization / Add Column Button',
	component: Board,
	decorators: [withTheme],
};

function AddColumnButtonStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(COLUMNS);

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
			AddColumnButton={<>This could be a button</>}
		/>
	);
}

export const AddColumnButton = withDescription(
	'Add button can be changed',
	() => <AddColumnButtonStory />,
);
