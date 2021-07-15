<script lang="ts">
import { Vue, Component, Prop, Action } from 'nuxt-property-decorator'
import { ReservationCancelAction } from '@store/reservations'

@Component
export default class ReservationConfirmModal extends Vue {
	status = false
	@Prop({ type: Object, required: true }) reservation!: any
	@Action('reservations/delete_reservation')
	$cancelReservation!: ReservationCancelAction

	cancelReservation() {
		return this.$cancelReservation(this.reservation.id)
			.then(res => {
				this.$store.commit('reservations/add', {
					...this.reservation,
					status: 'cancelled'
				})

				this.$notify.show({
					title: 'Cancellation complete.',
					type: 'success'
				})
			})
			.catch(() =>
				this.$notify.show({
					title: 'Failed Canceling Reservation',
					content:
						'We were not able to cancel your reservation. Please try again later or contact support.',
					type: 'alert'
				})
			)
			.finally(() => this.$modal.close())
	}
}
</script>

<template>
	<modal class="confirm-modal">
		<h3 class="question">Confirm cancellation?</h3>

		<form-button class="yes flat compact" @click="cancelReservation">
			<span>Yes</span>
		</form-button>
		<form-button class="no flat compact" @click="$modal.close()">
			<span>No</span>
		</form-button>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

// Deep Styles
.modal.confirm-modal::v-deep {
	.modal-body {
		@include flex(row);
		flex-wrap: wrap;
	}
}

// Base Styles
.modal.confirm-modal {
	.question {
		flex: 1 100%;
		text-align: center;
		font-size: 1.5em;
		margin: 0.5em 0px;
		color: $color-alert;
	}

	.form-button {
		flex: 1 1;

		@include horizontal-list-item;
	}
}
</style>
