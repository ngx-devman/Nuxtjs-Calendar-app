<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import ClubLocation from '@includes/models/ClubLocation'
import {
	Vue,
	Component,
	PropSync,
	Prop,
	Inject,
	mixins
} from 'nuxt-property-decorator'

@Component
export default class EventLocation extends mixins(
	ClubLocation.Mixin,
	ClubEvent.Injected
) {
	@Prop({ type: Boolean, default: false })
	showAll!: boolean
}
</script>

<template>
	<div v-if="club_event && club_event.locations.length" class="event-location">
		<i class="fas fa-map-marker-alt"></i>
		<span
			v-if="club_event.locations.length > 1 && !showAll"
			:title="location_titles.join('\n')"
		>
			Multiple locations
		</span>
		<span v-else-if="showAll" v-text="location_titles.join(', ')">
			<!-- <template v-for="title in location_titles">
				{{ title }} <br :key="title" />
			</template> -->
		</span>
		<span v-else>{{ club_event.locations[0].title }}</span>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-location {
	@include flex(row, flex-start, center);
	grid-area: eventlocation;

	i {
		margin-right: 0.25em;
		font-size: 1em;
		color: $color-primary;
	}
}
</style>
