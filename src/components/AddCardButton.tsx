import React from 'react';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { IntlContext } from './IntlContext';

export interface AddCardButtonStyles {
	addCardButton: string;
}
interface Props {
	onClick?: () => void;
	styles?: AddCardButtonStyles;
}

export function AddCardButton({ onClick, styles }: Props) {
	return (
		<IntlContext.Consumer>
			{intl => (
				<Button
					startIcon={<AddIcon />}
					onClick={onClick}
					className={styles?.addCardButton}
					color="inherit"
				>
					{intl.addCardButtonLabel}
				</Button>
			)}
		</IntlContext.Consumer>
	);
}
