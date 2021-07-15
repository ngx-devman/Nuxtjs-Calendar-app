<script lang="ts">
import { TOGGLE_PROP } from '@includes'
import ClubReservation from '@includes/models/ClubReservation'
import { Component, InjectReactive, Prop } from 'nuxt-property-decorator'

@Component({
	inheritAttrs: false
})
export default class ReservationTickets extends ClubReservation.Injected {
	map_reservation_tickets_from_event = true

	@Prop(TOGGLE_PROP)
	selectedOnly!: boolean

	get the_tickets() {
		if (!this.selectedOnly) return this.club_reservation_tickets
		return this.club_reservation_selected_tickets
	}
}
</script>

<template>
	<ticket-list
		v-bind.sync="$attrs"
		:tickets="the_tickets"
		class="reservation-tickets"
	>
		<template #header><slot name="header" /></template>
		<template #ticket="{ input, index }">
			<reservation-ticket
				:ticket="the_tickets[index]"
				:input="input"
				:selected-only="selectedOnly"
			/>
		</template>
	</ticket-list>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
