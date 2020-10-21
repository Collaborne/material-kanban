import React from 'react';

import { Board } from '../../src';

import { withDescription } from '../utils';

import { BasicStory } from './basic';
import { ColumnActionsStory } from './column-actions';
import { CustomCardStory } from './custom-card';
import { EmptyStory } from './empty';
import { ExternalChangeStory } from './external-change';
import { GenericDataStory } from './generic-data';
import { I18nStory } from './i18n';
import { ReadOnlyStory } from './readonly';
import { StylingStory } from './styling';
import { ViewOnlyStory } from './viewonly';

export default {
	title: 'Kanban',
	component: Board,
	decorators: [],
};

export const Basic = withDescription(
	'The Kanban board provides columns and cards that can be dragged around',
	() => <BasicStory />,
);

export const Empty = withDescription('A board can be empty initially', () => (
	<EmptyStory />
));

export const ViewOnly = withDescription(
	'By not providing any callbacks the board will only show the content',
	() => <ViewOnlyStory />,
);

export const ReadOnly = withDescription(
	'By not providing the `createColumn` and/or `createCard` parameters the board no longer allows creating columns and cards, respectively.',
	() => <ReadOnlyStory />,
);

export const I18n = withDescription(
	'The `intl` parameter can be used to configure the texts in the board controls',
	() => <I18nStory />,
);
I18n.storyName = 'I18n';

export const GenericData = withDescription(
	'The board handles generic data types and provides the correctly typed "card" in the render prop',
	() => <GenericDataStory />,
);

export const ExternalChange = withDescription(
	'Changing the data from the outside requires re-creating the component',
	() => <ExternalChangeStory />,
);

export const Styling = withDescription(
	'The columns of the board can be styled',
	() => <StylingStory />,
);

export const ColumnActions = withDescription(
	'The column header can be customized',
	() => <ColumnActionsStory />,
);

export const CustomCard = withDescription(
	'Card renderer can be changed',
	() => <CustomCardStory />,
);
