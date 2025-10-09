import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { memo } from 'react';
import { makeStyles } from 'tss-react/mui';

import { IntlContext } from './IntlContext';

export interface AddColumnButtonStyles {
	addColumnButton?: string;
}
interface Props {
	onClick?: () => void;
	styles?: AddColumnButtonStyles;
}

const useStyles = makeStyles()({
	button: {
		whiteSpace: 'nowrap',
	},
});

export const AddColumnButton = memo(({ onClick, styles }: Props) => {
	const { classes, cx } = useStyles();

	return (
		<IntlContext.Consumer>
			{intl => (
				<Button
					startIcon={<AddIcon />}
					onClick={onClick}
					color="inherit"
					className={cx(classes.button, styles?.addColumnButton)}
				>
					{intl.addColumnButtonLabel}
				</Button>
			)}
		</IntlContext.Consumer>
	);
});
