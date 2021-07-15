<script lang="ts">
import _ from 'lodash'
import { Vue, Component, Prop, Action, Getter } from 'nuxt-property-decorator'

@Component
export default class UserSaveFilterModal extends Vue {
	@Prop() filter: any
	title: string = ''
	@Getter('auth/filters') userFilters!: any
	@Action('auth/save_filters') $saveFilters!: (...args: any[]) => Promise<any>

	saving: boolean = false
	save() {
		if (this.saving) return
		this.saving = true

		const filter = { ...this.filter, title: this.title }
		const filters = _.uniq([...this.userFilters, filter])
		this.$saveFilters(filters)
			.then(() => {
				this.$notify.show({
					title: 'Filter Saved',
					content: 'Your filter has been saved successfully.',
					type: 'success'
				})
				this.$modal.close()
			})
			.catch(() => {
				this.$notify.show({
					title: 'Failed Saving Filter',
					content:
						'Failed saving filter. Please try again later or contact support',
					type: 'alert'
				})
				this.$modal.close()
			})
	}
}
</script>

<template>
	<modal class="user-save-filter-modal">
		<form-component class="filter-save-form" @submit="save">
			<form-input
				v-model="title"
				name="filter_name"
				label="Filter Name"
				class="flat expanded"
				required
			/>

			<form-button type="submit" class="flat compact" :disabled="saving">
				<span>{{ !saving ? 'Save Filter' : 'Saving...' }}</span>
			</form-button>
		</form-component>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.user-save-filter-modal::v-deep {
	.modal-body {
		@include flex(column);
		width: 300px;
	}
}

.user-save-filter-modal {
	.filter-save-form {
		@include flex(column);
		width: 100%;

		.form-input {
			width: 100%;
		}

		.form-button {
			align-self: flex-end;
			right: 11px;
		}
	}
}
</style>
