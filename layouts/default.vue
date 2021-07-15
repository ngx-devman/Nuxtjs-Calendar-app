<script lang="ts">
import { Vue, Component, Getter } from 'nuxt-property-decorator'

@Component({
	middleware: ['auth']
})
export default class LayoutDefault extends Vue {
	@Getter('auth/user') user!: any

	modal: any = false

	get location_name() {
		if (!this.user || !this.user.location) return false
		const location_name: string = this.user.location.title
		return 'location-' + location_name.toLowerCase().replaceAll(' ', '-')
	}

	get styles() {
		if (!this.user) return {}
		const user = this.user
		if (!user.location || !user.location.media) return {}

		return {
			'--background-image': `url(${user.location.media.url.full_size})`
		}
	}
}
</script>

<template>
	<layout class="layout-default" :class="location_name" :style="styles">
		<loading-screen />
		<modal-container />

		<div class="notifications-container">
			<template v-for="item in $notify.items">
				<notification v-if="!item.is" :key="item.id" :item="item" />
				<component :is="item.is" v-else :key="item.id" :item="item" />
			</template>
		</div>

		<header class="layout-header">
			<NavigationMain />
		</header>

		<div class="layout-body" :style="$store.getters.styles.layout">
			<Nuxt />
		</div>
	</layout>
</template>

<style lang="scss" scoped>
@import '@sassy';

.layout-default {
	@include flex(column);

	position: relative;
	z-index: 1;

	background-image: var(
		--background-image,
		url('/assets/images/location-background-keowee-falls')
	);
	background-size: cover;

	&::after {
		content: '';
		width: 100%;
		height: 100%;

		position: absolute;
		left: 0px;
		top: 0px;
		z-index: 0;

		pointer-events: none;

		@include glass-it(rgba(#7b98ac, 0.25), 2px);
	}

	.notifications-container {
		display: grid;
		grid-auto-flow: row;
		row-gap: 0.5em;
		align-content: start;

		height: 0%;
		// width: 0%;

		position: fixed;
		right: 1em;
		top: 1em;
		z-index: 50;

		overflow: visible;
	}

	.layout-header,
	.layout-body {
		width: 100%;
	}

	.layout-header {
		z-index: 2;
	}

	.layout-body {
		flex: 1;
		overflow: hidden;
		z-index: 1;
	}

	@media screen and (max-width: 750px) {
		// font-size: small;
	}
}

@include mobile {
	* {
		--scrollbar-size: 0px;
	}
}
</style>
