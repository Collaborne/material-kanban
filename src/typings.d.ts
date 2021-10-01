import { Theme } from '@mui/material/styles';

/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
	const content: { [className: string]: string };
	export default content;
}

declare module '@mui/styles' {
	interface DefaultTheme extends Theme {}
}
