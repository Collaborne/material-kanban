import { createContext } from 'react';

export interface Intl {
	columnNamePlaceholder: string | undefined;
	addColumnButtonLabel: string;
	addCardButtonLabel: string;
}

export const DEFAULT_INTL: Intl = {
	addColumnButtonLabel: 'Add column',
	addCardButtonLabel: 'Add card',

	columnNamePlaceholder: 'Untitled',
};

export const IntlContext = createContext(DEFAULT_INTL);
