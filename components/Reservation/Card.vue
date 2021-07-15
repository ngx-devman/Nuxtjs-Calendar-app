<script lang="ts">
import { ReservationsFetchSingleAction } from '@store/reservations'
import { Vue, Component, Action, Prop } from 'nuxt-property-decorator'

@Component
export default class ReservationCard extends Vue {
	@Prop({ type: Object, default: true }) reservation!: any
	@Action('reservations/fetch_single')
	fetchSingle!: ReservationsFetchSingleAction

	get reservationDateTime() {
		return this.$moment(this.reservation.event.start_date)
	}

	get reserveYearDate() {
		return this.reservationDateTime.format('MMMM D, YYYY')
	}

	get reserveDate() {
		return this.reservationDateTime.format('MMMM D')
	}

	get reserveYear() {
		return this.reservationDateTime.format('YYYY')
	}

	get reserveTime() {
		return this.reservationDateTime.format('h:mm a')
	}

	get barColor() {
		const event = this.reservation.event
		if (!event || !event.categories || !event.categories.length)
			return '#c5d0a6'
		return event.categories[0].color
	}

	// get reservation event start and end date and time
	get eStart() {
		return this.$moment(this.reservation.event.start_date)
	}

	get eStartFormat() {
		return this.eStart.format('MM/DD/YYYY hh:mm A')
	}

	get eEnd() {
		const e_end = this.$moment(this.reservation.event.end_date)
		if (e_end.isValid()) {
			return e_end
		} else {
			return this.$moment(this.reservation.event.start_date).add(1, 'hours')
		}
	}

	get eEndFormat() {
		return this.eEnd.format('MM/DD/YYYY hh:mm A')
	}

	get timeZone() {
		return this.$moment.tz.guess()
	}

	get rTitle() {
		return this.reservation.event.title
	}

	get rLocation() {
		const event = this.reservation.event
		if (!event || !event.locations || !event.locations.length) return false
		return event.locations[0].title
	}

	get rDescription() {
		return this.reservation.event.snippet
	}
}
</script>

<template>
	<card-colored-bar class="reservation-card" :color="barColor">
		<div v-if="reservation.status === 'cancelled'" class="reservation-status">
			Canceled
		</div>

		<h3 class="details-title">{{ reservation.event.title }}</h3>
		<div class="details-datetime">
			<span class="date">{{ reserveYearDate }}</span>
			<div class="dot" />
			<span class="time">{{ reserveTime }}</span>
		</div>

		<div class="reservation-actions">
			<form-button
				class="flat"
				@click="$modal.open({ is: 'reservation-details-modal', reservation })"
			>
				<span>Details</span>
			</form-button>

			<template v-if="reservation.status !== 'cancelled'">
				<form-button
					class="flat"
					@click="$modal.open({ is: 'event-confirm-modal', reservation })"
				>
					<span>Cancel</span>
				</form-button>

				<add-to-calendar
					class="add-to-calendar"
					:options="{
						start: eStartFormat,
						end: eEndFormat,
						timezone: timeZone,
						title: rTitle,
						description: rDescription,
						location: rLocation
					}"
				/>
			</template>
		</div>
	</card-colored-bar>
</template>

<style lang="scss" scoped>
@import '@sassy';
.card.reservation-card {
	z-index: 1;
	// transform: scale(0.95);
	// transition: transform 0.25s;

	position: relative;
	background-color: $color-primary;
	color: white;

	.reservation-status {
		padding: 0.25em;

		position: absolute;
		right: 0.5em;
		bottom: 0.5em;

		text-transform: capitalize;

		color: white;

		border-radius: $border-radius;
		line-height: 100%;
		font-weight: bold;
		font-style: italic;

		transform: scale(0.9);
	}

	.details-title,
	.details-datetime {
		margin-left: 0.4em;
	}

	.details-title {
		padding: 0px;
		line-height: normal;
	}

	.details-datetime {
		font-size: 1em;
		.dot {
			background-color: white;
		}
	}

	.reservation-actions {
		@include flex(row, flex-start, stretch);
		margin-top: 0.5em;

		.form-button {
			padding: 0.45em;
			font-weight: 400;
			text-decoration: underline;
			@include horizontal-list-item(0.25em);
		}

		.add-to-calendar {
			margin-left: 0.75em;
			text-decoration: underline;
			font-weight: 400;
			font-size: 0.8em;

			&::v-deep {
				.addeventatc_icon {
					display: none;
				}

				.addeventatc_dropdown.addeventatc-selected {
					position: fixed;
					left: 50% !important;
					top: 50% !important;
					transform: translate(-50%, -50%) !important;
					width: 95%;
				}

				.copyx {
					display: none;
				}
			}
		}

		.cancelled {
			color: #ebb09e;
		}
	}

	&:hover {
		// transform: scale(0.99);
		z-index: 99999;
		position: relative;
	}
}
</style>
