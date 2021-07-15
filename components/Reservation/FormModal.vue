<script lang="ts">
import _ from 'lodash'
import {
	Component,
	PropSync,
	ProvideReactive,
	Watch
} from 'nuxt-property-decorator'
import ClubReservation from '@includes/models/ClubReservation'

@Component
export default class ReservationFormModal extends ClubReservation.ProppedSource {
	@ProvideReactive('step')
	get step() {
		return this.$route.hash.replace('#', '')
	}

	set step(hash: string) {
		this.$router.push({ hash })
	}

	@ProvideReactive()
	no_guests: boolean = true

	get steps(): string[] {
		const event = this.club_reservation.event
		const time_slots = event.time_slots
		const steps: any = [
			'whos-attending',
			'add-guests',
			'guest-questions',
			'host-questions',
			'tickets',
			'confirm'
		]

		if (event.min_per_reservation > 0) {
			this.no_guests = false
			if (this.step === steps[0]) this.step = 'add-guests'
			steps[0] = false
		}

		if (this.no_guests || this.club_event_is_ticket_only) {
			steps[1] = false
		}

		if (
			!this.club_reservation_questions('guests').length ||
			this.club_event_is_ticket_only
		) {
			steps[2] = false
		}

		if (!this.club_event.is_allowed_guests) {
			steps[0] = false
			steps[1] = false
			steps[2] = false
		}

		if (
			!this.club_reservation_questions('host').length &&
			(!time_slots || !time_slots.length)
		) {
			steps[3] = false
		}

		if (!event.event_tickets || !event.event_tickets.length) {
			steps[4] = false
		} else if (this.club_event_is_ticket_only) {
			steps[0] = false
		}

		return steps.filter((i: any) => i)
	}

	mounted() {
		const event = this.club_reservation.event
		if (event.min_per_reservation > 0) {
			this.no_guests = false
			if (this.step === this.steps[0]) this.step = 'add-guests'
		}

		this.$router.push({ hash: this.steps[0] })
	}

	destroyed() {
		this.$router.push({ hash: '' })
	}

	// @Watch('step', { immediate: true })
	// checkStep(step: string) {
	// 	if (!step) this.step = this.steps[0]
	// }

	answerStepOne(guests: boolean) {
		this.no_guests = guests
		if (this.no_guests) this.club_reservation.guests = []
		this.$nextTick().then(() => this.nextStep())
	}

	nextStep() {
		const current_step_index = this.steps.findIndex(s => s === this.step)
		if (current_step_index < 0) {
			alert("I don't know where to send you next :(")
			this.step = this.steps[0]
		}

		if (current_step_index >= this.steps.length) return
		this.step = this.steps[current_step_index + 1]
	}

	submitReservation() {
		this.step = 'submit'
		return this.$createReservation()
			.then(() => {
				this.step = 'created'
			})
			.catch(() => {
				this.step = 'error'
			})
	}
}
</script>

<template>
	<modal class="reservation-form fullscreen-glass">
		<form-component class="steps-wrap">
			<transition name="steps-ani" class="steps-wrap" :duration="2500">
				<reservation-step-attending
					v-if="step === 'whos-attending'"
					:key="step"
					@answer="answerStepOne"
				/>

				<reservation-step-add-guests
					v-if="step === 'add-guests'"
					:key="step"
					@next="nextStep"
				/>

				<reservation-step-guest-questions
					v-if="step === 'guest-questions'"
					:key="step"
					@next="nextStep"
				/>

				<reservation-step-host-questions
					v-if="step === 'host-questions'"
					:key="step"
					@next="nextStep"
				/>

				<reservation-step-tickets
					v-if="step === 'tickets'"
					:key="step"
					@next="nextStep"
				/>

				<reservation-step-confirm
					v-if="step === 'confirm'"
					:key="step"
					@next="submitReservation"
				/>

				<div v-if="step === 'submit'" :key="step" class="step-page submitting">
					<div class="question" style="margin-right: 2em">
						<spinner-atom />
					</div>

					<div class="answers">
						<h2>Submitting reservation...</h2>
					</div>
				</div>

				<div v-if="step === 'created'" :key="step" class="step-page created">
					<div class="question" style="text-align: center">
						<h2>Reservation complete!</h2>
						<p>
							You can view/manage your reservations on the calendar
							<nuxt-link to="/">home page</nuxt-link>.
						</p>

						<form-button
							class="ghost compact"
							style="margin-top: 2em"
							@click="$modal.close()"
						>
							Close
						</form-button>
					</div>
				</div>
				<div v-if="step === 'error'" :key="step" class="step-page error">
					<div class="question" style="text-align: center">
						<h2>Reservation Error</h2>
						<p>
							We were unable to create your reservation. Please contact your
							member services team for assistance.
						</p>

						<form-button
							class="ghost compact"
							style="margin-top: 2em"
							@click="$modal.close()"
						>
							Close
						</form-button>
					</div>
				</div>
			</transition>
		</form-component>

		<paging-dots
			v-show="!['submit', 'created'].includes(step)"
			:pages="steps"
			:current.sync="step"
			no-controls
		/>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.modal.reservation-form.fullscreen-glass::v-deep {
	--input-radio-mark-color: #ebca9e;
	--input-radio-mark-color-background: white;
	--divider-title-line-color: white;

	// @include glass-it(rgba($color-primary, 0.75), $blur: 15px);

	.modal-wrapper {
		width: 100%;
		height: 100%;

		.modal-body {
			@include flex(column, flex-start, center);
			width: 100%;

			overflow: hidden;
		}
	}

	.form-input {
		background-color: transparent;
		border: none;

		.input-label {
			color: white;
		}
	}

	.form-button:not(.query) {
		color: white;
	}

	// .form-select {
	// 	.input-area {
	// 		background-color: transparent;
	// 		border: 1px solid white;

	// 		select,
	// 		select > option {
	// 			color: white;
	// 			font-weight: bold;
	// 		}
	// 	}
	// }

	.step-actions {
		@include flex(row, flex-start, center);
		width: 100%;
		margin-top: 2em;

		.next {
			flex-shrink: 0;
		}

		.skip {
			margin-left: 1em;
			font-style: italic;
			text-decoration: underline;
			font-weight: normal;
		}

		@include below-tablet {
			@include flex(row-reverse, flex-start, center);
			margin-bottom: 1em;
		}
	}
}

