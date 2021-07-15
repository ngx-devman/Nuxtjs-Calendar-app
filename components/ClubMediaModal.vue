<script lang="ts">
import ClubMedia from '@includes/models/ClubMedia'
import { Component, Prop, PropSync } from 'nuxt-property-decorator'

@Component
export default class ClubMediaModal extends ClubMedia.Mixin {
	@PropSync('media', { type: Object, required: true })
	the_club_media!: ClubMedia.Data

	@Prop({ type: String })
	title!: string

	@Prop({ type: Boolean, default: false })
	noTitle!: boolean
}
</script>

<template>
	<modal class="club-media fullscreen-glass">
		<template #modal-header>
			<span class="media-name">
				<template v-if="!noTitle">
					{{ title || club_media.name }}
				</template>
			</span>

			<!-- <a :href="event.media.url" target="_blank" download="club-media">
				<form-button class="compact flat">
					<span>Download</span>
					<i class="fal fa-download" />
				</form-button>
			</a> -->

			<a :href="club_media.url.full_size" target="_blank">
				<form-button class="compact flat">
					<span>Download</span>
					<i class="fas fa-cloud-download-alt"></i>
				</form-button>
			</a>
		</template>

		<club-media v-if="club_media" :media="club_media" />
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.modal.club-media.fullscreen-glass::v-deep {
	.modal-wrapper {
		width: 90%;
		height: unset;
		max-height: unset;
		padding: 2.5vh 0px;
		overflow: initial;

		.modal-body {
			@include flex(column, flex-start, center);
			width: 100%;
			height: 100%;
		}
	}

	.modal-header {
		@include flex(row, space-between, center);
		flex-wrap: wrap;
		width: 100%;

		padding-bottom: 0.5em;
		margin-bottom: 0.5em;

		border: none;
	}
}

.modal.club-media.fullscreen-glass {
	@include flex(column, flex-start, center);
	overflow-y: auto;

	.media-name {
		font-size: 1.5em;
	}

	.overflow-wrap {
		width: 100%;

		overflow: hidden;
		border-radius: $border-radius;

		// @include above-mobile {
		// 	padding: 0.5em;
		// }
	}

	.club-media {
		max-width: 100%;
		max-height: 150vh;

		border-radius: $border-radius;
	}
}
</style>
