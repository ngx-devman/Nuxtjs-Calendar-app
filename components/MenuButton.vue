<script lang="ts">
import helpers from '@includes/helpers'
import { Vue, Component, Emit, Prop, PropSync } from 'nuxt-property-decorator'

const { is } = helpers

export const MenuButtonState = {
	OPENED: true,
	CLOSED: false
}

/**
 * TODO: setup so custom state variables can be used
 */
@Component
export default class MenuButton extends Vue {
	@PropSync('state', { type: Boolean, default: MenuButtonState.CLOSED })
	opened!: boolean

	get button_title() {
		return is(this.opened, MenuButtonState.OPENED) ? 'Open' : 'Close'
	}

	get button_class() {
		return is(this.opened, MenuButtonState.OPENED) ? 'opened' : 'closed'
	}
}
</script>

<template>
	<button
		class="menu-button"
		:class="button_class"
		:title="button_title"
		@click="opened = !opened"
	>
		<div class="menu-icon top" />
		<div class="menu-icon middle" />
		<div class="menu-icon bottom" />
	</button>
</template>

<style lang="scss" scoped>
@import '@sassy';

.menu-button {
	@include flex(column, center, center);
	width: 30px;
	height: 30px;

	position: relative;

	background-color: transparent;
	border: none;
	cursor: pointer;

	.menu-icon {
		width: 26px;
		height: 2px;

		position: absolute;
		left: 50%;
		transform: translateX(-50%);

		background-color: white;
		border-radius: 5px;
		transition: all 0.25s;

		$offset: 6px;

		&.top,
		&.bottom {
			z-index: 2;
		}

		&.top {
			top: $offset;
		}

		&.middle {
			z-index: 1;
			top: 50%;
			transform: translate(-50%, -50%);
			border-radius: 0px;
		}

		&.bottom {
			bottom: $offset;
		}
	}

	&.opened .menu-icon {
		&.top {
			top: 50%;
			transform: translate(-50%, -50%) rotate(135deg);
		}

		&.middle {
			opacity: 0;
		}

		&.bottom {
			bottom: 42%;
			transform: translate(-50%, -50%) rotate(-135deg);
		}
	}
}
</style>
