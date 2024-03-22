import type { Preview } from '@storybook/react';

const preview: Preview = {
	parameters: {
		backgrounds: {
			default: 'light',
			values: [
				{
					name: 'light',
					value: '#fafafa',
				},
				{
					name: 'dark',
					value: '#303030',
				},
			],
		},
	},
};

export default preview;
