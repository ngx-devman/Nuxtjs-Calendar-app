<script lang="ts">
import { Vue, Component, Prop, Ref } from 'nuxt-property-decorator'

/**
 * @deprecated v0.7.2
 * use components/AddToCalendar.vue
 */
@Component
export default class EventCalendar extends Vue {
	@Prop({ type: String, default: '' }) title!: any
	@Prop({ type: String, default: '' }) location!: any
	@Prop({ type: String, default: '' }) details!: any
	@Prop({ type: String, default: '' }) start!: any
	@Prop({ type: String, default: '' }) end!: any
	@Ref() addeventstc!: HTMLElement

	get className() {
		const name = document.getElementsByClassName('addeventasync')
		return name
	}
}
</script>

<template>
	<modal>
		<form-button class="flat"><span>Google</span></form-button>
		<form-button class="flat"><span>Google</span></form-button>
		<form-button class="flat"><span>Google</span></form-button>
		<form-button class="flat"><span>Google</span></form-button>
		<form-button class="flat"><span>Google</span></form-button>
		<form-button class="flat"><span>Google</span></form-button>
		<div title="Add to Calendar" class="addeventstc" data-id="ic14">
			Add to Calendar
		</div>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
