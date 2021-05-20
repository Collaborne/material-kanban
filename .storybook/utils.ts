import { StoryFn, Annotations, Args } from '@storybook/addons';

type OptionalStoryInterface<Args, ReturnType> = Annotations<
	Args,
	ReturnType
> & { storyName?: string };

export function withDescription<
	T extends StoryFn<R> & OptionalStoryInterface<Args, R>,
	R,
>(storyDescription: string, story: T): T & OptionalStoryInterface<Args, R> {
	story.parameters = {
		...story.parameters,
		docs: {
			...story.parameters?.docs,
			description: {
				...story.parameters?.docs?.description,
				story: storyDescription,
			},
		},
	};

	return story;
}
