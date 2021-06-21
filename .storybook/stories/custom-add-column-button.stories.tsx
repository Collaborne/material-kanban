import { Board } from '../../src';

import { withDescription } from '../utils';
import { useColumns, COLUMNS } from './utils/columns';

export default {
	title: 'Customization / Add Column Button',
	component: Board,
	decorators: [],
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
