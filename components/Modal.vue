<script lang="ts">
import { Vue, Component, Getter, Ref, Prop } from 'nuxt-property-decorator'

@Component
export default class Modal extends Vue {
	@Prop({ type: String }) title!: string
	@Prop({ type: Boolean, default: false }) backdropOnly!: boolean
	@Prop({ type: Boolean, default: false }) waitToOpen!: boolean

	@Ref('modal') modalEl!: HTMLDivElement
	@Ref('modal_wrap') modalWrapEl!: HTMLDivElement

	classToggles = {
		closing: false,
		enter: true
	}

	beforeMount() {
		this.$modal.$on('close', () => {
			this.classToggles.closing = true

			setTimeout(() => {
				this.$modal.$emit('closed')
			}, 750)
		})

		this.$modal.$on('delayed-open', () => {
			this.classToggles.enter = false
		})
	}

	mounted() {
		if (!this.waitToOpen) {
			setTimeout(() => {
				this.classToggles.enter = false
			}, 100)
		}
	}
}
</script>

<template>
	<div
		ref="modal"
		class="modal"
		:class="classToggles"
		@click.self="$modal.close()"
	>
		<slot v-if="backdropOnly" />
		<div v-else ref="modal_wrap" class="modal-wrapper">
			<div class="modal-body">
				<div
					v-if="$slots['modal-header'] || $slots['modal-title']"
					class="modal-header"
				>
					<slot name="modal-header">
						<h3 v-if="$slots['modal-title']" class="modal-title">
							<slot name="modal-title" />
						</h3>
					</slot>
				</div>

				<slot />
			</div>

			<div class="modal-controls">
				<div
					v-if="$slots['modal-header'] || $slots['modal-title']"
					class="modal-header"
				>
					<slot name="modal-header">
						<h3 v-if="$slots['modal-title']" class="modal-title">
							<slot name="modal-title" />
						</h3>
					</slot>
				</div>

				<i
					class="modal-close fal fa-times"
					aria-hidden="true"
					@click="() => $modal.close()"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

@keyframes modalFadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes modalWrapFlyUp {
	from {
		top: 100%;
		opacity: 0;
	}
	to {
		top: 0px;
		opacity: 1;
	}
}

.modal {
	@include flex(column, center, center);
	width: 100%;
	height: 100%;

	position: absolute;
	left: 0px;
	top: 0px;
	z-index: 50;

	@include glass-it(rgba(#000, 0.43));
	opacity: 1;

	// animation: modalFadeIn 0.25s;
	// animation-fill-mode: forwards;
	transition: opacity 0.25s;

	// &:before {
	// 	content: '';
	// 	width: 100vw;
	// 	height: 100vh;

	// 	position: absolute;
	// 	left: 0px;
	// 	bottom: 0px;

	// 	@include glass-it(rgba(#000, 0.43));
	// }

	.modal-close {
		@include flex(column, center, center);
		padding: 0.5em;
		box-sizing: content-box;

		background-color: transparent;
		font-size: 1.2em;
		cursor: pointer;

		transition: background-color 0.25s, color 0.25s;

		&:hover {
			background-color: white;
			color: $color-primary;
		}
	}

	.modal-header {
		border-bottom: 1px solid $color-primary;

		.modal-title {
			color: $color-primary;
		}
	}

	.modal-wrapper {
		@include flex(row);
		max-width: 95vw;
		max-height: 95vh;

		position: relative;
		left: 0px;
		top: 0%;

		background-color: white;

		opacity: 1;
		border-radius: $border-radius;

		overflow: hidden;
		transition: top 0.25s, opacity 0.25s;

		.modal-body {
			max-width: 100%;
			flex-shrink: 1;
			padding: 0.5em;
			color: black;
		}

		.modal-controls {
			height: 100%;
			flex-shrink: 0;

			background-color: $color-primary;
			color: $color-primary-text;

			.modal-header {
				display: none;
			}
		}

		@media screen and (max-width: 365px) {
			@include flex(column);

			.modal-controls {
				@include flex(row, flex-end, center);
				width: 100%;
				height: auto;
			}
		}
	}

	&.fullscreen-glass {
		@include glass-it($blur: 50px);

		.modal-wrapper {
			display: grid;
			// width: 100%;
			// height: 100%;
			background: transparent;

			justify-items: center;
			grid-template-columns: 100%;
			grid-template-rows: auto 1fr;
			grid-template-areas:
				'controls'
				'content';

			border-radius: 0px;

			.modal-body {
				@include flex(column);
				width: fit-content;
				height: 100%;

				padding-left: 0px;
				padding-right: 0px;

				color: white;
				grid-area: content;

				.modal-header {
					display: none;
				}
			}

			.modal-controls {
				@include flex(row, flex-end, center);
				width: 100%;
				height: unset;
				background: transparent;
				grid-area: controls;

				.modal-header {
					display: inherit;
					width: auto;
					flex: 1;
					padding: 0px;

					margin: 0px;
					margin-right: 1em;
				}

				.modal-close {
					width: 30px;
					height: 30px;
					padding: 0px;

					border-radius: 100%;
					@include glass-it(rgba(white, 0), 0px);

					&:hover {
						@include glass-it(rgba(white, 0.75));
						transition: all 0.5s;

						* {
							transition: all 0.5s;
						}
					}
				}
			}
		}
	}

	&.modal-enter-to,
	&.modal-leave-to {
		transition: all 0.25s;

		.modal-wrapper {
			transition: all 0.5s;
		}
	}

	&.modal-enter-active {
		opacity: 0;
		// pointer-events: none;

		.modal-wrapper {
			opacity: 0;
			top: 100%;
		}

		&.modal-enter-to {
			opacity: 1;

			.modal-wrapper {
				top: 0px;
				opacity: 1;
				transition-delay: 0.25s;
			}
		}
	}

	&.modal-leave-active {
		opacity: 1;
		pointer-events: none;

		.modal-wrapper {
			top: 0%;
			opacity: 1;
		}

		&.modal-leave-to {
			opacity: 0;

			.modal-wrapper {
				top: 100%;
				// opacity: 0;
				transition-delay: 0s;
			}
		}
	}
}
</style>
