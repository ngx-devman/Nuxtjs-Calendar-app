<script lang="ts">
import _ from 'lodash'
import { Vue, Component, Prop, Watch, VModel } from 'nuxt-property-decorator'

@Component
export default class DynamicForm extends Vue {
	@VModel({ type: Array, required: true }) answers!: any
	@Prop({ type: Array }) questions!: any[]
	@Prop({ type: Boolean, default: false }) readonly!: boolean

	@Watch('answers', { immediate: true })
	mapAnswers() {
		if (this.answers.length || !this.questions) return
		this.answers = this.questions.map((field: any) => ({
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
	<div class="dynamic-form" :class="{ readonly }">
		<div v-if="$slots.before" class="form-section">
			<slot name="before" />
		</div>

		<template v-for="(field, i) in answers">
			<div :key="field.id" class="form-section" :class="field.field_type">
				<template v-if="field.field_type === 'dropdown'">
					<!-- <label :for="field.title">{{ field.title }}</label> -->

					<form-select
						v-model="answers[i].value"
						:label="field.title"
						:required="field.is_required"
						:disabled="readonly"
						:options="dropDownOptions(field)"
						class="expanded flat"
					>
						<template v-if="readonly" #input>
							{{ answers[i].value }}
						</template>
					</form-select>
				</template>

				<template v-else-if="field.field_type === 'long'">
					<form-text-area
						v-model="answers[i].value"
						:label="field.title"
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
						v-model="answers[i].value"
						:name="field.title"
						:label="field.title"
						:options="getRadioOptions(field)"
						class="flat no-bg"
						:required="field.is_required"
						:disabled="readonly"
					/>
				</template>

				<template v-else-if="field.field_type === 'short'">
					<form-input
						v-model="answers[i].value"
						:name="field.title"
						:label="field.title"
						class="expanded flat"
						:required="field.is_required"
						:readonly="readonly"
					>
						<template v-if="readonly" #input>
							{{ answers[i].value }}
						</template>
					</form-input>
				</template>
			</div>
		</template>

		<div v-if="$slots.default" class="form-section">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.dynamic-form::v-deep {
	.input-label {
		margin-bottom: 0.5em;
		font-weight: bold;
		font-size: 0.9em;
	}
}

.dynamic-form.readonly::v-deep {
	.input-label {
		width: 100%;
		.input-label-text {
			width: 100%;
		}

		.input-required-mark {
			display: none;
		}
	}

	.form-input {
		.input-area {
			min-height: 35px;
			display: block;
			padding: 0.5em;
			text-align: left;
		}
	}

	.form-radio-buttons {
		@include flex(column, center, center);

		.input-radio-wrap {
			@include flex(row, center, stretch);
			width: fit-content;
		}
	}
}

.dynamic-form {
	display: grid;
	grid-auto-flow: row;
	row-gap: 2em;
	width: 100%;

	.form-section {
		@include flex(column);
		width: 100%;
		overflow: hidden;

		.form-radio-buttons {
			width: 100%;
		}

		.form-select,
		.form-input {
			width: 100%;
			color: $color-selectbox-text;
			font-family: inherit;
			padding: 0px;
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
</style>
