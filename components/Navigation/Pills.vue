<script lang="ts">
import {
	Vue,
	Component,
	VModel,
	Model,
	Prop,
	Watch
} from 'nuxt-property-decorator'

@Component
export default class NavigationPills extends Vue {
	@VModel() selected!: string
	@Prop({ type: Array, required: true }) tabs!: string[]
}
</script>

<template>
	<div class="navigation-pills">
		<template v-for="(tab, i) in tabs">
			<form-button
				:key="i"
				class="nav-pill flat outline compact"
				:class="{ active: selected === tab }"
				@click="selected = tab"
			>
				{{ tab }}
			</form-button>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.navigation-pills {
	@include flex(row);
	// padding: 0.5em;

	@include glass-it(
		linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.6) 0%,
			rgba(211, 247, 255, 0.81) 100%
		),
		2px
	);

	border-radius: 5em;

	.nav-pill {
		height: 100%;
		border: none;

		@include horizontal-list-item(0.25em);
		background-color: transparent;
		color: #646464;

		border-radius: 5em;

		&.active {
			background-color: $color-primary;
			color: $color-primary-text;
		}
	}
}
</style>
