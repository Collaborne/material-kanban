import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
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

export function AddColumnButton({ onClick, styles }: Props) {
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
