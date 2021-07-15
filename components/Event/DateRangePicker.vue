<script lang="ts">
import { Vue, Component, Emit, Prop, Watch } from 'nuxt-property-decorator'

@Component
export default class EventCalendar extends Vue {
	@Prop()
	current!: any

	select_month: boolean = false

	get today() {
		return this.$moment(this.current)
	}

	get todayDate() {
		return this.$moment().format('YYYY-MM-DD')
	}

	get startOfWeek() {
		const start_date = this.$moment().weekday(1).format('YYYY-MM-DD')
		return start_date
	}

	get endOfWeek() {
		const end_date = this.$moment().weekday(7).format('YYYY-MM-DD')
		return end_date
	}

	get startOfMonth() {
		const startOfMonth = this.today.startOf('month').format('YYYY-MM-DD')
		return startOfMonth
	}

	get endOfMonth() {
		const endOfMonth = this.today.endOf('month').format('YYYY-MM-DD')
		return endOfMonth
	}

	mounted() {
		this.$root.$on('select-month', (v: boolean) => {
			this.select_month = v
		})

		this.$root.$on('clear-filters', () => {
			this.select_month = false
		})
	}

	@Watch('current')
	selectMonth() {
		if (this.select_month)
			this.dateRangeClicked(this.startOfMonth, this.endOfMonth, true)
	}

	@Emit('range-click')
	dateRangeClicked(val: any, val1: any, select_month: boolean = false) {
		this.select_month = select_month
		const date = {
			start: val,
			end: val === val1 ? false : val1
		}
		return date
	}
}
</script>

<template>
	<div class="panel-body-btn">
		<form-button
			class="flat filter-btn"
			@click="dateRangeClicked(todayDate, todayDate)"
			><span>Today</span></form-button
		>
		<span>|</span>
		<form-button
			class="flat filter-btn"
			@click="dateRangeClicked(startOfWeek, endOfWeek)"
			><span>This week</span></form-button
		>
		<span>|</span>
		<form-button
			class="flat filter-btn"
			@click="dateRangeClicked(startOfMonth, endOfMonth, true)"
			><span>This Month</span></form-button
		>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
