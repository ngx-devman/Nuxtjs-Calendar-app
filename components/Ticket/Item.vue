<script lang="ts">
import {
	Vue,
	Component,
	PropSync,
	InjectReactive,
	Prop
} from 'nuxt-property-decorator'
import ClubTicket from '@includes/models/ClubTicket'
import { TOGGLE_PROP } from '@includes'

@Component
export default class TicketItem extends ClubTicket.Mixin {
	@Prop(TOGGLE_PROP)
	input!: boolean

	@Prop({ type: Object, default: () => ({}) })
	inputProps!: any

	get display() {
		return !this.input
	}

	get element_classes() {
		return {
			input: this.input,
			display: this.display
		}
	}
}
</script>

<template>
	<div class="ticket-item" :class="element_classes">
		<slot name="ticket-title">
			<span class="ticket-title">{{ club_ticket.title }}</span>
		</slot>

		<slot name="ticket-quantity">
			<form-input
				v-if="input"
				v-model="club_ticket.quantity"
				v-bind.sync="inputProps"
				:label="club_ticket.subtitle"
				placeholder="How many?"
				class="ticket-quantity expanded flat"
				type="number"
				min="0"
			/>
			<div v-else class="ticket-quantity">
				Quantity: {{ club_ticket.quantity || 0 }}
			</div>
		</slot>

		<slot name="ticket-media">
			<club-media
				v-if="club_ticket.media"
				class="ticket-media"
				:media="club_ticket.media"
			/>
		</slot>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.ticket-item {
	display: grid;
	width: 100%;

	column-gap: 1em;
	row-gap: 0.25em;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto 1fr;
	grid-template-areas:
		'media title'
		'media input';
	justify-content: start;
	align-items: start;

	@include vertical-list-item;

	.ticket-media {
		width: 75px;
		height: 75px;

		grid-area: media;

		object-fit: fill;
		object-position: center;
		border-radius: $border-radius;
	}

	.ticket-title {
		grid-area: title;
		font-size: 1.25em;
	}

	.ticket-quantity {
		min-width: 50px;
		width: min-content;
		padding: 0px;
		grid-area: input;
		white-space: nowrap;

		&::v-deep {
			.input-label {
				font-weight: normal;
			}
		}
	}

	&.input {
		.ticket-media {
			opacity: 0.5;
			transition: opacity 0.25s;
		}

		.ticket-quantity:focus-within + .ticket-media,
		.ticket-quantity.has-value + .ticket-media {
			opacity: 1;
		}
	}
}
</style>
