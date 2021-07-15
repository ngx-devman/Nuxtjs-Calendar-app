<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { Vue, Component, Prop, PropSync, Inject } from 'nuxt-property-decorator'

@Component
export default class EventDatetime extends ClubEvent.Injected {
	get element_classes() {
		const event = this.club_event
		return { 'is-all-day': event.is_allday, 'is-one-day': this.is_one_day }
	}

	get start_date() {
		return this.club_event_start_moment.format('ddd, MMM Do')
	}

	get start_time() {
		return this.club_event_start_moment.format('h:mm a')
	}

	get end_date() {
		if (!this.club_event_end_moment.isValid()) return false
		return this.club_event_end_moment.format('ddd, MMM Do')
	}

	get end_time() {
		if (!this.club_event_end_moment.isValid()) return false
		return this.club_event_end_moment.format('h:mm a')
	}

	get is_one_day() {
		return !this.end_date || this.end_date === this.start_date
	}
}
</script>

<template>
	<div v-if="club_event" class="event-datetime" :class="element_classes">
		<template v-if="club_event.is_allday">
			<span class="date">{{ start_date }}</span>
			<div class="dot" />
			<span>All Day</span>
		</template>
		<template v-else>
			<span class="date">
				{{ start_date }}
				<template v-if="!is_one_day">
					<div class="dot" />
					{{ end_date }}
				</template>
			</span>

			<div class="dot" />

			<span class="time">
				{{ start_time }}
				<template v-if="end_time && (end_time !== start_time || !is_one_day)">
					to
					{{ end_time }}
				</template>
			</span>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-datetime {
	@include flex(column);
	grid-area: eventdatetime;

	.dot {
		@include flex(column, center, center);
		margin: 0px 0.5em;
		align-self: stretch;

		&:after {
			content: '';
			width: 5px;
			height: 5px;
			background-color: var(--event-datetime-dot-color, $color-primary);
			border-radius: 100%;
		}
	}

	& > .dot {
		display: none;
	}

	.date,
	.time {
		@include flex(row, flex-start, center);
	}

	&.is-all-day,
	&.is-one-day {
		@include flex(row);

		& > .dot {
			display: flex;
		}
	}
}
</style>
