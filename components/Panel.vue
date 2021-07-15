<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Panel extends Vue {}
</script>

<template>
	<div class="panel">
		<template v-if="$slots['panel-header']">
			<div class="panel-header">
				<slot name="panel-header" />
			</div>
		</template>

		<div class="panel-body">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.panel::v-deep {
	.panel-title {
		font-family: $sorts-font;
		font-weight: 400;
		font-style: normal;
		font-size: 24px;
		line-height: 34.51px;
		text-align: center;
	}
}

.panel {
	@include flex(column);
	@include glass-it(
		linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.6) 0%,
			rgba(211, 247, 255, 0.81) 100%
		),
		2px
	);

	// box-shadow: 0px 5px 10px rgba(#000, 0.43);
	border-radius: $border-radius;
	overflow: hidden;

	.panel-header,
	.panel-body {
		width: 100%;
	}

	.panel-header {
		padding: 15px 26px;
		color: #646464;

		// background: linear-gradient(
		// 	90deg,
		// 	rgba(255, 255, 255, 0.6) 0%,
		// 	rgba(211, 247, 255, 0.81) 100%
		// );

		border-top-left-radius: $border-radius;
		border-top-right-radius: $border-radius;
	}

	.panel-body {
		flex: 1;

		border-bottom-left-radius: $border-radius;
		border-bottom-right-radius: $border-radius;

		overflow: hidden;
		overflow-y: auto;
	}
}

.panel.solid {
	background: $color-primary;
}

.panel.solid-header {
	.panel-header {
		background-color: $color-primary;
		color: $color-primary-text;
	}
}

.panel.glass-header {
	background-color: transparent;

	.panel-header {
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.6) 0%,
			rgba(211, 247, 255, 0.81) 100%
		);
	}

	.panel-body {
		@include glass-it(
			linear-gradient(
				90deg,
				rgba(255, 255, 255, 0.6) 0%,
				rgba(211, 247, 255, 0.81) 100%
			),
			2px
		);
	}

	&.solid {
		.panel-body {
			background: $color-primary;
		}
	}
}
</style>
