import { Board, Column } from '../../src';

import { withDescription } from '../utils';
import { useColumns } from './utils/columns';
import { withTheme } from './utils/with-theme';

export default {
	title: 'Data / Empty',
	component: Board,
	decorators: [withTheme],
};

function EmptyStory() {
	const [columns, setColumns, createColumn, createCard] = useColumns(
		[] as Column[],
	);

	return (
		<Board
			columns={columns}
			onChange={setColumns}
			createColumn={createColumn}
			createCard={createCard}
		/>
	);
}

export const Empty = withDescription('A board can be empty initially', () => (
	<EmptyStory />
));
