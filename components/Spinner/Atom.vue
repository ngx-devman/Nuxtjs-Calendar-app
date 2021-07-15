<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class SpinnerAtom extends Vue {}
</script>

<template>
	<div class="spinner-atom">
		<div class="loading-icon">
			<div class="dot" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

@keyframes loading-spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(365deg);
	}
}

@keyframes flyleft {
	from {
		right: -200%;
	}
	to {
		right: 200%;
	}
}

@keyframes flyright {
	from {
		left: -200%;
	}
	to {
		left: 200%;
	}
}

.spinner-atom {
	@include flex(row, center, center);
	width: 100px;
	height: 100px;

	.loading-icon,
	.loading-icon:before,
	.loading-icon:after {
		content: ' ';
		width: 20px;
		height: 20px;

		border-radius: 100%;
		opacity: 0.7;
		transition: all 2s, border-radius 0s, opacity 1s;
	}

	.loading-icon {
		position: relative;
		z-index: 2;

		animation: loading-spin 2s infinite;
		animation-timing-function: linear;

		.dot {
			width: 100%;
			height: 100%;

			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			background-color: var(--atom-center-color, #{$color-primary});
			border-radius: 100%;
			opacity: 0.7;

			transition: all 2s, border-radius 0s, opacity 1s;
			// box-shadow: 0px 0px 1em 1em rgba($color-primary, 1);
		}

		&:before,
		&:after {
			position: absolute;
			top: 0px;
			z-index: -2;
		}

		&:before {
			left: -200%;
			background-color: var(--atom-one-color, #c5d0a6);
			animation: flyright 1s infinite;
			animation-fill-mode: both;
			animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
			animation-direction: alternate;
		}

		&:after {
			right: -200%;
			background-color: var(--atom-two-color, #ebca9e);
			animation: flyleft 1s infinite;
			animation-fill-mode: both;
			animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
			animation-direction: alternate;
		}
	}
}
</style>
