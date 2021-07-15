<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class EventReservationModal extends Vue {
	@Prop({ type: Object, required: true }) reservation!: any

	get event() {
		return this.reservation.event
	}

	get event_location() {
		const event = this.event
		if (!event || !event.locations || !event.locations.length) return false
		return event.locations[0]
	}

	// Sloted Date and TIme
	get slotedStartDateTime() {
		if (
			this.reservation.time_slot !== null &&
			this.reservation.time_slot.start_date
		) {
			return this.$moment(this.reservation.time_slot.start_date)
		} else return this.eStartDateTime
	}

	get slotedStartYearDate() {
		return this.slotedStartDateTime.format('MMMM D, YYYY')
	}

	get slotedStartTime() {
		return this.slotedStartDateTime.format('hh:mm A')
	}

	get slotedEndDateTime() {
		return this.$moment(this.reservation.time_slot.end_date)
	}

	get slotedEndYearDate() {
		return this.slotedEndDateTime.format('MMMM D, YYYY')
	}

	get slotedEndTime() {
		return this.slotedEndDateTime.format('hh:mm A')
	}
	// Event Date and Time

	get eStartDateTime() {
		return this.$moment(this.event.start_date)
	}

	get eEndDateTime() {
		return this.$moment(this.event.end_date)
	}

	get startDate() {
		if (this.reservation.time_slot) {
			return this.slotedStartYearDate
		} else {
			return this.eStartDateTime.format('MMMM D, YYYY')
		}
	}

	get startTime() {
		if (this.reservation.time_slot) {
			return this.slotedStartTime
		} else {
			return this.eStartDateTime.format('h:mm A')
		}
	}

	get endTime() {
		if (this.reservation.time_slot) {
			return this.slotedEndTime
		} else if (this.eEndDateTime.isValid()) {
			return this.eEndDateTime.format('h:mm A')
		} else {
			return '~'
		}
	}

	get formAnswer() {
		if (this.reservation.form_answer === null) {
			return ''
		} else {
			return this.reservation.form_answer.field_answers
		}
	}

	get guestInfo() {
		return this.reservation.guests
	}

	get formAnswer1() {
		if (this.formAnswer.length > 0) {
			// return this.formAnswer[0].value.replace(/[\[\]']+/g, '')
			return this.formAnswer[0].value
		}
	}

	get formAnswer2() {
		if (this.formAnswer.length > 0) {
			return this.formAnswer[1].value
		} else return ''
	}

	get partySize() {
		if (this.guestInfo.length > 0) {
			return this.guestInfo.length.toString()
		} else return 'Party does not exist'
	}

	get hostName() {
		if (this.reservation.reserved_by !== null) {
			const hostname =
				this.reservation.reserved_by.first_name +
				' ' +
				this.reservation.reserved_by.last_name
			return hostname
		} else {
			return 'Host name can not be found!'
		}
	}

	get guestName() {
		if (this.guestInfo.length > 0) {
			const guest_name: string[] = []
			this.guestInfo.forEach(function (guest: any) {
				if (guest.name) {
					guest_name.push(guest.name)
				} else if (guest.member && typeof guest.member === 'object') {
					const member = guest.member
					guest_name.push(`${member.first_name} ${member.last_name}`)
				}
			})
			return guest_name.toString()
		} else return 'Guest does not exist'
	}

	get statusClass() {
		switch (this.reservation.status) {
			case 'cancelled':
				return 'alert'
			case 'reserved':
				return 'success'
			default:
				return ''
		}
	}

	get formAnswers() {
		if (!this.reservation || !this.reservation.form_answer) return []
		const answers: any[] = this.reservation.form_answer.field_answers
		if (!answers) return []
		return answers
			.map((a: any) => {
				const field = a.field
				if (!field) return null

				try {
					field.value = JSON.parse(a.value)
				} catch {
					field.value = a.value
				}

				return field
			})
			.filter((i: any) => i)
	}
}
</script>

<template>
	<modal class="reservation-details-modal">
		<div class="form-header">
			<div>
				<h3 class="event-title">{{ event.title }}</h3>
				<badge class="reservation-status" :class="statusClass">
					{{ reservation.status }}
				</badge>
			</div>
			<div v-if="event_location" class="details-location">
				<i class="fas fa-map-marker-alt"></i>
				<span class="details-location-title">{{ event_location.title }}</span>
			</div>
		</div>

		<div class="reservation-details">
			<form-input
				class="flat expanded"
				name="event_time_slot"
				:value="`${startDate} from ${startTime} to ${endTime}`"
				label="Event Date/Time"
				readonly
			/>

			<!-- <form-input
				class="flat expanded"
				name="event_time_slot"
				readonly
				:value="`${startTime} to ${endTime}`"
				label="Event time"
			/> -->

			<div class="host-party-size">
				<form-input
					name="reserved_name"
					class="flat"
					:value="hostName"
					label="Host Member"
					readonly
				/>

				<form-input
					name="party_size"
					class="flat"
					:value="partySize"
					label="Party Size"
					readonly
				/>
			</div>

			<form-text-area
				name="guest_name"
				class="flat expanded"
				:value="guestName"
				label="Guests"
				readonly
			/>
		</div>

		<div class="reservation-form-answers">
			<dynamic-form v-model="formAnswers" readonly />
		</div>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.reservation-details-modal {
	.form-header {
		@include flex(row, space-between);
		width: 100%;
		padding: 10px;
		padding-bottom: 0px;
		margin-bottom: 0.5em;

		.event-title {
			color: $color-primary;
		}

		.r-status {
			text-transform: capitalize;
		}

		.details-location {
			align-items: flex-start;
			padding-top: 4px;
		}

		@media screen and (max-width: 876px) {
			padding-top: 10px;
		}
	}

	.reservation-details {
		flex: 1;
		width: 100%;

		.host-party-size {
			@include flex(row);
			width: 100%;

			& > * {
				flex: 1;
			}

			@media screen and (max-width: 400px) {
				flex-wrap: wrap;

				& > * {
					width: 100%;
				}
			}
		}
	}

	.reservation-form-answers {
		width: 100%;
	}
}

.modal.reservation-details-modal::v-deep {
	.modal-body {
		@include flex(column);
		width: 500px;
		max-height: 75vh;

		padding: 20px;

		color: $that-gray;

		overflow: hidden;
		overflow-y: auto;

		label {
			color: $that-gray;
		}

		.input-radio {
			--input-radio-mark-color: #{$that-yellow};
		}

		@media screen and (max-width: 500px) {
			// padding: 0px;
		}
	}
}
</style>
