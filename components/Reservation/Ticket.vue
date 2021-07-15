<script lang="ts">
import ClubReservation from '@includes/models/ClubReservation'
import { Component, Watch } from 'nuxt-property-decorator'

@Component({
	inheritAttrs: false
})
export default class ReservationTicket extends ClubReservation.Injected {
	get quantity(): number {
		return (this.club_ticket as any).ticket.quantity
	}

	set quantity(v) {
		;(this.club_ticket as any).ticket.quantity = v
	}

	@Watch('quantity')
	checkQuantity() {
		const ticket = this.club_ticket as any
		const quantity = Number(this.quantity)

		if (ticket.maximum_purchase && quantity > ticket.maximum_purchase) {
			this.quantity = ticket.maximum_purchase
		} else if (quantity > 99) this.quantity = 99
		else if (
			isNaN(quantity) ||
			quantity < 0 ||
			typeof quantity === 'undefined'
		) {
			this.quantity = 0
		}
	}
}
</script>

<template>
	<ticket-item
		v-bind="$attrs"
		:ticket.sync="club_ticket.ticket"
		:input-props="{ max: club_ticket.maximum_purchase }"
	/>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
