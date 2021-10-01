import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import clsx from 'clsx';

import { IntlContext } from './IntlContext';

export interface AddColumnButtonStyles {
	addColumnButton?: string;
}
interface Props {
	onClick?: () => void;
	styles?: AddColumnButtonStyles;
}

const useStyles = makeStyles({
	button: {
		whiteSpace: 'nowrap',
	},
});

export function AddColumnButton({ onClick, styles }: Props): JSX.Element {
	const classes = useStyles();

	return (
		<IntlContext.Consumer>
			{intl => (
				<Button
					startIcon={<AddIcon />}
					onClick={onClick}
					color="inherit"
					className={clsx(classes.button, styles?.addColumnButton)}
				>
					{intl.addColumnButtonLabel}
				</Button>
			)}
		</IntlContext.Consumer>
	);
}
