<script lang="ts">
import _ from 'lodash'
import { Vue, Component, Prop, PropSync, Watch } from 'nuxt-property-decorator'

/**
 * @deprecated v0.6
 */
@Component
export default class ReservationGuestForm extends Vue {
	@PropSync('guest', { type: Object, required: true }) guest_data!: any
	@Prop({ type: Array, required: true }) questions!: any[]
	@Prop({ type: Boolean, default: false }) readonly!: boolean

	get guest_answers(): any[] {
		if (!this.guest_data || !this.guest_data.form_answers) return []
		return this.guest_data.form_answers
	}

	set guest_answers(v: any[]) {
		this.guest_data.form_answers = v
	}

	@Watch('guest_data', { immediate: true })
	mapGuestAnswers() {
		if (this.guest_answers.length) return
		this.guest_answers = this.questions.map((field: any) => ({
			...field,
			value: ['checkbox', 'multiple'].includes(field.field_type) ? [] : ''
		}))
	}

	dropDownOptions(field: any) {
		const mappedKeys = _.mapKeys(field.options, 'title')
		return _.mapValues(mappedKeys, v => v.title)
	}

	getRadioOptions(field: any) {
		const mappedKeys = _.mapKeys(field.options, 'title')
		return _.mapValues(mappedKeys, v => v.title)
	}
}
</script>

<template>
	<div class="dynamic-form">
		<template v-for="(field, i) in guest_answers">
			<div :key="field.id" class="form-section" :class="field.field_type">
				<template v-if="field.field_type === 'dropdown'">
					<!-- <label :for="field.title">{{ field.title }}</label> -->

					<form-select
						v-model="guest_answers[i].value"
						:name="field.title"
						:required="field.is_required"
						:disabled="readonly"
						:options="dropDownOptions(field)"
						class="expanded flat"
					/>
				</template>

				<template v-else-if="field.field_type === 'long'">
					<form-text-area
						v-model="guest_answers[i].value"
						:name="field.title"
						:required="field.is_required"
						:readonly="readonly"
						class="expanded flat"
					/>
				</template>

				<template
					v-else-if="
						field.field_type === 'multiple' || field.field_type === 'checkbox'
					"
				>
					<!-- <label :for="field.title">{{ field.title }}</label> -->

					<form-radio
						v-model="guest_answers[i].value"
						:name="field.title"
						:label="field.title"
						:options="getRadioOptions(field)"
						class="flat no-bg"
						:required="field.is_required"
						:readonly="readonly"
					/>
				</template>

				<template v-else-if="field.field_type === 'short'">
					<form-input
						v-model="guest_answers[i].value"
						:name="field.title"
						:label="field.title"
						class="expanded flat"
						:required="field.is_required"
						:readonly="readonly"
					/>
				</template>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.dynamic-form::v-deep {
	.input-label {
		margin-bottom: 0.5em;
		font-weight: bold;
		font-size: 0.9em;
		color: white;
	}
}

.dynamic-form {
	display: grid;
	grid-auto-flow: row;
	row-gap: 1em;
	width: 100%;

	.form-section {
		@include flex(column);
		width: 100%;
		overflow: hidden;

		@include vertical-list-item;

		.form-select {
			width: 100%;
			color: $color-selectbox-text;
			font-family: inherit;
		}

		&.dropdown {
			.form-select {
				padding: 0;
				border: none;
				background-color: transparent;
				border-radius: $border-radius;

				option {
					font-family: $lato-font;
				}
			}
		}

		&.long,
		&.short {
			.form-input {
				width: 100%;
			}
		}
	}
}

@media only screen and (min-width: 576px) and (max-width: 1023px) {
	.form-wrap {
		.dynamic-form {
			.form-section {
				justify-content: flex-start;
				align-items: flex-start;
			}
			&.long {
				.form-input {
					.input-area {
						width: 100%;
						min-height: 107px;
					}
				}
			}
			.form-select {
				width: 100%;
			}
		}
	}
}
</style>
