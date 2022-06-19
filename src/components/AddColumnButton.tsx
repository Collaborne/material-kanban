import { makeStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { memo } from 'react';

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

export const AddColumnButton = memo(
	({ onClick, styles }: Props): JSX.Element => {
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
	},
);
