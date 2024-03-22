import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['./stories/**/*.stories.@(ts|tsx)'],
	addons: [
		'@storybook/addon-actions',
		'@storybook/addon-controls',
		'@storybook/addon-toolbars',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
};
export default config;
