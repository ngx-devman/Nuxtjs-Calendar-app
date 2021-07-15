<script lang="ts">
import _ from 'lodash'
import { Vue, Component, Prop, PropSync } from 'nuxt-property-decorator'

@Component
export default class PagingDots extends Vue {
	@Prop({ type: Boolean, default: false }) displayOnly!: boolean
	@Prop({ type: Boolean, default: false }) noControls!: boolean

	@Prop({ type: [Number, Array], required: true }) pages!: number
	@PropSync('current', { type: [Number, String], default: 0 })
	currentPage!: number

	get isInFirstPage() {
		if (Array.isArray(this.pages)) {
			return this.currentPage === this.pages[0]
		} else return this.currentPage === 1
	}

	get isInLastPage() {
		if (Array.isArray(this.pages)) {
			return this.currentPage === this.pages[this.pages.length - 1]
		} else return this.currentPage === this.pages
	}

	onClickPreviousPage() {
		if (!Array.isArray(this.pages)) {
			this.currentPage = this.currentPage - 1
		} else if (Array.isArray(this.pages)) {
			const pageIndex = this.pages.findIndex(v => v === this.currentPage)

			if (pageIndex <= 0) return
			this.currentPage = this.pages[pageIndex - 1]
		} else return // can't change pages I don't know what pages is

		this.$emit('previous-page', this.currentPage)
	}

	onClickPage(page: any) {
		if (this.displayOnly) return
		this.currentPage = page
		this.$emit('change-page', this.currentPage)
	}

	onClickNextPage() {
		if (!Array.isArray(this.pages)) {
			this.currentPage = this.currentPage + 1
		} else if (Array.isArray(this.pages)) {
			const pageIndex = this.pages.findIndex(v => v === this.currentPage)

			if (pageIndex + 1 >= this.pages.length) return
			this.currentPage = this.pages[pageIndex + 1]
		} else return // can't change pages I don't know what pages is

		this.$emit('next-page', this.currentPage)
	}

	isPageActive(page: any) {
		return this.currentPage === page
	}
}
</script>

<template>
	<div class="paging-dots">
		<form-button
			v-if="!noControls && !displayOnly"
			class="page-prev-btn icon flat"
			type="button"
			:disabled="isInFirstPage"
			@click="onClickPreviousPage"
		>
			<i class="fal fa-angle-left" />
		</form-button>

		<div class="page-dots-wrap">
			<i
				v-for="(page, i) in pages"
				:key="i"
				class="page-dot-btn icon flat"
				type="button"
				:class="{ active: isPageActive(page) }"
				@click="onClickPage(page)"
			/>
		</div>

		<form-button
			v-if="!noControls && !displayOnly"
			type="button"
			class="page-next-btn icon flat"
			:disabled="isInLastPage"
			@click="onClickNextPage"
		>
			<i class="fal fa-angle-right" />
		</form-button>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.paging-dots {
	@include flex(row, space-between, center);

	& > * {
		@include horizontal-list-item(1em);
	}

	.page-dots-wrap {
		@include flex(row, space-between, center);

		.page-dot-btn {
			padding: 0.3em;

			@include horizontal-list-item;

			&:before {
				content: ' ';
				display: block;
				background-color: #a8bac6;
				width: 15px;
				height: 15px;
				border-radius: 100%;
				transform: scale(0.75);
				transition: all 0.25s;
			}

			&.active {
				&:before {
					background-color: $color-page-background;
					transform: scale(1.25);
				}
			}

			&:hover {
				cursor: pointer;

				&:before {
					transform: scale(1.25);
				}
			}
		}
	}

	.page-prev-btn,
	.page-next-btn {
		background-color: $color-page-background;
		color: $color-primary;
		width: 25px;
		height: 25px;
	}
}
</style>
