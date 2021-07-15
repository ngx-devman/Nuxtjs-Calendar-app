<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import ClubEventTicket from '@includes/models/ClubEventTicket'
import { Vue, Component, PropSync, Watch } from 'nuxt-property-decorator'

@Component({
	inheritAttrs: false
})
export default class EventTicket extends ClubEventTicket.Mixin {
	@PropSync('event_ticket', { type: Object, required: true })
	the_club_event_ticket!: ClubEventTicket.Data
}
</script>

<template>
	<club-ticket
		v-bind.sync="$attrs"
		class="event-ticket"
		:input-props="{
			min: 0,
			max: event_ticket.maximum_purchase
		}"
		@input="checkMax"
	>
		<template #ticket-title>
			<div class="ticket-title">
				<span class="ticket-title-text">{{ club_ticket.title }}</span>
				<span v-if="club_event_ticket.price" class="ticket-price">{{
					club_event_ticket_price_display
				}}</span>
			</div>
		</template>
	</club-ticket>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-ticket {
	.ticket-title {
		@include flex(row, space-between);
		width: fit-content;

		.ticket-price {
			margin-top: 0.2em;
			margin-left: 1em;
			font-size: 0.75em;
			font-style: italic;
		}
	}
}
</style>
