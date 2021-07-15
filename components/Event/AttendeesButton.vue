<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { Vue, Component, PropSync, Inject } from 'nuxt-property-decorator'

@Component
export default class EventAttendeesButton extends ClubEvent.Injected {
	get guests() {
		return this.club_event.guests
	}

	get first_five_guests() {
		if (!this.guests) return []
		return this.guests.slice(0, 4)
	}

	get first_five_guest_names() {
		let names = this.first_five_guests
			.map(guest => {
				if (guest.name) return guest.name
				else if (guest.member && typeof guest.member === 'object') {
					const member = guest.member
					return `${member.first_name} ${member.last_name}`
				}

				return 'Anonymous Guest'
			})
			.join('\n')

		if (this.guests.length > 5) {
			names += `\nAnd ${this.club_event.total_reservations - 5} others`
		}

		return names
	}
}
</script>

<template>
	<form-button
		v-if="club_event.has_public_list"
		class="event-attendees-button flat outline compact no-border"
		:title="first_five_guest_names"
		@click="$modal.open({ is: 'event-guest-list-modal', event: club_event })"
	>
		<i class="guests-icon fad fa-users"></i>
		<span>View Attendees</span>
	</form-button>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-attendees-button {
	grid-area: eventattendeebutton;
}
</style>
