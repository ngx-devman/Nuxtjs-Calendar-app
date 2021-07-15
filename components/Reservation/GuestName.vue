<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class ReservationGuestName extends Vue {
	@Prop({ type: Object, required: true }) guest!: any
}
</script>

<template>
	<div class="reservation-guest-name">
		<span v-if="guest.is_anonymous">TBD</span>
		<span v-else-if="guest.name">{{ guest.name }}</span>
		<span v-else>
			{{ guest.first_name }}
			{{ guest.last_name }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
