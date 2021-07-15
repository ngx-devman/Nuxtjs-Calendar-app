<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { Vue, Component, Inject } from 'nuxt-property-decorator'

@Component
export default class EventShareButton extends ClubEvent.Injected {
	get show_share_button() {
		return window.navigator.clipboard
	}

	copyEventLink() {
		const event_link = window.location.origin + `/events/${this.club_event.id}`
		window.navigator.clipboard.writeText(event_link).then(() => {
			this.$notify.show('Link copied to clipboard!')
		})
	}
}
</script>

<template>
	<form-button
		v-if="show_share_button"
		class="event-share-button flat no-border"
		@click="copyEventLink"
	>
		<span>Share</span>
		<i class="fas fa-share-square"></i>
	</form-button>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
