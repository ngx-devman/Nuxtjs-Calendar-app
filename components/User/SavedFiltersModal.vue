<script lang="ts">
import { Vue, Component, Getter, Action } from 'nuxt-property-decorator'

@Component
export default class UserSavedFiltersModal extends Vue {
	@Getter('auth/filters') filters!: any[]
	@Action('auth/save_filters') $saveFilters!: (filters: any[]) => Promise<any>

	removeFilter(index: number) {
		const filters = [...this.filters]
		delete filters[index]

		this.$saveFilters(filters.filter(f => f))
	}
}
</script>

<template>
	<modal class="user-saved-filters-modal">
		<template #modal-title>Saved Filters</template>

		<div v-if="filters.length" class="saved-filters">
			<template v-for="(filter, i) in filters">
				<div :key="i" class="saved-filter">
					<div class="filter-title">
						{{ filter.title }}
					</div>

					<div class="filter-actions">
						<form-button
							class="action delete icon compact flat"
							@click="() => removeFilter(i)"
						>
							<i class="fas fa-trash"></i>
						</form-button>
					</div>
				</div>
			</template>
		</div>
		<div v-else class="no-filters">
			<h5>No filters</h5>
		</div>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.user-saved-filters-modal::v-deep {
	.modal-body {
		width: 300px;
	}
}

.user-saved-filters-modal {
	.modal-title {
		color: $color-primary;
		border-bottom: 1px solid $color-primary;
	}

	.saved-filters {
		@include flex(column);
		width: 100%;

		.saved-filter {
			@include flex(row, space-between, center);
			width: 100%;
			padding: 0.5em;
			border-radius: $border-radius;

			.filter-actions {
				@include flex(row, flex-end, center);
				width: 100%;

				.action.icon {
					--button-icon-size: 25px;
					font-size: 0.7em;
				}

				.action.delete {
					background-color: $that-peach;
				}
			}

			&:nth-child(odd) {
				background-color: rgba($color-primary, 0.1);
			}
		}
	}
}
</style>
