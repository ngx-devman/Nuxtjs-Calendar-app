<script lang="ts">
import ClubReservation from '@includes/models/ClubReservation'
import _ from 'lodash'
import { Vue, Component, InjectReactive, Getter } from 'nuxt-property-decorator'

@Component
export default class ReservationStepGuestQuestions extends ClubReservation.Injected {
	@InjectReactive({ from: 'step', default: '' })
	step!: string

	selected_guest: any = -1
	host_answers: any[] = []

	get guests() {
		return this.club_reservation.guests
	}

	set guests(v: any[]) {
		this.club_reservation.guests = v
	}

	get current_guest() {
		if (this.selected_guest === -1) return this.user
		return this.guests[this.selected_guest]
	}

	set current_guest(v: any) {
		if (this.selected_guest === -1) return
		this.guests[this.selected_guest] = v
	}

	get guest_questions(): any[] {
		return this.club_reservation_questions('guests')
	}

	get guest_answers() {
		if (this.selected_guest === -1) return this.host_answers
		if (!this.current_guest.form_answers) {
			this.current_guest.form_answers = []
		}

		return this.current_guest.form_answers
	}

	set guest_answers(v: any) {
		if (this.selected_guest === -1) {
			this.host_answers = v
			return
		}
		this.current_guest.form_answers = v
	}

	get required_questions() {
		return this.club_reservation_questions('guests').filter(f => f.is_required)
	}

	required_questions_answered() {
		if (!this.required_questions) return true
		return this.guest_answers.every((a: any) => {
			if (!a.is_required) return true
			return a.is_required && a.value.length
		})
	}

	all_required_questions_answered() {
		const questions = _.cloneDeep(this.host_answers)
		this.club_reservation.guests.forEach(g => questions.push(...g.form_answers))

		return questions.every(q => {
			if (!q.is_required) return true
			return q.is_required && q.value.length
		})
	}

	created() {
		this.host_answers = this.club_reservation.form_answers.filter(
			(f: any) => f.is_per_attendee
		)
	}

	beforeDestroy() {
		this.club_reservation.form_answers = _.uniqBy(
			[...this.club_reservation.form_answers, ...this.host_answers],
			t => t.id
		)
	}

	next() {
		if (this.selected_guest >= this.guests.length - 1) {
			if (this.all_required_questions_answered()) this.$emit('next')
		} else this.selected_guest += 1
	}
}
</script>

<template>
	<div class="step-page step-3">
		<div class="question">
			<h2 class="step-title">
				Please answer the following question(s) for each attendee ...
			</h2>

			<div class="guests">
				<form-button
					class="guest flat"
					:class="{
						'selected outline': -1 === selected_guest,
						ghost: -1 !== selected_guest
					}"
					@click="selected_guest = -1"
				>
					#1
					{{ user.first_name }}
					{{ user.last_name }}
				</form-button>

				<template v-for="(guest, i) in guests">
					<form-button
						:key="i"
						class="guest flat"
						:class="{
							'selected outline': i === selected_guest,
							ghost: i !== selected_guest
						}"
						@click="selected_guest = i"
					>
						#{{ i + 2 }}
						<span v-if="guest.is_anonymous">TBD</span>
						<span v-else-if="!guest.member">{{ guest.name }}</span>
						<span v-else>
							{{ guest.first_name }}
							{{ guest.last_name }}
						</span>
					</form-button>
				</template>
			</div>
		</div>

		<div class="divider" />

		<div class="answers">
			<div v-if="selected_guest > -1" class="selected-guest">
				#{{ selected_guest + 2 }}
				<span v-if="current_guest.is_anonymous">TBD</span>
				<span v-else-if="!current_guest.member">{{ current_guest.name }}</span>
				<span v-else>
					{{ current_guest.first_name }}
					{{ current_guest.last_name }}
				</span>
			</div>
			<div v-else class="selected-guest">
				#1
				{{ current_guest.first_name }}
				{{ current_guest.last_name }}
			</div>

			<dynamic-form
				v-if="selected_guest > -1"
				v-model="current_guest.form_answers"
				:questions="guest_questions"
			/>
			<dynamic-form
				v-else
				v-model="host_answers"
				:questions="guest_questions"
			/>

			<div class="step-actions">
				<form-button
					class="ghost"
					:disabled="!required_questions_answered()"
					@click="next"
				>
					<span>Next</span>
				</form-button>

				<form-button
					v-if="!required_questions.length"
					class="ghost no-border skip"
					@click="next"
				>
					<span>Skip</span>
				</form-button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

// .reservation-guest-form::v-deep {
// 	.input-radio-buttons {
// 		--input-radio-mark-color-background: white;
// 	}
// }

.step-page.step-3 {
	.question {
		.step-title {
			margin-bottom: 1em;
		}

		.guests {
			@include grid();
			justify-content: start;
			max-height: 250px;

			overflow: hidden;
			overflow-y: auto;
			--scrollbar-size: 0px;
			border-radius: $border-radius;

			.guest {
				width: unset;
				flex-shrink: 0;
				transform: scale(0.9);
				transition: all 0.25s;
				text-align: left;
				@include vertical-list-item;

				&.selected {
					border: 1px solid white;
					background-color: white;
					color: $color-primary;
					transform: scale(1);
				}

				@include below-tablet {
					width: fit-content;
					@include vertical-list-item(0px);
					@include horizontal-list-item(00em);
				}
			}

			@include below-tablet {
				@include flex(row);

				overflow: hidden;
				overflow-x: auto;
			}
		}

		@include below-desktop {
			font-size: 0.75em;
		}
	}

	.answers {
		max-height: 100%;

		overflow: hidden;
		overflow-y: auto;

		.selected-guest {
			font-size: 1.25em;
			margin-bottom: 1em;
		}

		@include on-mobile {
			width: 90%;
			max-width: 600px;
		}
	}
}
</style>
