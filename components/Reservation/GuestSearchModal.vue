<script lang="ts">
import { Vue, Component, Prop, Watch, PropSync } from 'nuxt-property-decorator'

@Component
export default class ReservationGuestSearchModal extends Vue {
	@Prop({ type: Function, required: true }) userSelect!: any
	user: any = {}

	@Prop({ type: Array })
	reservationGuests!: any[]

	searchTimer: any = false
	search: string = ''
	page: number = 1
	users: any[] = []
	guests: any[] = []

	mounted() {
		if (this.reservationGuests) {
			this.guests.push(...this.reservationGuests)
		}

		this.$modal.$once('close', () => {
			this.userSelect(this.guests)
		})
	}

	fetchingUsers: boolean = false
	fetchUsers(replace = true) {
		if (this.fetchingUsers) return Promise.reject(new Error('fetching'))
		if (!this.search || !this.search.length)
			return Promise.reject(new Error('no search!'))
		this.fetchingUsers = true

		return this.$store
			.dispatch('members/fetch', { search: this.search, page: this.page })
			.then(res => {
				const users = res.data.filter((i: any) => i.member_id)

				if (replace) this.users = users
				else this.users.push(...users)

				this.$nextTick().then(() => {
					this.fetchingUsers = false
				})
			})
			.catch(err => {
				setTimeout(() => {
					this.fetchingUsers = false
				}, 5000)

				throw err
			})
	}

	@Watch('search')
	searchUpdated() {
		this.page = 1
		this.users = []

		clearTimeout(this.searchTimer)
		this.searchTimer = setTimeout(() => {
			this.fetchUsers().catch(() => null)
		}, 250)
	}

	nextPage() {
		this.page += 1

		return this.fetchUsers(false).catch(() => {
			this.page -= 1
		})
	}

	selectUser(v: any) {
		if (this.guests.length < 5)
			this.guests = [{ ...v, member: v.member_id }, ...this.guests]
		this.search = ''
		this.page = 1
	}

	addGuest() {
		if (this.guests.length >= 5) return
		this.guests = [
			{
				is_anonymous: true
			},
			...this.guests
		]
	}

	removeGuest(guestIndex: any) {
		this.guests = this.guests.filter((g, i) => i !== guestIndex)
	}
}
</script>

<template>
	<modal class="reservation-guest-search-modal">
		<!-- <h2>Event Reservation Guests</h2> -->

		<div class="reservation-guests-actions">
			<form-search
				:search.sync="search"
				:results="users"
				@results-end="nextPage"
				@select-result="selectUser"
			>
				<template #result="{ item }">
					{{ item.first_name }} {{ item.last_name }}
				</template>
			</form-search>

			<h4>OR</h4>

			<form-button
				class="flat compact add-guest"
				:disabled="guests.length >= 5"
				@click="addGuest"
			>
				<span>Add Guest</span>
			</form-button>
		</div>

		<div class="reservation-guests-wrap">
			<div v-if="guests && guests.length" class="reservation-guests">
				<template v-for="(guest, i) in guests">
					<div :key="i" class="reservation-guest">
						<div class="item-index" style="flex: 0">#{{ i + 1 }}</div>

						<template v-if="guest.id">
							<div class="guest-name">
								{{ guest.first_name }}
								{{ guest.last_name }}
							</div>
						</template>
						<template v-else>
							<form-input
								v-if="!guest.is_anonymous"
								v-model="guest.name"
								name="guest_name"
								placeholder="Guest's name"
								class="flat no-label no-padding guest-name"
								required
							/>
							<div v-else class="guest-name">
								<span>TBD</span>
							</div>

							<div class="is_anonymous">
								<form-switch
									v-model="guest.is_anonymous"
									name="is_anonymous"
									class="rounded tbd"
								/>
								<label>TBD</label>
							</div>
						</template>

						<div class="guest-actions">
							<form-button
								class="flat icon remove"
								@click="() => removeGuest(i)"
							>
								<i class="fas fa-minus-circle"></i>
							</form-button>
						</div>
					</div>
				</template>
			</div>

			<div v-else class="no-guests">
				<span>No guests added.</span>
			</div>
		</div>

		<form-button class="save-btn flat" @click="$modal.close">
			<span>Save</span>
		</form-button>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.reservation-guest-search-modal::v-deep {
	.modal-body {
		@include flex(column, flex-start, stretch);
		width: 500px;
		height: 60vh;
	}
}

.reservation-guest-search-modal {
	// @include flex(column, stretch);

	.reservation-guests-actions {
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-flow: column;
		column-gap: 0.5em;
		align-items: stretch;

		margin-bottom: 1em;

		h4 {
			@include flex(column, center, center);
			font-family: inherit;
			color: $color-selectbox-text;
		}

		.add-guest {
			padding: 0.5em 1em;
		}

		@media screen and (max-width: 350px) {
			font-size: 0.7em;

			.form-search,
			.form-button {
				font-size: 1em;
			}
		}
	}

	.reservation-guests-wrap {
		flex: 1;
		overflow: hidden;
		overflow-y: auto;

		.reservation-guests {
			display: grid;
			grid-auto-flow: row;
			row-gap: 0.5em;

			.reservation-guest {
				display: grid;
				grid-template-columns: [id] 10% [name] 1fr [unkown] auto [actions] auto;
				align-items: center;
				justify-items: center;

				padding: 0.5em;

				border-radius: $border-radius;
				box-shadow: 0px 2px 6px rgba(#000, 0.1);

				.item-index {
					grid-area: id;
					color: $that-gray;
				}

				.guest-name {
					@include flex(row, flex-start, center);
					width: 100%;
					height: 100%;
					grid-area: name;
				}

				.is_anonymous {
					@include flex(row, center, center);
					grid-area: unkown;
					margin-right: 0.5em;

					.tbd {
						transform: scale(0.7);
					}
				}

				.guest-actions {
					grid-area: actions;

					.remove {
						--button-icon-size: 30px;
						background-color: $that-peach;
						font-size: 1em;
						font-weight: normal;
					}
				}

				@media screen and (max-width: 415px) {
					grid-template-columns: auto 1fr;
					grid-template-rows: auto auto;
					column-gap: 0.5em;
					justify-items: end;

					.item-index {
						grid-area: 1 / 1;
					}

					.guest-name {
						grid-area: 2 / 1 / 2 / 4;
						height: auto;
						border: 0px;
						margin-top: 0.5em;
					}

					.is_anonymous {
						grid-area: 1 / 2;
					}

					.guest-actions {
						grid-area: 1 / 3;
						align-self: end;
					}
				}
			}
		}

		.no-guests {
			@include flex(column, center, center);
			width: 100%;
			padding: 1em;

			color: $that-gray;
		}
	}

	.save-btn {
		align-self: flex-end;
	}
}
</style>
