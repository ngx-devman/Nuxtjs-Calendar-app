<script lang="ts">
import ClubReservation from '@includes/models/ClubReservation'
import { Component, InjectReactive } from 'nuxt-property-decorator'

@Component
export default class ReservationStepAddGuests extends ClubReservation.Injected {
	get guests() {
		return this.club_reservation.guests
	}

	set guests(v: any[]) {
		this.club_reservation.guests = v
	}

	get guest_count_fun_text() {
		const guestCount = this.guests.length + 1
		switch (guestCount) {
			case 1:
				return "(Pst! It's you)"
			case 2:
				return '(daring duo)'
			case 3:
				return '(three amigos)'
			case 4:
				return '(duo of duos)'
			case 5:
				return '(fullhouse)'
			case 6:
				return '(trio of duos)'
			case 10:
				return '(wow!)'
			case 100:
				return '(My name is Micheal Pearce and I love you Mom <3)'
			default:
				return "(Well you're popular)"
		}
	}

	get has_min_or_max() {
		const event = this.club_event
		return event.min_per_reservation || event.max_per_reservation
	}

	get has_min_and_max() {
		const event = this.club_event
		return event.min_per_reservation && event.max_per_reservation
	}

	get is_at_guest_limit() {
		if (!this.club_event.max_per_reservation) return false
		return this.guests.length + 1 >= this.club_event.max_per_reservation
	}

	selectUser(v: any) {
		if (this.is_at_guest_limit)
			return this.$notify.show({
				type: 'alert',
				title: 'Attendee limit reached',
				content: 'No more guests can be added to this reservation.',
				duration: 5000
			})
		if (this.guests.find(g => g.member === v.member_id))
			return this.$notify.show({
				type: 'alert',
				title: 'Attendee already added',
				content: 'You have already added this member to the reservation.',
				duration: 5000
			})
		this.guests = [
			{ ...v, member: v.member_id, form_answers: [] },
			...this.guests
		]
	}

	addGuest() {
		if (this.is_at_guest_limit)
			return this.$notify.show({
				type: 'alert',
				title: 'Attendees limit reached',
				content: 'No more guests can be added to this reservation.',
				duration: 5000
			})
		this.guests = [
			{
				is_anonymous: true,
				form_answers: []
			},
			...this.guests
		]
	}

	// created() {
	// 	if (
	// 		!this.club_reservation.guests.length &&
	// 		this.club_reservation.event.min_per_reservation
	// 	) {
	// 		for (let i = 0; i < this.club_reservation.event.min_per_reservation; i++) {
	// 			this.addGuest()
	// 		}
	// 	}
	// }

	next() {
		if (this.guests.length < 1)
			return this.$notify.show({
				type: 'alert',
				title: 'No attendees added',
				content: 'Please add more attendees to continue.',
				duration: 5000
			})
		if (
			this.club_event.min_per_reservation &&
			this.guests.length + 1 < this.club_event.min_per_reservation
		)
			return this.$notify.show({
				type: 'alert',
				title: 'Add more attendees',
				content: 'Please add more attendees to continue.',
				duration: 5000
			})

		this.$emit('next')
	}
}
</script>

<template>
	<div class="step-page step-2">
		<div class="question">
			<h1>Add attendees ...</h1>

			<div class="guest-count">
				<span>
					Party of
					{{ guests.length + 1 }}
				</span>
			</div>
		</div>

		<div class="divider" />

		<div class="answers">
			<div v-if="has_min_or_max" class="guest-count-min-max">
				This event has attendee limits:<br />
				<span v-if="club_reservation.event.min_per_reservation" class="min">
					min {{ club_reservation.event.min_per_reservation }}
				</span>

				<span v-if="has_min_and_max"> / </span>

				<span v-if="club_reservation.event.max_per_reservation" class="max">
					max {{ club_reservation.event.max_per_reservation }}
				</span>
			</div>

			<div class="member-add-input">
				<member-search-input @member-selected="selectUser" />

				<span>or</span>

				<form-button class="ghost" @click="addGuest">
					Add Non-Member Attendees
				</form-button>
			</div>

			<reservation-guests :guest-list.sync="guests" edit />

			<form-button
				class="finish ghost"
				:disabled="!guests.length"
				@click="next"
			>
				I'm Done Adding Attendees
			</form-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.step-page.step-2::v-deep {
	.reservation-guests {
		.form-button.remove {
			background-color: #ebb09e;
		}
	}
}

.step-page.step-2 {
	.question {
		@include flex(column, center, center);
		position: relative;

		.guest-count {
			@include below-tablet {
				@include flex(row, center, center);

				span {
					margin: 0px;
				}

				p {
					margin-left: 0.5em;
				}
			}
		}

		@include above-tablet {
			height: 75%;
			max-height: 350px;
		}

		@include below-tablet {
			@include flex(column, center, center);
			font-size: 0.75em;
			width: 350px;

			.guest-count {
				width: auto !important;
			}
		}
	}

	.answers {
		@include flex(column, flex-start, center);
		width: 400px;
		max-width: 100%;
		max-height: 475px;

		.guest-count-min-max {
			margin-bottom: 1em;
			text-align: center;
		}

		.member-add-input {
			@include flex(column, flex-start, center);
			width: 350px;
			max-width: 100%;
			margin-bottom: 1em;

			.member-search-input {
				width: 100%;
			}

			span {
				margin: 0.5em 0px;
			}
		}

		.reservation-guests {
			--scrollbar-size: 0px;
			width: 100%;
			flex: 1;

			overflow: hidden;
			overflow-y: auto;

			border-radius: $border-radius;
		}

		.form-button.finish {
			flex-shrink: 0;
			margin-top: 1em;
		}

		@include below-tablet {
			overflow: hidden;
		}
	} // step 2 answers
} // step 2 page
</style>