.step-page::v-deep {
	@include flex(row, center, center);
	width: 100%;
	max-height: 100%;
	overflow: hidden;
	overflow-y: auto;

	.question {
		max-width: 350px;

		@include on-mobile {
			max-width: 100%;
			text-align: center;
		}
	}

	.divider {
		width: 1px;
		height: 75vh;
		max-height: 350px;

		margin: 0px 4em;

		background-color: white;
		flex-shrink: 0;

		transition: height 0.25s;

		@include below-tablet {
			width: 75vw;
			height: 1px;
			margin: 0.75em 0px;
			transition: width 0.25s;
		}
	}

	.answers {
		max-height: 100%;
		overflow: auto;
	}

	.guest-count,
	.out-text {
		@include flex(column, center, center);
		width: 100%;

		text-align: center;

		span {
			display: block;
			margin-bottom: 0.5em;
		}

		p {
			font-style: italic;
			font-size: 0.9em;
		}
	}

	.out-text {
		position: absolute;
		left: 0%;
		top: 100%;
		transform: translate(0%, 0%);
		width: fit-content;
		max-width: 90%;
		left: 50%;
		top: 200%;
		opacity: 0;
		transform: translate(-50%, 0%);
		font-style: italic;
	}

	@include below-tablet {
		@include flex(column, flex-start, center);

		&.created,
		&.error {
			@include flex(column, center, center);
		}

		&.step-1 {
			@include flex(column, center, center);
		}
	}
} // step page

.modal.reservation-form.fullscreen-glass::v-deep {
	overflow-y: auto;

	.steps-wrap {
		@include flex(column, center, center);
		width: 100%;
		height: 100%;
		flex: 1;

		position: relative;
		overflow: hidden;
	} // steps wrap

	.paging-dots {
		@include below-tablet {
			margin-top: 1em;
		}
	}
}

.modal.reservation-form .steps-wrap::v-deep .step-page {
	$full-duration: 1.5s;
	$page-duration: calc(#{$full-duration} / 2);

	&.steps-ani-enter-active,
	&.steps-ani-leave-active {
		// width: 100%;
		// height: 100%;
		overflow: hidden;

		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);

		* {
			transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
		}

		.question,
		.answers {
			position: relative;
			top: 0px;
		}

		.out-text {
			// transition-timing-function: ease;
			transition: all calc(#{$page-duration} / 3.4);
		}
	}

	&.steps-ani-enter-active {
		opacity: 0;
		transition: opacity 0.25s $page-duration;

		$top-duration: calc(#{$page-duration} / 1.5);
		$opacity-duration: calc(#{$top-duration} / 2);

		.question {
			opacity: 0;
			top: 150px;
			transition: top $top-duration $page-duration,
				opacity $opacity-duration $page-duration;
		}

		.divider {
			height: 0px;
			transition: height $opacity-duration calc(#{$page-duration} + 0.15s);

			@include below-tablet {
				height: inherit;
				width: 0px;
				transition: width $opacity-duration calc(#{$page-duration} + 0.15s);
			}
		}

		.answers {
			top: 250px;
			opacity: 0;
			transition: top $top-duration calc(#{$page-duration} + 0.2s),
				opacity $opacity-duration calc(#{$page-duration} + 0.2s);
		}

		&.steps-ani-enter-to {
			opacity: 1;

			.question,
			.answers {
				opacity: 1;
				top: 0px;
			}

			.divider {
				height: 75vh;

				@include below-tablet {
					height: 1px;
					width: 75vw;
				}
			}
		}
	}

	&.steps-ani-leave-active {
		opacity: 1;
		transition: opacity 0.25s $page-duration;

		$top-duration: calc(#{$page-duration} / 1.5);
		$opacity-duration: calc(#{$top-duration} / 3);

		.out-text {
			top: 50%;
			transform: translate(-50%, -50%);
			opacity: 1;
		}

		&.steps-ani-leave-to {
			opacity: 0;

			.question {
				opacity: 0;
				top: 150px;
				transition: top $top-duration 0.1s, opacity $opacity-duration 0.1s;
			}

			.divider {
				@include above-mobile {
					height: 0px;
					transition: height $opacity-duration;
				}

				@include below-tablet {
					width: 0px;
					transition: width $opacity-duration;
				}
			}

			.answers {
				top: 250px;
				opacity: 0;
				transition: top $top-duration, opacity $opacity-duration;
			}
		}
	}
}
</style>
