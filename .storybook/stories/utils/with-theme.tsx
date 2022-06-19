import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { StoryContext } from '@storybook/addons';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withTheme = (Story: any, context: StoryContext): JSX.Element => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Story {...context} />
		</ThemeProvider>
	);
};
