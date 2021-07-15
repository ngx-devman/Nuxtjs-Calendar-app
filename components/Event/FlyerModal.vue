<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class EventFlyerModal extends Vue {
	@Prop({ type: Object, required: true }) event!: any
}
</script>

<template>
	<modal class="event-flyer fullscreen-glass">
		<template #modal-header>
			<h2>{{ event.title }}</h2>

			<!-- <a :href="event.media.url" target="_blank" download="event-flyer">
				<form-button class="compact flat">
					<span>Download</span>
					<i class="fal fa-download" />
				</form-button>
			</a> -->

			<a :href="event.flyer.url.full_size" target="_blank">
				<form-button class="compact flat">
					<span>Open</span>
					<i class="fal fa-external-link"></i>
				</form-button>
			</a>
		</template>

		<div class="overflow-wrap">
			<div class="event-flyer">
				<club-media
					v-if="event.flyer"
					class="event-flyer-image"
					:media="event.flyer"
				/>
			</div>
		</div>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.modal.event-flyer::v-deep {
	.modal-header {
		@include flex(row, space-between, center);
		flex-wrap: wrap;
		width: 100%;

		padding-bottom: 0.5em;
		margin-bottom: 0.5em;

		border: none;
	}

	.modal-body {
		@include flex(column);
		height: 100%;
		overflow: hidden;
	}
}

.modal.event-flyer {
	.overflow-wrap {
		width: 100%;
		height: 100%;

		overflow: hidden;
		border-radius: $border-radius;

		// @include above-mobile {
		// 	padding: 0.5em;
		// }
	}

	.event-flyer {
		width: 100%;
		height: 100%;

		overflow: hidden;
		overflow-y: auto;

		border-radius: $border-radius;

		.event-flyer-image {
			border-radius: $border-radius;
		}

		@include above-mobile {
			padding-right: 0.5em;
		}
	}
}
</style>
