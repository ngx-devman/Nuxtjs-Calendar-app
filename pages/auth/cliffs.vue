<script lang="ts">
import helpers from '@includes/helpers'
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
	layout: 'no-layout'
})
export default class PageAuthCliffs extends Vue {
	user: any = false

	authenticate() {
		const {
			$api,
			$route: { query }
		} = this

		const auth_params: any = helpers.extract(query, [
			'member_number',
			'timestamp',
			'destination',
			'client_signature'
		])

		if (!auth_params.destination) auth_params.destination = ''

		return $api
			.$post('/members/auth-cliffs/', auth_params)
			.then(user => {
				localStorage.setItem('access', user.token.access)
				localStorage.setItem('refresh', user.token.refresh)
				this.user = user
			})
			.catch(err => console.error(err))
	}

	async mounted() {
		await this.authenticate()

		if (this.user && this.user.id) {
			window.location.href = '/'
		} else {
			alert('Failed to authenticate!')
		}
	}
}
</script>

<template>
	<loading-screen start-it>
		<h2>Authenticating</h2>
	</loading-screen>
</template>

<style lang="scss" scoped>
@import '@sassy';

.loading-screen::v-deep {
	z-index: 1000000000000000000000000000000000;
}
</style>
