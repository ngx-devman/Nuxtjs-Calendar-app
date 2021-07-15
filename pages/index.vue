<script lang="ts">
import helpers from '@includes/helpers'
import { Vue, Component, Getter, Watch } from 'nuxt-property-decorator'

interface Filters {
	start_date: any
	end_date: any
	locations: any
	categories: any
}

@Component({
	head: {
		title: 'Calendar'
	}
})
export default class PageRootIndex extends Vue {
	@Getter('auth/user') user!: any

	showFiltersPanel: boolean = false
	showReservationsPanel: boolean = false

	feedTab: string = 'Events'
	start_date: string | false = false
	end_date = false
	locations: number[] | false = false
	event_type: number[] | false = []
	space: number[] | false = []
	get filters(): Filters {
		const filters: Filters = helpers.extract(this, [
			'start_date',
			'end_date',
			'locations'
		]) as any
		filters.categories = [this.event_type, this.space].flat(1).filter(i => i)

		return filters
	}

	created() {
		this.loadFilters(this.$store.getters.calendar_filters)
	}

	mounted() {
		this.$root.$on('clear-filters', () => {
			this.space = []
			this.locations = []
			this.event_type = []

			this.start_date = this.$moment().format()
			this.end_date = false

			if (this.$store.getters.favoritesFeed) {
				this.$store.commit('favoritesFeed', false)
			}
		})
	}

	destroyed() {
		const filters: any = helpers.extract(this, [
			'start_date',
			'end_date',
			'locations',
			'space',
			'event_type',
			'feedTab'
		])

		this.$store.commit('calendar_filters', filters)
	}

	loadFilters(filters: any) {
		const extracted = helpers.extract(filters, [
			'start_date',
			'end_date',
			'locations',
			'space',
			'event_type',
			'feedTab'
		])

		Object.assign(this, extracted)
	}

	@Watch('feedTab', { immediate: true })
	resetFiltersOnTabChange() {
		switch (this.feedTab) {
			case 'News':
				this.locations = false
				this.space = false
				this.event_type = false
				this.start_date = false
				this.end_date = false
				break
			case 'Events':
				this.space = []
				this.locations = []
				this.event_type = []

				this.start_date = this.$moment().format()
				this.end_date = false

				if (this.user && this.user.location) {
					this.locations = [this.user.location.id]
				}
		}
	}

	rangeClicked(date: any) {
		this.start_date = date.start
		this.end_date = date.end
	}

	panelClicked() {
		console.log("clikced")
		if (this.showFiltersPanel || this.showFiltersPanel) {
			this.showFiltersPanel = false
			this.showReservationsPanel = false
		}
	}
}
</script>

<template>
	<page class="calendar" @close-panels="panelClicked()">
		<div class="page-inner">
			<div class="page-column filters" :class="{ opened: showFiltersPanel }">
				<i class="close-panel fal fa-times" @click="showFiltersPanel = false" />

				<panel-event-calendar
					v-model="start_date"
					:start-date.sync="start_date"
					:end-date.sync="end_date"
				/>

				<panel-event-filters
					:tab="feedTab"
					:location.sync="locations"
					:event-type.sync="event_type"
					:space.sync="space"
				/>
			</div>

			<div
				class="page-column calendar-reservations"
				:class="{ opened: showReservationsPanel }"
			>
				<i
					class="close-panel fal fa-times"
					@click="showReservationsPanel = false"
				/>

				<panel-event-calendar
					v-model="start_date"
					:start-date.sync="start_date"
					:end-date.sync="end_date"
				/>
				<panel-event-reservations />
			</div>

			<div class="page-column feed">
				<panel-feed
					:tab.sync="feedTab"
					:filters.sync="filters"
					@open-filters="showFiltersPanel = true"
					@open-reservations="showReservationsPanel = true"
				/>
				<lazy-panel-event-reservations />
			</div>
		</div>
	</page>
</template>

<style lang="scss" scoped>
@import '@sassy';

