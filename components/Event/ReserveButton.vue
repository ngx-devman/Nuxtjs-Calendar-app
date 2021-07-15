<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import ClubReservation from '@includes/models/ClubReservation'
import { Vue, Component, Ref } from 'nuxt-property-decorator'

@Component
export default class EventReserveButton extends ClubEvent.Injected {
	@Ref('forestees') forestees!: any

	existing_reservations: ClubReservation.Data[] = []

	get club_reservation() {
		return ClubReservation.create({
			event: this.club_event
		})
	}

	async fetch() {
		try {
			const reservations = await this.$fetchOwnedEventReservations({
				status: 'reserved'
			})
			this.existing_reservations = reservations
		} catch {
			console.warn('failed checking for existing reservations for event')
		}
	}

	open() {
		if (this.forestees && this.forestees.form) {
			this.forestees.submit()
		} else if (!this.existing_reservations.length) {
			this.$modal.open({
				is: 'reservation-form-modal',
				reservation: this.club_reservation
			})
		} else {
			this.$modal.open({
				is: 'reservation-details-modal',
				reservation: this.existing_reservations[0]
			})
		}
	}
}
</script>

<template>
	<form-button
		v-if="club_event_reservation_is_available && user_can_make_reservation"
		class="event-reserve-button flat compact"
		@click="open"
	>
		<event-forestees-reserve
			v-if="club_event.foretees_event_name"
			ref="forestees"
		/>
		<span v-if="!existing_reservations.length">Reserve</span>
		<span v-else>My Reservation</span>
		<i
			v-if="!existing_reservations.length && club_event.foretees_event_name"
			class="fal fa-external-link"
		/>
	</form-button>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
