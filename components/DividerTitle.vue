<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class DividerTitle extends Vue {
	@Prop({ type: String, default: 'h2' }) element!: string
}
</script>

<template>
	<div class="divider-title">
		<component
			:is="element"
			class="divider-title-text"
			:class="$attrs['title-class']"
		>
			<slot />
		</component>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.divider-title {
	@include flex(row, space-between, center);
	width: 100%;

	.divider-title-text {
		margin: 0px 0.5em;
	}

	&:before,
	&:after {
		content: ' ';
		flex: 1;
		height: 1px;

		background-color: var(--divider-title-line-color, $that-gray);
	}
}
</style>
