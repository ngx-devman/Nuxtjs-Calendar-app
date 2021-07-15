<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Card extends Vue {}
</script>

<template>
	<div class="card">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.card {
	padding: 16px;
	background-color: white;
	color: #646464;

	border-radius: $border-radius;
}
</style>
