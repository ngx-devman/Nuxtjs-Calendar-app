<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { Component } from 'nuxt-property-decorator'

@Component
export default class EventGuestListModal extends ClubEvent.ProppedSource {
	page: number = 0

	beforeMount() {
		this.nextPage()
	}

	getGuestName(guest: any) {
		if (guest.name) return guest.name
		else if (guest.member && typeof guest.member === 'object') {
			const member = guest.member
			return `${member.first_name} ${member.last_name}`
		}

		return 'Anonymous Guest'
	}

	nextPage() {
		this.page++
		this.$fetchClubEventGuests({ page: this.page }).catch(() => this.page--)
	}
}
</script>

<template>
	<modal class="event-guest-list-modal">
		<h3 class="modal-title">Event Attendees</h3>

		<scroll-notifier @end="nextPage">
			<div class="guest-list">
				<template v-for="(guest, i) in club_event.guests">
					<div :key="i" class="guest">
						{{ getGuestName(guest) }}
					</div>
				</template>
			</div>
		</scroll-notifier>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-guest-list-modal::v-deep {
	.modal-body {
		@include flex(column);
		width: 300px;
		max-height: 300px;
		overflow: hidden;
	}
}

.event-guest-list-modal {
	.modal-title,
	.guest-list {
		width: 100%;
	}

	.modal-title {
		color: $color-primary;
		border-bottom: 1px solid $color-primary;
	}

	.guest-list {
		overflow: hidden;
		overflow-y: auto;

		.guest {
			padding: 0.5em;
			border-radius: $border-radius;

			&:nth-child(odd) {
				background-color: rgba($color-primary, 0.1);
			}
		}
	}
}
</style>
