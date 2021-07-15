<script lang="ts">
import { ReservationsCreateAction } from '@store/reservations'
import { Vue, Component, Prop, VModel, Action } from 'nuxt-property-decorator'

@Component
export default class ReservationForm extends Vue {
	@VModel({ type: Object, required: true }) reservation!: any
	@Prop({ type: Object, required: true }) event!: any

	@Action('reservations/create') $createReservation!: ReservationsCreateAction

	reservation_created: boolean = false

	addGuest(users: any) {
		this.reservation.guests = users
	}

	submitReservation() {
		const data: any = { ...this.reservation }
		data.event = this.event.id
		data.form_answers = data.form_answers.map((f: any) => ({
			field: f.id,
			value: JSON.stringify(f.value)
		}))

		return this.$createReservation(data)
			.then(() => {
				this.reservation_created = true

				this.$notify.show({
					title: 'Reservation complete.',
					content: 'View your reservations on the calendar homepage.',
					type: 'success'
				})
			})
			.catch(err => {
				let alert_text =
					'We failed to successfully place your reservation. Please try again later or contact support'

				if (err.response && err.response.data) {
					const res_data = err.response.data
					if (res_data.non_field_errors) {
						const errors = res_data.non_field_errors

						if (Array.isArray(errors)) {
							alert_text = errors.join('\n')
						}
					}
				}

				this.$notify.show({
					title: 'Failed Creating Reservation!',
					content: alert_text,
					type: 'alert'
				})
			})
	}
}
</script>

<template>
	<form-component class="reservation-form" @submit="submitReservation">
		<div v-if="!reservation_created" class="form-inner">
			<div class="form-header">
				<h2>Reservations</h2>
			</div>

			<div v-if="event.is_allowed_guests" class="reservation-guests">
				<div class="section-header">
					<label class="section-title"
						>Add attendees to your reservation ...</label
					>

					<form-button
						class="flat icon no-border add-guest"
						title="Add Guests"
						@click="
							$modal.open({
								is: 'reservation-guest-search-modal',
								userSelect: addGuest,
								reservationGuests: reservation.guests
							})
						"
					>
						<i class="fal fa-plus"></i>
					</form-button>

					<div class="guests-count">
						{{ reservation.guests.length }}
					</div>

					<div v-if="event.min_per_reservation" class="guests-min-count">
						<template v-if="event.min_per_reservation">
							min: {{ event.min_per_reservation }}
						</template>

						<template
							v-if="event.min_per_reservation && event.max_per_reservation"
						>
							/
						</template>

						<template v-if="event.max_per_reservation">
							max: {{ event.max_per_reservation }}
						</template>
					</div>
				</div>

				<reservation-guests :guests="reservation.guests" />
			</div>
			<div v-else class="reservation-guests disabled">
				<h4 class="section-title">Guests are not allowed for this event.</h4>
			</div>

			<div
				v-if="event.time_slots && event.time_slots.length"
				class="reservation-time-slot"
			>
				<label for="time_slot" class="section-title"
					>What is your preferred seating time?</label
				>

				<select v-model="reservation.time_slot" name="time_slot">
					<template v-for="(time, i) in event.time_slots">
						<option :key="i" :disabled="!time.available_seats" :value="time.id">
							{{ time.title }}

							<template v-if="time.available_seats > 0">
								({{ time.available_seats }} seats available):
							</template>
							<template v-else>(no seats available):</template>

							{{ $moment(time.start_date).format('h:mma') }}
							-
							{{ $moment(time.end_date).format('h:mma') }}
						</option>
					</template>
				</select>
			</div>

			<div class="form-wrap">
				<dynamic-form
					v-if="event.form"
					v-model="reservation.form_answers"
					:form="event.form"
				/>
			</div>

			<form-button class="flat outline submit" type="submit"
				>Reserve</form-button
			>
		</div>

		<div v-else class="reservation-created">
			<h3>Reservation complete.</h3>
			<nuxt-link to="/">
				<span>View/manage your reservations.</span>
			</nuxt-link>
		</div>
	</form-component>
</template>

<style lang="scss" scoped>
@import '@sassy';

.form.reservation-form::v-deep {
	.form-input {
		background-color: transparent;
		border: none;

		label {
			color: white;
		}

		.input-area {
			background-color: white;
		}
	}
}

.form.reservation-form {
	--input-radio-mark-color: #ebca9e;
	--input-radio-mark-color-background: white;
	@include flex(column);
	width: 100%;

	background-color: #7b98ac;
	padding: 1em;
	border-radius: $border-radius;
	overflow: hidden;

	.form-header {
		@include flex(row, center, center);
		width: 100%;

		margin-bottom: 1.5em;
	}

	.form-inner {
		--scrollbar-track-background: $color-primary;
		--scrollbar-thumb-background: white;

		@include flex(column);
		width: 100%;
		height: 100%;

		overflow: hidden;
		overflow-y: auto;

		.form-wrap,
		.form-group {
			width: 100%;
		}
	}

	.section-title {
		font-weight: bold;
		font-family: $lato-font;
		font-size: 14.4px;
	}

	.reservation-guests {
		width: 100%;
		padding: 0px 0.5em;
		padding-bottom: 0.5em;

		.section-header {
			display: grid;
			margin-bottom: 1em;

			grid-template-columns: 1fr auto auto;
			grid-template-rows: auto auto;
			grid-template-areas:
				'title add count'
				'stats stats stats';
			align-items: center;

			.section-title {
				grid-area: title;
				margin-right: 0.5em;
			}

			.add-guest {
				grid-area: add;
				--button-icon-size: 25px;
				padding: 0.5em 0.75em;

				background-color: transparent;

				margin-right: 0.5em;
				border-radius: 50px;

				i {
					font-size: 1.2em;
				}
			}

			.guests-count {
				grid-area: count;
				padding: 0.15em 0.25em;
				background-color: white;
				color: $color-primary;
				border-radius: $border-radius;
				font-size: 0.85em;
			}

			.guests-min-count {
				grid-area: stats;
				justify-self: end;
			}
		}

		&.disabled {
			text-align: center;
			padding-bottom: 1em;
		}
	}

	.reservation-time-slot {
		@include flex(column);
		width: 100%;
		padding: 1em 0.5em;
		min-height: 86px;
		label {
			font-weight: bold;
			margin-bottom: 0.5em;
		}

		select {
			width: 100%;
			padding: 0.5em;
			border: none;
			background-color: white;
			border-radius: $border-radius;
			font-family: $lato-font;
			color: $color-selectbox-text;
		}
	}

	.submit {
		align-self: center;
		flex-shrink: 0;
		margin-right: 0.5em;
	}

	.reservation-created {
		text-align: center;
		font-family: $lato-font;
		margin: auto;
		h3 {
			font-family: $lato-font;
		}
	}
}
</style>
