<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { Vue, Component, Ref } from 'nuxt-property-decorator'

@Component
export default class EventForesteesReserve extends ClubEvent.Injected {
	@Ref('form') form!: HTMLFormElement

	submit() {
		this.form.submit()
	}
}
</script>

<template>
	<form
		ref="form"
		class="event-forestees-reserve"
		method="POST"
		target="_blank"
		action="https://web.foretees.com/v5/servlet/Login"
	>
		<input type="text" name="clubname" value="cliffsliving" />
		<!--static value -->
		<input type="text" name="user_name" :value="user.member_id" />
		<!-- `member_numer` field value -->
		<input type="text" name="activity" value="0" />
		<!--static value -->
		<input type="text" name="caller" value="GENID79623" />
		<!--static value -->
		<input
			type="text"
			name="eventname"
			:value="club_event.foretees_event_name"
		/>
		<!-- `foretees_event_name` field value -->
		<input type="submit" value="Submit" />
	</form>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-forestees-reserve {
	display: none;
}
</style>