.page.calendar {
	@include flex(row, center, center);
	position: relative;
	overflow: hidden;
	z-index: 1;

	.page-inner {
		display: grid;
		grid-template-columns: 275px 350px 1fr;
		column-gap: 1em;

		width: 100%;
		max-width: 1200px;
		height: 100%;

		overflow: hidden;

		.page-column {
			@include flex(column);
			height: 100%;

			overflow: hidden;

			& > .panel {
				width: 100%;
			}

			&.filters {
				.close-panel {
					display: none;
				}

				.panel-event-filters {
					flex: 1;
					&:only-child {
						height: 100%;
					}
				}

				.panel-event-calendar {
					display: none;
				}
			}

			&.calendar-reservations {
				.close-panel {
					display: none;
				}

				.panel-event-calendar {
					margin-bottom: 1em;
				}

				.panel-event-reservations {
					flex: 1;
				}
			}

			&.feed {
				min-width: 540px;

				.panel-event-reservations {
					display: none;
				}
			}
		}

		// Show the other calendar from here on
		@media screen and (max-width: 1350px), (max-height: 850px) {
			.page-column.filters {
				.panel-event-calendar {
					display: inherit;
					--day-number-size: 1.75em;
					flex: none;
					justify-content: initial;
					margin-bottom: 1em;
				}
			}
		}

		// Tablet mode
		@media screen and (min-width: 876px) and (max-width: 1350px) and (min-height: 850px) {
			grid-template-columns: 350px auto;

			.page-column {
				&.filters {
					.panel-event-filters {
						flex-shrink: 1;
					}
				}

				&.feed {
					width: 100%;
					min-width: auto;

					.panel-feed {
						flex-shrink: 1;
					}

					.panel-event-reservations {
						display: inherit;
						height: 35%;
						flex: none;
						margin-top: 1em;
					}
				}

				&.calendar-reservations {
					display: none;
				}
			}
		}

		// Allowing some more space between tablet and mobile
		@media screen and (min-width: 876px) and (max-width: 950px),
			(max-height: 850px) {
			grid-template-columns: 275px auto;
		}

		// Mobile
		@media screen and (max-width: 876px), (max-height: 850px) {
			@include flex(column);

			.page-column {
				&.filters,
				&.calendar-reservations {
					width: 350px;
					max-width: 100%;
					height: 100%;
					padding: 1em;

					position: absolute;
					left: -350px;
					bottom: 0px;
					z-index: 30;

					overflow: hidden;
					overflow-y: auto;
					@include glass-it($blur: 20px);

					.close-panel {
						display: block;
					}

					&::v-deep {
						// * {
						// 	color: white;
						// }

						.panel {
							@include glass-it(transparent, 0px);
						}

						.panel-header,
						.panel-body,
						.panel-body-btn {
							background: transparent;
						}

						.form-button.outline {
							border: none;
						}
					}
				}

				&.filters {
					@include flex(column);
					padding-right: 1em;
					border-top-right-radius: $border-radius;
					transition: left 0.25s;

					&.opened {
						left: 0px;
					}

					.close-panel {
						position: sticky;
						left: 100%;
						top: 0px;
					}

					.panel-event-calendar {
						max-width: 300px;
						margin-top: 0px;
						margin-bottom: 1em;

						&::v-deep {
							.day {
								&.selected {
									.day-number {
										color: white;
									}
								}
							}

							.day.current,
							.day.selected {
								.day-number {
									border-color: white;
									background-color: white;
									color: $color-primary;
								}
							}

							.calendar.has-range {
								.day.selected {
									border-color: white;

									.day-number {
										border-color: transparent;
										background-color: transparent;
										color: white;
									}

									&.start,
									&.end,
									&.current {
										background-color: white;
										.day-number {
											color: $color-primary;
											background-color: white;
										}
									}
								}
							}
						}
					}

					.panel-event-filters {
						flex: none;
					}
				}

				&.calendar-reservations {
					display: grid;
					grid-template-columns: auto [close] 1fr [items];
					align-items: stretch;
					justify-content: center;

					left: inherit;
					right: -350px;

					border-top-left-radius: $border-radius;
					transition: right 0.25s;

					.panel-event-calendar {
						display: none;
					}

					.panel-event-reservations {
						&::v-deep {
							.panel-header,
							.panel-body,
							.event-reservations {
								padding: 0px;
							}
						}
					}

					&.opened {
						right: 0px;
					}
				}

				&.feed {
					min-width: unset;
					width: 100%;
				}
			}
		}
	}

	@media screen and (max-width: 876px) {
		padding: 10px;
	}
}
</style>
