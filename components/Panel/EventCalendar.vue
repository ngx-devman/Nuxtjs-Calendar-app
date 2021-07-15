<script lang="ts">
import {
	Vue,
	Component,
	Prop,
	VModel,
	Watch,
	Emit,
	PropSync
} from 'nuxt-property-decorator'

@Component
export default class PanelEventCalendar extends Vue {
	@VModel({ type: [String, Boolean] }) selected?: string
	@PropSync('startDate', { type: [String, Boolean], default: false })
	$startDate!: string | boolean

	@PropSync('endDate', { type: [String, Boolean], default: false })
	$endDate!: string | boolean

	get current() {
		if (!this.selected) return this.$moment()
		return this.$moment(this.selected)
	}

	get current_formatted() {
		return this.current.format()
	}

	previousMonth() {
		if (this.current) {
			this.current.subtract({ month: 1 })
			this.$forceUpdate()
		}
	}

	nextMonth() {
		if (this.current) {
			this.current.add({ month: 1 })
			this.$forceUpdate()
		}
	}

	dayClicked(date: number) {
		this.$root.$emit('select-month', false)

		if (this.current) {
			this.current.set({ date })
		}

		if (this.selected === this.current.format('YYYY-MM-DD')) {
			this.selected = this.$moment().format('YYYY-MM-DD')
			this.$startDate = this.$moment().format('YYYY-MM-DD')
			this.$endDate = false
		} else {
			this.selected = this.current.format()
			this.$startDate = this.current.format('YYYY-MM-DD')
			this.$endDate = this.current.format('YYYY-MM-DD')
		}

		this.$forceUpdate()
	}

	// function for date range picker
	@Emit('range-clicked')
	rangeClick(data: any) {
		this.$startDate = data.start
		this.$endDate = data.end

		this.$forceUpdate()
	}
}
</script>

<template>
	<panel class="event-calendar panel-event-calendar">
		<template #panel-header>
			<form-button
				class="previous-month icon flat outline"
				@click="previousMonth"
			>
				<i class="fal fa-angle-left" />
			</form-button>

			<h3 class="panel-title">
				{{ current.format('MMMM') }}
				{{ current.format('YYYY') }}
			</h3>

			<form-button class="next-month icon flat outline" @click="nextMonth">
				<i class="fal fa-angle-right" />
			</form-button>
		</template>
		<event-date-range-picker
			:current="current.format()"
			@range-click="rangeClick"
		></event-date-range-picker>
		<calendar
			v-if="current"
			:current="current.format()"
			:start-date="$startDate"
			:end-date="$endDate"
			@day-clicked="dayClicked"
		/>
	</panel>
</template>

<style lang="scss" scoped>
@import '@sassy';

.panel.event-calendar::v-deep {
	.panel-header {
		@include flex(row, space-between, center);
		padding: 10px 26px 5px 26px;
		background-color: #7b98ac;
		border-top-left-radius: $border-radius;
		border-top-right-radius: $border-radius;

		color: white;

		.form-button {
			--button-icon-size: 30px;
		}
	}
}

.panel.event-calendar {
	width: 430px;
	background: linear-gradient(180deg, #d3f7ff 0%, #ffffff 100%);

	// .panel-title {
	// 	@include flex(column, center, center);
	// }
	.calendar {
		margin: 0.5em;
		overflow: hidden;
	}

	.form-button.outline {
		background-color: white;
	}
}
</style>
