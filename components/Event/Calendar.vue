<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class EventCalendar extends Vue {}
</script>

<template>
	<calendar>
		<h5>TEST</h5>
	</calendar>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
