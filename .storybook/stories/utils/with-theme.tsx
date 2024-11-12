import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { StoryFn } from '@storybook/react';
import type { StoryContext } from '@storybook/types';

const theme = createTheme({
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					fontSize: '0.875rem',
					lineHeight: 1.43,
					letterSpacing: '0.01071em',
				},
			},
		},
	},
});

export const withTheme = (
	Story: StoryFn,
	context: StoryContext,
): JSX.Element => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Story {...context} />
		</ThemeProvider>
	);
};
