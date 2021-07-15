<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Page extends Vue {}
</script>

<template>
	<main class="page"  @click="$emit('close-panels')">
		<slot />
	</main>
</template>

<style lang="scss" scoped>
@import '@assets/styles/sassy';

.page {
	width: 100%;
	height: 100%;
	padding: 56px;

	overflow-y: auto;

	@media screen and (max-width: 876px), (max-height: 850px) {
		padding: 10px;
	}
}
</style>
