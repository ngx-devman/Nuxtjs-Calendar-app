<script lang="ts">
import { Vue, Component, PropSync, Prop } from 'nuxt-property-decorator'

@Component
export default class ReservationGuests extends Vue {
	@Prop({ type: Boolean, default: false }) edit!: boolean

	@PropSync('guestList', { type: Array, required: true })
	guests!: any[]

	removeGuest(guestIndex: any) {
		this.guests = this.guests.filter((g, i) => i !== guestIndex)
	}
}
</script>

<template>
	<div class="reservation-guests">
		<template v-for="(guest, i) in guests">
			<div
				:key="i"
				class="reservation-guest"
				@click="$emit('guest-clicked', guest)"
			>
				<div class="item-index">#{{ i + 1 }}</div>

				<template v-if="guest.id">
					<!-- <div class="guest-name">
						{{ guest.first_name }}
						{{ guest.last_name }}
					</div> -->
					<form-input
						v-if="!guest.is_anonymous"
						:value="`${guest.first_name} ${guest.last_name}`"
						name="guest_name"
						placeholder="Guest's name"
						class="flat no-label no-padding guest-name"
						readonly
					/>
				</template>
				<template v-else>
					<form-input
						v-if="!guest.is_anonymous"
						v-model="guest.name"
						name="guest_name"
						placeholder="Guest's name"
						class="flat no-label no-padding guest-name"
						minlength="1"
						maxlength="25"
						:required="edit"
						:readonly="!edit"
					/>
					<div v-else class="guest-name">
						<span>TBD</span>
					</div>

					<div class="is_anonymous" title="Toggle TBD">
						<form-switch
							v-if="edit"
							v-model="guest.is_anonymous"
							name="is_anonymous"
							class="rounded tbd"
						/>
						<!-- <label>TBD</label> -->
					</div>
				</template>

				<div v-if="edit" class="guest-actions">
					<form-button class="flat icon remove" @click="() => removeGuest(i)">
						<i class="fas fa-trash"></i>
					</form-button>
				</div>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.reservation-guests {
	@include flex(column);

	.reservation-guest {
		height: 50px;
		display: grid;
		grid-template-columns: [id] 30px [name] 1fr [unkown] auto [actions] auto;
		column-gap: 0.5em;
		align-items: center;
		justify-items: center;

		width: 100%;
		padding: 0.5em;

		@include vertical-list-item;

		background-color: white;
		color: $that-gray;

		border-radius: $border-radius;
		box-shadow: 0px 2px 6px rgba(#000, 0.1);

		.item-index {
			grid-area: id;
		}

		.guest-name {
			@include flex(row, flex-start, center);
			width: 100%;
			min-width: unset;
			height: 100%;
			grid-area: name;
		}

		.is_anonymous {
			@include flex(row, center, center);
			grid-area: unkown;

			.tbd {
				transform: scale(0.5);
			}
		}

		.guest-actions {
			grid-area: actions;

			.remove {
				--button-icon-size: 30px;
				background-color: $that-peach;
				font-size: 0.7em;
				font-weight: normal;
			}
		}

		// @media screen and (max-width: 415px) {
		// 	grid-template-columns: auto 1fr;
		// 	grid-template-rows: auto auto;
		// 	column-gap: 0.5em;
		// 	justify-items: end;

		// 	.item-index {
		// 		grid-area: 1 / 1;
		// 	}

		// 	.guest-name {
		// 		grid-area: 2 / 1 / 2 / 4;
		// 		height: auto;
		// 		border: 0px;
		// 		margin-top: 0.5em;
		// 	}

		// 	.is_anonymous {
		// 		grid-area: 1 / 2;
		// 	}

		// 	.guest-actions {
		// 		grid-area: 1 / 3;
		// 		align-self: end;
		// 	}
		// }
	}
}
</style>
