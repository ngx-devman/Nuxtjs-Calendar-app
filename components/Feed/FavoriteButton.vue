<script lang="ts">
import { Vue, Component, PropSync, Getter } from 'nuxt-property-decorator'

@Component
export default class FeedFavoriteButton extends Vue {
	@Getter('auth/user') user!: any
	@Getter('favoritesFeed') favoritesFeed!: boolean
	@PropSync('locations') locationValue!: number[] | false

	toggleFavorites() {
		if (!this.favoritesFeed) {
			this.$root.$emit('clear-filters')
			this.$nextTick().then(() => this.$store.commit('favoritesFeed', true))
		} else {
			this.$root.$emit('clear-filters')

			this.locationValue = [this.user.location.id]
		}
	}
}
</script>

<template>
	<form-button
		class="favorite-events flat"
		:class="{ outline: favoritesFeed }"
		@click="toggleFavorites"
	>
		<i class="fas fa-star"></i>
		MY FAVORITES
	</form-button>
</template>

<style lang="scss" scoped>
@import '@sassy';

.favorite-events {
	width: 100%;
	margin-top: 1em;
	background: transparent;

	i {
		color: $that-yellow;
	}
}

.outline {
	background: $that-white;
	color: $that-gray !important;
}
</style>
