<script lang="ts">
import { Vue, Component, Watch, Emit } from 'nuxt-property-decorator'

@Component
export default class MemberSearchInput extends Vue {
	searchTimer: any = false
	search: string = ''
	page: number = 1
	users: any[] = []

	@Watch('search')
	searchUpdated() {
		this.page = 1
		this.users = []

		clearTimeout(this.searchTimer)
		this.searchTimer = setTimeout(() => {
			this.fetchUsers().catch(() => null)
		}, 250)
	}

	fetchingUsers: boolean = false
	fetchUsers(replace = true) {
		if (this.fetchingUsers) return Promise.reject(new Error('fetching'))
		if (!this.search || !this.search.length)
			return Promise.reject(new Error('no search!'))
		this.fetchingUsers = true

		return this.$store
			.dispatch('members/fetch', { search: this.search, page: this.page })
			.then(res => {
				const users = res.data.filter((i: any) => i.member_id)

				if (replace) this.users = users
				else this.users.push(...users)

				this.$nextTick().then(() => {
					this.fetchingUsers = false
				})
			})
			.catch(err => {
				setTimeout(() => {
					this.fetchingUsers = false
				}, 5000)

				throw err
			})
	}

	nextPage() {
		this.page += 1

		return this.fetchUsers(false).catch(() => {
			this.page -= 1
		})
	}

	@Emit('member-selected')
	memberSelected(v: any) {
		this.search = ''
		this.users = []
		this.page = 1
		return v
	}
}
</script>

<template>
	<form-search
		class="member-search-input"
		:search.sync="search"
		:results="users"
		@results-end="nextPage"
		@select-result="memberSelected"
	>
		<template #result="{ item }">
			{{ item.first_name }} {{ item.last_name }}
		</template>
	</form-search>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
