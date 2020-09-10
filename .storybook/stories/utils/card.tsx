import React from 'react';

import Typography from '@material-ui/core/Typography';

import { Card } from '../../../src';

export function SimpleCard<TCard extends Card = Card>({ card, children }: { card: TCard, children?: (card: TCard) => string }) {
	return (
		<Typography variant="body1" component="div">
			{children ? children(card) : card.id}
		</Typography>
	);
}
