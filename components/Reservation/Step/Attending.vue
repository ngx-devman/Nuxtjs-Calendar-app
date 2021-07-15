<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class ReservationStepAttending extends Vue {}
</script>

<template>
	<div class="step-page step-1">
		<!-- <div class="out-text">
						<span v-if="no_guests">Just you? Wonderful!</span>
						<span v-else>Who's coming?</span>
					</div> -->

		<h1 class="question">Who will attend?</h1>

		<div class="divider" />

		<div class="answers">
			<form-button class="ghost" @click="$emit('answer', true)">
				Just Me
			</form-button>
			<form-button class="ghost" @click="$emit('answer', false)">
				I Have Guests
			</form-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.step-page.step-1 {
	.answers {
		@include flex(column, center, center);

		.form-button {
			@include above-mobile {
				@include vertical-list-item(1em);
			}

			@include below-tablet {
				@include horizontal-list-item(1em);
			}
		}

		@include below-tablet {
			flex-direction: row;
		}
	}
} // step 1 page
</style>
