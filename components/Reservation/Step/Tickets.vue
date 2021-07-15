<script lang="ts">
import ClubReservation from '@includes/models/ClubReservation'
import { Vue, Component, InjectReactive } from 'nuxt-property-decorator'

@Component
export default class ReservationStepTickets extends ClubReservation.Injected {
	// get tickets() {
	// 	if (!this.club_reservation || !this.club_event) return []
	// 	const tickets: any[] = this.club_event.event_tickets
	// 	return !tickets ? [] : tickets
	// }

	// set tickets(v: any[]) {
	// 	this.club_reservation.tickets = v
	// }

	created() {
		// if (!this.club_reservation.tickets.length) {
		// 	this.club_reservation.tickets = this.tickets.map(t => ({
		// 		event_ticket: t.id,
		// 		quantity: ''
		// 	}))
		// }
	}
}
</script>

<template>
	<div class="step-page step-5">
		<div class="question">
			<h2>Choose from the following ...</h2>
		</div>

		<div class="divider" />

		<div class="answers">
			<reservation-tickets input />

			<div class="step-actions">
				<form-button class="ghost" @click="$emit('next')">
					<span>Next</span>
				</form-button>

				<form-button class="ghost no-border skip" @click="$emit('next')">
					<span>Skip</span>
				</form-button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.step-page.step-5 {
	@include below-desktop {
		height: fit-content;
	}

	.answers {
		@include flex(column, flex-start, center);
		// min-width: 400px;
	}
} // step 1 page
</style>
