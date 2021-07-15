<script lang="ts">
import helpers from '@includes/helpers'
import { Context } from '@nuxt/types'
import { Vue, Component } from 'nuxt-property-decorator'

const SSO_DEV_CREDS = {
	time: '1617902271323',
	vendor: '201309190795',
	user_id: 'D00594B',
	target_page: '',
	value:
		'AOKvlGBTo29HmAmVpEf/IR/rZwsqSlEPtM3VxAjBFkUis/PTZ2755/HyIgzJKd91RXDw0ub4olb7d8tCynsBOE2Dmkfvw3tMSOXQk0v7UzQHSjUZQhbuQCtKU+b+Iv7OHTNSCmURvozh2ww0zCoaQjfZWrMmOwIksCDATWnrdwc='
}

@Component({
	layout: 'no-layout'
})
export default class PageAuth extends Vue {
	user: any = false

	authenticate() {
		const {
			$api,
			$route: { query }
		} = this

		const auth_params: any = helpers.extract(query, [
			'time',
			'vendor',
			'user_id',
			'target_page',
			'value'
		])

		const isDev = true
		if (isDev) {
			Object.assign(auth_params, SSO_DEV_CREDS)
		}

		return $api
			.$post('/members/auth/', auth_params)
			.then(user => {
				this.user = user

				this.$api.defaults.headers.Authorization = `Bearer ${user.token.access}`
				this.$store.commit('auth/set', user)
			})
			.catch(err => console.error(err))
	}

	async mounted() {
		await this.authenticate()

		if (this.user && this.user.id) {
			// window.location.href = '/'
			this.$router.push('/')
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
