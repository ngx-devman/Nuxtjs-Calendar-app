<script lang="ts">
import { TOGGLE_PROP } from '@includes'
import ClubEvent from '@includes/models/ClubEvent'
import { Vue, Component, Inject, Prop } from 'nuxt-property-decorator'

@Component
export default class EventTickets extends ClubEvent.Injected {
	@Prop(TOGGLE_PROP)
	input!: boolean
}
</script>

<template>
	<div class="event-tickets">
		<event-ticket
			v-for="(ticket, i) in club_event_tickets"
			:key="ticket.id"
			:event_ticket.sync="club_event_tickets[i]"
			:input="input"
		/>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-tickets {
	@include flex(column);
	// width: 100%;
}
</style>
