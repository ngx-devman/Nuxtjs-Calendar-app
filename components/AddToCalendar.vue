<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component({
	head: {
		// script: [
		// 	{
		// 		src: 'https://addevent.com/libs/atc/1.6.1/atc.min.js',
		// 	},
		// ],
	}
})
export default class AddToCalendar extends Vue {
	@Prop({ type: Object, required: true }) options!: any

	mounted() {
		const addeventatc = (window as any).addeventatc

		if (addeventatc) {
			addeventatc.refresh()
		}
	}
}
</script>

<template>
	<div title="Add to Calendar" class="addeventatc">
		Add to Calendar
		<span class="start">{{ options.start }}</span>
		<span class="end">{{ options.end }}</span>
		<span class="timezone">{{ options.timezone }}</span>
		<span class="title">{{ options.title }}</span>
		<span class="description">{{ options.description }}</span>
		<span class="location">{{ options.location }}</span>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.addeventatc::v-deep {
	.addeventatc_icon {
		display: none;
	}

	.addeventatc_dropdown.addeventatc-selected {
		position: fixed;
		left: 50% !important;
		top: 50% !important;
		transform: translate(-50%, -50%) !important;
		width: 95%;
	}

	.copyx {
		display: none;
	}
}

.addeventatc {
	@include flex(column, center, center);
	font-size: 0.9em;

	padding: 0px;
	background: none;
	box-shadow: none !important;
	color: inherit !important;

	&:hover {
		background: none !important;
		font-size: 0.9em;
	}
}
</style>
