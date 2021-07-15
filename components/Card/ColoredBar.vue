<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class CardColoredBar extends Vue {
	@Prop({ type: [String, Array], default: '' }) color!: string | string[]

	get isMultiColor() {
		return Array.isArray(this.color) && this.color.length > 1
	}

	get colorStyle() {
		if (!this.color) return ''
		else if (Array.isArray(this.color))
			return this.color
				.map((c, i) => {
					return `--card-bar-color${i === 0 ? '' : '-' + i}: ${c}`
				})
				.join(';')
		else return `--card-bar-color: ${this.color}`
	}
}
</script>

<template>
	<card
		class="card-colored-bar"
		:class="{
			'multi-color': isMultiColor,
			[`colors-${color.length}`]: isMultiColor
		}"
		:style="colorStyle"
	>
		<div class="card-content">
			<slot />
		</div>
	</card>
</template>

<style lang="scss" scoped>
@import '@sassy';

.card-colored-bar {
	@include flex(row, flex-start, stretch);

	&::before {
		content: '';

		width: 4px;

		margin-right: 15px;

		background-color: var(--card-bar-color, $color-primary);
		border-radius: $border-radius;
	}

	.card-content {
		flex: 1;
	}

	&.multi-color {
		&.colors-2 {
			&::before {
				background: linear-gradient(
					0deg,
					var(--card-bar-color) 45%,
					var(--card-bar-color-1) 55%
				);
			}
		}

		&.colors-3 {
			&::before {
				background: linear-gradient(
					0deg,
					var(--card-bar-color) 27%,
					var(--card-bar-color-1) 39%,
					var(--card-bar-color-1) 60%,
					var(--card-bar-color-2) 72%
				);
			}
		}
	}
}
</style>
