<script lang="ts">
import { TOGGLE_PROP } from '@includes'
import ClubTicket from '@includes/models/ClubTicket'
import { Vue, Component, InjectReactive, Prop } from 'nuxt-property-decorator'

@Component
export default class TicketList extends ClubTicket.Mixin {
	@Prop(TOGGLE_PROP)
	input!: boolean
}
</script>

<template>
	<section class="ticket-list">
		<slot name="header" />

		<template v-for="(ticket, i) in club_tickets">
			<slot name="ticket" :ticket="club_tickets[i]" :input="input" :index="i">
				<ticket-item
					:key="ticket.id"
					:ticket.sync="club_tickets[i]"
					:input="input"
				/>
			</slot>
		</template>
	</section>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
