<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import moment, { Moment } from 'moment-timezone'

@Component
export default class Calendar extends Vue {
	@Prop({ type: [String, Boolean] }) current!: string
	@Prop({ type: [String, Boolean] }) startDate!: string
	@Prop({ type: [String, Boolean] }) endDate!: string

	nameOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

	get moment() {
		return this.$moment(this.current)
	}

	get daysInMonth() {
		return this.moment.daysInMonth()
	}

	get currentDay() {
		return this.moment.date()
	}

	get realCurrentDay() {
		return this.$moment().date()
	}

	get isCurrentMonth() {
		return this.moment.month() === this.$moment().month()
	}
	// for the week name

	get weekday() {
		return this.moment.date(1).day()
	}

	get startDay() {
		if (!this.startDate) return 0
		return this.$moment(this.startDate).format('D')
	}

	get endDay() {
		if (!this.endDate) return 0
		return this.$moment(this.endDate).format('D')
	}

	@Emit('day-clicked')
	dayClicked(event: MouseEvent) {
		return event
	}

	isSelectedDay(date: number) {
		if (!this.startDate) return false
		const fullDate = this.moment.set({ date })
		const isWithinRange =
			this.endDate && fullDate.isBetween(this.startDate, this.endDate)
		return (
			isWithinRange ||
			fullDate.isSame(this.startDate) ||
			(this.endDate && fullDate.isSame(this.endDate))
		)
	}
}
</script>

<template>
	<div
		class="calendar"
		:class="{ 'has-range': endDate && endDate !== startDate }"
	>
		<div v-for="name in nameOfDays" :key="name" class="weekday-name">
			{{ name }}
		</div>
		<div v-for="week in weekday" :key="`empty-${week}`" class="day"></div>
		<template v-for="day in daysInMonth">
			<div
				ref="day"
				:key="day"
				class="day"
				:class="{
					selected: isSelectedDay(day),
					current: day === realCurrentDay && isCurrentMonth,
					start: startDay == day && endDay,
					end: day == endDay
				}"
				@click="() => dayClicked(day)"
			>
				<slot name="day" :day="day">
					<span class="day-number">
						<slot name="day-number" :day="day">
							{{ day }}
						</slot>
					</span>

					<div class="day-content">
						<slot name="day-content" :day="day" />
					</div>
				</slot>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.calendar {
	display: grid;
	grid-template-columns: repeat(7, auto);

	@media screen and (max-width: 875px), (max-height: 850px) {
		.calendar {
			.weekday-name,
			.day-number {
				color: $that-white !important;
			}
			.day {
				&.selected,
				&.current {
					.day-number {
						color: $color-primary !important;
					}
				}
			}

			&.has-range {
				.day {
					&.selected {
						.day-number {
							color: $that-white !important;
						}
					}
					&.current,
					&.start,
					&.end {
						.day-number {
							color: $color-primary !important;
						}
					}
				}
			}
		}
	}
	.weekday-name {
		color: $color-primary;
		text-align: center;
		font-weight: 600;
		font-size: 14px;
	}

	.day {
		@include flex(column, flex-start, center);
		padding: 0;
		border: 2px solid transparent;
		border-left-width: 0px;
		border-right-width: 0px;

		margin: 0.25em 0px;
		cursor: pointer;

		.day-number {
			@include flex(column, center, center);
			width: var(--day-number-size, 30px);
			height: var(--day-number-size, 30px);
			border: 2px solid transparent;
			font-family: $lato-font;
			font-size: 13px;
			font-weight: 900;
			color: $color-primary;
			border-radius: 100%;
			transition: color 0.25s, background-color 0.25s;
		}

		&.selected {
			.day-number {
				color: $color-primary-text;
				background-color: $color-primary;
			}
		}

		&.dayclicked {
			background-color: $color-primary;
			.day-number {
				color: $color-primary-text;
				background-color: $color-primary;
			}
		}
		&.current {
			.day-number {
				border: 2px solid $color-primary;
			}
		}
	}

	&.has-range {
		.day {
			&.selected:not(.start.end) {
				border-color: $color-primary;

				&.start {
					border-top-left-radius: 50px;
					border-bottom-left-radius: 50px;
					border-left-width: 2px;
				}
				&.end {
					border-bottom-right-radius: 50px;
					border-top-right-radius: 50px;
					border-right-width: 2px;
				}

				.day-number {
					color: $color-primary;
					background-color: transparent;
				}
			}
		}
	}
}
</style>
