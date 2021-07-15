<script lang="ts">
import _ from 'lodash'
import {
	Vue,
	Component,
	Getter,
	Action,
	Prop,
	Watch,
	PropSync
} from 'nuxt-property-decorator'

const DEFAULT_FILTERS_PROP = {
	location: false,
	space: false,
	eventType: false
}

@Component
export default class UserSavedFilters extends Vue {
	@PropSync('filter', { type: Object, default: () => DEFAULT_FILTERS_PROP })
	filters!: any

	@Getter('auth/user') user!: any
	@Getter('auth/filters') userFilters!: any

	clearFilters() {
		this.$root.$emit('clear-filters')
	}

	saveCurrentFilter() {
		const filter = { ...this.filters }
		let option: any
		for (option in filter) {
			if (!filter[option]) delete filter[option]
		}

		if (!Object.values(filter).length) {
			return alert('You have no filters selected to save!')
		}

		this.$modal.open({ is: 'user-save-filter-modal', filter })
	}
}
</script>

<template>
	<div class="user-saved-filters">
		<h4 class="section-title">Saved Filters:</h4>

		<div class="saved-filters-list">
			<template v-for="(filter, i) in userFilters">
				<div
					v-if="filter.title"
					:key="i"
					class="saved-filter"
					@click="filters = filter"
				>
					{{ filter.title }}
				</div>
			</template>
		</div>

		<div class="action-group">
			<div class="action save-current-filters" @click="saveCurrentFilter">
				Save Current Filters
			</div>

			<div
				class="action manage-filters"
				@click="$modal.open('user-saved-filters-modal')"
			>
				Manage Saved Filters
			</div>
		</div>

		<div class="action-group">
			<div class="action clear-filters" @click="clearFilters">
				Clear All Filters
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.user-saved-filters {
	* {
		font-family: $lato-font;
	}

	.section-title {
		font-weight: bold;
	}

	.saved-filters-list {
		@include flex(column);

		.saved-filter {
			width: 100%;
			cursor: pointer;
		}
	}

	.action-group {
		@include vertical-list-item(1.5em);
	}

	.action {
		text-decoration: underline;
		cursor: pointer;
	}
}
</style>
