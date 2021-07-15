<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class PageError extends Vue {
	@Prop() error: any

	mounted() {
		console.log(this.error)
	}
}
</script>

<template>
	<page class="page-error">
		<h1 v-if="error.title">{{ error.title }}</h1>
		<h1 v-else-if="error.statusCode === 404">Page not found</h1>
		<h1 v-else>An error occurred</h1>

		<p v-if="error.message && typeof error.message === 'string'">
			{{ error.message }}
		</p>

		<NuxtLink to="/">Home page</NuxtLink>
	</page>
</template>

<style lang="scss" scoped>
@import '@sassy';

.page-error {
	@include flex(column, center, center);
	width: 100%;
	height: 100%;

	position: fixed;
	left: 0px;
	top: 0px;

	@include glass-it(rgba(#000, 0.5), 25px);

	p {
		font-size: 1.25em;
	}
}
</style>
