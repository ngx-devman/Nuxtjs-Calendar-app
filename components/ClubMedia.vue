<script lang="ts">
import { Vue, Component, PropSync, Prop } from 'nuxt-property-decorator'
import CMedia from '@includes/models/ClubMedia'

@Component
export default class ClubMedia extends CMedia.Mixin {
	@PropSync('media', { type: Object, default: CMedia.create() })
	the_club_media!: CMedia.Data

	@Prop({ type: String })
	title!: string

	@Prop({ type: String, default: 'full_size' })
	size!: string

	@Prop({ type: Boolean, default: false })
	openable!: boolean

	@Prop({ type: Boolean, default: false })
	noTitle!: boolean
}
</script>

<template>
	<img
		v-if="club_media && club_media.url"
		:src="club_media.url[size]"
		:alt="title || club_media.name"
		class="club-media"
		:class="{ openable }"
		@click="
			if (openable)
				$modal.open({
					is: 'club-media-modal',
					media: club_media,
					title,
					noTitle
				})
		"
	/>
</template>

<style lang="scss" scoped>
@import '@sassy';

.club-media {
	display: block;

	&.openable {
		cursor: pointer;
	}
}
</style>
