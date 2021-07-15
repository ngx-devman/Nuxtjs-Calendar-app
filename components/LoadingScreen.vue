<script lang="ts">
import { Vue, Component, Getter, Prop } from 'nuxt-property-decorator'

@Component
export default class LoadingScreen extends Vue {
	@Prop({ type: Boolean }) startIt!: boolean

	loading: boolean = false
	windowLoaded: boolean = false
	loadTimer: boolean = false

	remove_from_dom: boolean = false

	created() {
		if (!this.$route.fullPath.startsWith('/auth') || this.startIt) {
			this.start()
		}

		if (!this.$slots.default) {
			window.addEventListener('load', () => {
				this.windowLoaded = true
				this.finish()
			})
		}
	}

	start() {
		this.loading = true
		this.remove_from_dom = false

		if (!this.$slots.default) {
			setTimeout(() => {
				this.loadTimer = true
				this.finish()
			}, 1000)
		} else {
			setTimeout(() => {
				this.loadTimer = true
				this.finish()
			}, 1000)
		}
	}

	finish() {
		this.loading = false

		setTimeout(() => {
			this.remove_from_dom = true
		}, 2100)
	}
}
</script>

<template>
	<div
		v-show="!remove_from_dom"
		class="loading-screen"
		:class="{ hide: !loading }"
	>
		<div class="loading-inner">
			<spinner-atom />

			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.loading-screen {
	@include flex(column, center, center);
	width: 100vw;
	height: 100vh;

	position: fixed;
	left: 0px;
	top: 0px;
	z-index: 100;

	background-color: white;
	color: $color-primary;

	.loading-inner {
		@include flex(column, flex-start, center);

		span {
			font-size: 2em;
			margin-left: 1em;
		}
	}

	&.hide {
		opacity: 0;
		transition: opacity 1s 0.5s;
		pointer-events: none;

		.loading-icon-wrap {
			.loading-icon {
				// animation: loading-spin 0.75s infinite forwards;
				.dot {
					// width: 50vw;
					// height: 50vw;
					// opacity: 1;
				}
			}
		}
	}
}
</style>
