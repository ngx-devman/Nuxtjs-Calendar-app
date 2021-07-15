<script lang="ts">
import { Vue, Component, Getter } from 'nuxt-property-decorator'

@Component
export default class BugReport extends Vue {
	@Getter('auth/user') user!: any

	showForm: boolean = false
	message: string = ''

	send() {
		console.log(this.$store)
		this.$logrocket.captureMessage(
			this.$moment().format('x') + ' user reported an issue',
			{
				tags: {
					'user-report': true
				},
				extra: {
					message: this.message,
					user_id: this.user.id,
					user_member_id: this.user.member_id,
					user_email: this.user.email
				}
			}
		)

		this.message = ''
		this.showForm = false
	}
}
</script>

<template>
	<div class="bug-report" :class="{ 'show-form': showForm }">
		<form-button class="icon" @click="showForm = !showForm">
			<i v-if="!showForm" class="fas fa-bug" />
			<i v-else class="fal fa-times" />
		</form-button>

		<form-component class="bug-report" @submit="send">
			<form-text-area
				v-model="message"
				name="message"
				label="Report a issue or bug"
				class="flat expanded no-padding no-border"
			/>
			<form-button type="submit" class="flat compact">Send</form-button>
		</form-component>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

div.bug-report {
	position: fixed;
	right: 1em;
	bottom: 1em;
	z-index: 99999999;

	.form-button.icon {
		z-index: 3;
	}

	.form.bug-report {
		width: 50vw;
		max-width: 600px;

		row-gap: 0.5em;
		padding: 1em;
		padding-right: calc(100% + 2em);

		position: absolute;
		right: -0.5em;
		bottom: -0.5em;
		z-index: 2;

		background-color: white;
		border-radius: $border-radius;

		opacity: 0;
		pointer-events: none;
		transition: opacity 0.25s;

		.form-button {
			justify-self: end;
		}
	}

	&.show-form {
		.form.bug-report {
			opacity: 1;
			pointer-events: all;
		}
	}

	@include tablet {
		.form.bug-report {
			width: 90vw;
		}
	}
}
</style>
