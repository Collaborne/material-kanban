// eslint-disable-next-line @typescript-eslint/no-var-requires
const EslintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
	stories: ['./stories/*.stories.tsx'],
	addons: [
		'@storybook/preset-create-react-app',
		'@storybook/addon-actions',
		'@storybook/addon-docs',
		'@storybook/addon-links',
		'@storybook/addon-backgrounds',
	],
	webpackFinal: config => {
		return {
			...config,
			performance: {
				hints: false,
			},
			plugins: config.plugins.filter(plugin => {
				// Remove the eslint-webpack-plugin: We already check our code, storybook doesn't need to bother
				// doing it again with potentially different options.
				if (plugin instanceof EslintWebpackPlugin) {
					return false;
				}
				return true;
			}),
		};
	},
};
