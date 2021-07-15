<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import ClubReservation from '@includes/models/ClubReservation'
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

@Component
export default class PageEventsSingle extends ClubEvent.Source {
	get form_status() {
		return this.club_event.has_online_reservation && this.club_event_is_future
	}

	asyncData({ store, params }: Context) {
		const eventID = params.id
		return store
			.dispatch('events/fetch_single', eventID)
			.then(the_club_event => ({ the_club_event }))
			.catch(err => {
				console.error('Failed to get event', err)
			})
	}

	head() {
		return {
			title: this.club_event.title
		}
	}
}
</script>

<template>
	<page class="event-single">
		<div class="page-inner">
			<nuxt-link class="back" to="/">
				<form-button class="flat no-border">
					<span>
						<i class="far fa-chevron-left"></i>
						Back to Calendar
					</span>
				</form-button>
			</nuxt-link>

			<event-details :event="club_event" />
		</div>
	</page>
</template>

<style lang="scss" scoped>
@import '@sassy';

$tablet-width: 1100px;
$mobile-width: 876px;

.page.event-single {
	border-radius: $border-radius;
	overflow: hidden;
	padding-bottom: 0px;

	.page-inner {
		@include grid(
			1fr 800px 1fr,
			1fr auto auto 1fr,
			'. . .' '. back .' '. content .' '. . .'
		);
		height: 100%;

		@include on-mobile {
			@include grid(auto, 1fr auto auto 1fr, '.' 'back' 'content' '.');
		}
	}

	.back {
		grid-area: back;
		justify-self: end;
		flex-shrink: 0;

		margin-bottom: -$border-radius;

		// .form-button {
		// 	@include glass-it(rgba(#000, 0.1));
		// }

		span {
			@include flex(row, center, center);
			color: white;
			text-decoration: none;

			i {
				@include flex(column, center, center);
				margin-right: 1em;
				color: white;
				font-size: 1.25em;

				border-radius: 100%;
			}
		}

		@include tablet($tablet-width) {
			align-self: flex-end;
		}
	}

	.event-details {
		overflow: hidden;
		grid-area: content;

		@include glass-it(white, 0px);

		@media screen and (max-height: 650px), (max-width: $mobile-width) {
			&::v-deep .event-description {
				font-size: 15px;
			}
		}
	}

	@include on-mobile {
		overflow: hidden;
	}

	&.page-enter-active {
		.page-inner {
			position: relative;
			top: 100%;
			transition: top 0.25s;
		}

		&.page-enter-to {
			.page-inner {
				top: 0px;
			}
		}
	}

	&.page-leave-active {
		.page-inner {
			position: relative;
			top: 0%;
			transition: top 0.25s;
		}

		&.page-leave-to {
			.page-inner {
				top: 100%;
			}
		}
	}
}

.page.event-single::v-deep {
	.reservation-form::v-deep {
		.form-input {
			background-color: transparent;
			border: none;

			label {
				color: white;
			}

			.input-area {
				background-color: white;
			}
		}
	}

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
				margin: 0.25em 0px;
			}
		}

		.event-datetime {
			@include on-mobile {
				margin-bottom: 0.5em;
			}
		}

		.event-actions-mobile {
			@include on-mobile(400px) {
				width: 100%;
				padding: 0px;
			}
		}

		// .event-actions {
		// 	@include on-mobile {
		// 		position: sticky;
		// 		left: 0px;
		// 		bottom: 0px;
		// 		padding: 0.5em 1em;

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

			.event-content {
				display: contents;
				overflow: hidden;
				max-height: unset;
			}
		}
	}
}
</style>
