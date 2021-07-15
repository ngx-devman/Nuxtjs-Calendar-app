<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import {
	Component,
	Inject,
	InjectReactive,
	PropSync
} from 'nuxt-property-decorator'

@Component
export default class EventTitle extends ClubEvent.Injected {}
</script>

<template>
	<h3 v-if="club_event" class="event-title details-title">
		{{ club_event.title }}
	</h3>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-title {
	grid-area: eventtitle;
}
</style>
