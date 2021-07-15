<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import ClubReservation from '@includes/models/ClubReservation'
import { Component, Inject, PropSync } from 'nuxt-property-decorator'

@Component
export default class EventActions extends ClubEvent.Injected {}
</script>

<template>
	<div class="event-actions">
		<div
			v-if="
				club_event.available_spaces !== null &&
				club_event.available_spaces &&
				club_event_reservation_is_available
			"
			class="event-spaces"
		>
			<span>
				<template v-if="club_event.available_spaces >= 0">
					{{ club_event.available_spaces }}
				</template>
				<template v-else>0</template>
				spaces left
			</span>
		</div>
		<div
			v-else-if="club_event.has_waitlist && club_event_reservation_is_available"
			class="event-spaces has-waitlist"
		>
			<span>Join waitlist</span>
		</div>

		<event-attendees-button />

		<event-favorite-button />

		<event-reserve-button />
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-actions::v-deep {
	.event-attendee-button {
		span {
			font-size: 0.8em;
		}
	}
}

.event-actions {
	@include flex(column, flex-start, stretch);
	grid-area: eventactions;

	font-size: 0.8em;

	& > *:not(.event-spaces) {
		@include vertical-list-item;
	}

	.event-spaces {
		@include flex(column, center, center);
		grid-area: eventspaces;
		padding: 0.5em 0px;
		text-align: center;
		font-weight: bold;
		margin-bottom: 0.5em;
	}

	.event-reserve-button {
		grid-area: eventreservebutton;
	}
}
</style>
