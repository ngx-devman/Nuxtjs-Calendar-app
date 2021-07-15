<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Badge extends Vue {}
</script>

<template>
	<div class="badge">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.badge {
	display: inline-block;
	padding: 0.25em 0.5em;

	background-color: rgba($color-primary, 0.25);
	color: $color-primary-darken;

	text-transform: capitalize;
	font-weight: bold;

	border-radius: $border-radius;

	&.success {
		background-color: rgba($that-green, 0.25);
		color: $that-green-darker;
	}

	&.alert {
		background-color: rgba($that-peach, 0.25);
		color: $that-peach-darker;
	}
}
</style>
