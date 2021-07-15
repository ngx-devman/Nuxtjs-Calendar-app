<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { Vue, Component, PropSync, Inject } from 'nuxt-property-decorator'

@Component
export default class EventFavoriteButton extends ClubEvent.Injected {}
</script>

<template>
	<form-button
		class="event-favorite-button flat outline no-border compact"
		:title="club_event_favorite_text"
		@click="$favoriteClubEvent(club_event.id)"
	>
		<template v-if="club_event_is_favorite">
			<i class="fas fa-star"></i>
			<span>Unfavorite</span>
		</template>
		<template v-else>
			<i class="far fa-star"></i>
			<span>Favorite</span>
		</template>
	</form-button>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-favorite-button {
	grid-area: eventfavoritebutton;
	background-color: transparent;

	i.fas {
		color: #ebca9e;
	}

	i.far {
		color: $that-gray;
	}
}
</style>
