<script lang="ts">
import {
	ReservationSetMutation,
	ReservationsFetchAction
} from '@store/reservations'
import {
	Vue,
	Component,
	Action,
	Watch,
	Prop,
	Getter,
	Mutation
} from 'nuxt-property-decorator'

@Component
export default class PanelEventReservations extends Vue {
	@Prop({ type: [Object, Boolean], default: false }) filters!: any

	@Getter('reservations/items') reservations!: any[]
	@Mutation('reservations/set') $setReservations!: ReservationSetMutation
	@Action('reservations/fetch') $fetchReservations!: ReservationsFetchAction

	page: number = 1
	status: string = 'reserved'

	get items() {
		return this.reservations.filter((i: any) => i.status !== 'cancelled')
	}

	mounted() {
		if (!this.reservations.length) {
			this.fetchReservations()
		}
	}

	@Watch('status')
	statusChanged() {
		this.page = 1
		this.fetchingItems = false
		this.fetchReservations(true)
	}

	fetchingItems: boolean = false
	@Watch('filters')
	fetchReservations(replace: boolean = true) {
		if (this.fetchingItems) return Promise.reject(new Error('fetching'))
		this.fetchingItems = true
		const filters = {
			...this.filters,
			page: this.page,
			status: this.status
		}

		if (replace) {
			this.$setReservations([])
		}

		if (filters.status === 'reserved')
			filters.event_start_date = this.$moment().format('YYYY-MM-DD')

		return this.$fetchReservations({ filters })
			.then(() => {
				this.$nextTick().then(() => {
					this.fetchingItems = false
				})
			})
			.catch(err => {
				console.error('failed fetching reservations', err)

				setTimeout(() => {
					this.fetchingItems = false
				}, 5000)

				throw err
			})
	}

	nextPage() {
		this.page += 1
		return this.fetchReservations(false).catch(() => {
			this.page -= 1
		})
	}
}
</script>

<template>
	<panel class="event-reservations panel-event-reservations solid-header">
		<template #panel-header>
			<h5 class="panel-title">My Reservations</h5>
			<div class="panel-body-btn">
				<form-button
					class="flat filter-btn"
					:class="{ selected: status === 'reserved' }"
					@click="status = 'reserved'"
				>
					<span class="btn-title">Reserved</span>
				</form-button>
				<span>|</span>
				<form-button
					class="flat filter-btn"
					:class="{ selected: status === 'waitlist' }"
					@click="status = 'waitlist'"
				>
					<span class="btn-title">Waitlist</span>
				</form-button>
				<span>|</span>
				<form-button
					class="flat filter-btn"
					:class="{ selected: status === 'cancelled' }"
					@click="status = 'cancelled'"
				>
					<span class="btn-title">Canceled</span>
				</form-button>
			</div>
		</template>

		<scroll-notifier v-if="reservations.length" @end="nextPage">
			<div class="event-reservations">
				<template v-if="status !== 'reserved'">
					<template v-for="reservation in reservations">
						<reservation-card
							:key="reservation.id"
							:reservation="reservation"
						/>
					</template>
				</template>
				<template v-else>
					<template v-for="reservation in items">
						<reservation-card
							:key="reservation.id"
							:reservation="reservation"
						/>
					</template>
				</template>
			</div>
		</scroll-notifier>

		<div v-else-if="fetchingItems" class="fetching-items">
			<spinner-atom />
		</div>

		<div v-else class="no-items">
			<span>No reservations to show</span>
		</div>
	</panel>
</template>

<style lang="scss" scoped>
@import '@sassy';

.panel.event-reservations::v-deep {
	.panel-header {
		padding: 15px 26px 0 26px;

		.btn-title {
			font-weight: 400;
		}
	}
	.panel-body {
		padding: calc(13px / 2);
		overflow: hidden;
	}
}

.panel.event-reservations {
	.event-reservations {
		width: 100%;
		height: 100%;
		padding: calc(13px / 2);

		overflow: hidden;
		overflow-y: auto;

		.reservation-card {
			@include vertical-list-item();
		}
	}

	.filter-btn {
		&.selected {
			font-style: italic;

			.btn-title {
				font-weight: bold;
			}
		}
	}

	.fetching-items,
	.no-items {
		@include flex(column, center, center);
		height: 100%;
		color: $that-gray;
	}

	.fetching-items {
		@keyframes spinner-fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		.spinner-atom {
			--atom-center-color: white;

			animation: spinner-fade-in 0.5s;
			animation-fill-mode: forwards;
		}
	}
}
</style>
