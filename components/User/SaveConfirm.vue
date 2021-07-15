<script lang="ts">
import { Vue, Component, Prop, Action } from 'nuxt-property-decorator'

@Component
export default class ReservationConfirmModal extends Vue {
	@Prop({ type: Boolean, default: true }) status!: any
}
</script>

<template>
	<modal class="confirm-modal">
		<div class="confirm-content">
			<div v-if="status" class="confirm-body">
				<b><h3 class="confirm-text succeed">Congrate!</h3></b>
				<b><h3 class="confirm-text succeed">Filter Saved Successfully!</h3></b>
			</div>
			<div v-else class="confirm-body">
				<b><h3 class="confirm-text warn">Oops!</h3></b>
				<b
					><h3 class="confirm-text warn">
						Failed to save filter. Try again!
					</h3></b
				>
			</div>
		</div>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.modal::v-deep {
	.modal-body {
		width: 200px;
		height: auto;
	}
}

.confirm-content {
	text-align: center;
	padding: 15px;
	.confirm-body {
		min-height: 60px;
		display: block;
		justify-content: center;
		align-items: center;
		.confirm-text {
			font-weight: 800;
		}
		.warn {
			color: $that-peach-darker;
		}
		.succeed {
			color: $that-green-success;
		}
	}
}
</style>
