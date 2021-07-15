<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { Component } from 'nuxt-property-decorator'

@Component
export default class EventDetailsModal extends ClubEvent.ProppedSource {
	previous_page_title: string = ''

	fetch() {
		return this.$fetchClubEvent()
	}

	mounted() {
		this.previous_page_title = document.title

		const event_title = this.club_event.title
		const head_meta = this.$store.app.head
		if (typeof head_meta === 'object' && head_meta.titleTemplate) {
			const title_template = head_meta.titleTemplate
			if (typeof title_template === 'function')
				document.title = title_template(event_title)
			else document.title = title_template.replace('%s', event_title)
		} else document.title = event_title
	}

	beforeDestroy() {
		document.title = this.previous_page_title
	}
}
</script>

<template>
	<modal class="event-details-modal" backdrop-only wait-to-open>
		<div class="modal-inner">
			<div class="modal-actions">
				<event-share-button />

				<form-button
					class="back flat no-border"
					@click="$modal.close('event-details-modal')"
				>
					<span>Close</span>
					<i class="fal fa-times"></i>
				</form-button>
			</div>

			<event-details />
		</div>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.modal.modal.event-details-modal::v-deep {
	.event-attendees-button {
		i {
			color: $color-primary;
		}
	}

	.event-image {
		@include on-mobile(375px) {
			width: 75px;
			height: 75px;
		}
	}
}

.modal.event-details-modal {
	@include flex(column, center, center);
	// @include glass-it(rgba(#000, 0.3));

	.modal-inner {
		@include grid(
			1fr minmax(auto, 800px) 1fr,
			minmax(5vh, 1fr) auto auto minmax(5vh, 1fr),
			'. . .' '. back .' '. content .' '. . .'
		);
		height: 100%;

		position: relative;
		top: 0px;
		transition: top 0.25s;

		@include on-mobile {
			@include grid(
				95%,
				minmax(5vh, 1fr) auto auto minmax(5vh, 1fr),
				'.' 'back' 'content' '.'
			);
			width: 100%;
			justify-content: center;
		}
	}

	.modal-actions {
		grid-area: back;
		justify-self: end;
		flex-shrink: 0;

		.back,
		.event-share-button {
			margin-bottom: -$border-radius;
		}
	}

	.event-details.card {
		// height: 100%;
		grid-area: content;
		// border-bottom-left-radius: 0px;
		// border-bottom-right-radius: 0px;
		overflow: hidden;

		// @include glass-it(
		// 	linear-gradient(
		// 		90deg,
		// 		rgba(255, 255, 255, 0.8) 0%,
		// 		rgba(255, 255, 255, 0.78) 25%,
		// 		rgba(211, 247, 255, 0.75) 75%,
		// 		rgba(211, 247, 255, 0.85) 100%
		// 	),
		// 	20px
		// );
		@include glass-it(white, 0px);
		// color: white;

		// @include above-mobile {
		// 	padding-bottom: 0px;
		// }
	}

	&.modal-enter-active {
		.modal-inner {
			top: 100%;
			transition-delay: 0.25s;
		}

		&.modal-enter-to {
			.modal-inner {
				top: 0px;
			}
		}
	}

	&.modal-leave-active {
		.modal-inner {
			top: 100%;
		}
	}
}

.modal.event-details-modal::v-deep {
	.event-details.card {
		.event-image {
			@include on-mobile {
				width: 100px;
				height: 100px;
				float: right;
				margin-left: 0.5em;
				margin-bottom: 0.5em;
			}

			@include on-mobile(400px) {
				width: 75px;
				height: 75px;
			}
		}

		.event-title {
			@include on-mobile {
				width: fit-content;
				margin: 0.25em 0px;
			}
		}

		.event-datetime {
			@include on-mobile {
				width: fit-content;
				margin-bottom: 0.5em;
			}
		}

		.event-actions-mobile {
			@include on-mobile(400px) {
				width: 100%;
				padding: 0px;
			}
		}

		.event-content {
			@include on-mobile {
				display: contents;
				overflow: hidden;
				max-height: unset;
			}
		}

		// .event-actions {
		// 	@include on-mobile {
		// 		position: sticky;
		// 		left: 0px;
		// 		bottom: 0px;
		// 		padding: 0.5em 1em;

		// 		// @include glass-it(
		// 		// 	linear-gradient(
		// 		// 		90deg,
		// 		// 		rgba(255, 255, 255, 0.8) 0%,
		// 		// 		rgba(255, 255, 255, 0.78) 25%,
		// 		// 		rgba(211, 247, 255, 0.75) 75%,
		// 		// 		rgba(211, 247, 255, 0.85) 100%
		// 		// 	),
		// 		// 	50px
		// 		// );
		// 		@include glass-it(rgba(white, 0.5), 50px);

		// 		border-top-left-radius: $border-radius;
		// 		border-top-right-radius: $border-radius;
		// 	}
		// }

		@include on-mobile {
			display: block;
			overflow: auto;
			padding: 14px 12px;
			padding-bottom: 0px;
		}
	}

	// .event-details.card.no-media {
	// 	.event-datetime {
	// 		@include on-mobile {
	// 			float: right;
	// 		}
	// 	}
	// }
}
</style>
