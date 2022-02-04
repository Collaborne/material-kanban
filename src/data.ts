/** Item data */
export interface Card {
	readonly id: string;
}

/** Column data */
export interface Column<TCard extends Card = Card> {
	readonly id: string;
	readonly cards: readonly TCard[];

	/**
	 * Name shown as header of the column.
	 *
	 * This can be modified, and typically would have a getter/setter to handle changes.
	 */
	name?: string;
}
