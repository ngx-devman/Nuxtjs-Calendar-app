<script lang="ts">
import helpers from '@includes/helpers'
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class FormInput extends Vue {
	@Prop({ type: String }) name!: string
	@Prop({ type: String, default: 'text' }) type!: string
	@Prop({ type: Boolean }) clearable!: boolean
	@Prop({ type: String, default: '' }) placeholder!: string
	@Prop({ type: Boolean }) required!: boolean
	@Prop({ type: String }) autocomplete!: string
	@Prop({ type: Boolean, default: false }) readonly!: boolean
	// add label props
	@Prop({ type: String, default: '' }) label!: string

	@Prop({ default: '' }) value!: string

	get listeners() {
		return helpers.exclude(this.$listeners, ['input'])
	}

	get hasValue() {
		return this.value && this.value.length
	}

	get inputAttrs() {
		return {
			name: this.name,
			type: this.type
		}
	}

	clearInput() {
		this.$emit('input', '')
	}
}
</script>

<template>
	<!--remove design in :class="[hasValue ? 'has-value' : false, type] -->
	<div class="form-input" :class="[hasValue ? 'has-value' : false, type]">
		<label
			v-if="label"
			:for="name"
			class="input-label"
			:title="required ? 'Required' : 'Optional'"
		>
			<span class="input-label-text">{{ label }}</span>

			<span v-if="required" class="input-required-mark">
				<i
					class="fad fa-comment-exclamation"
					style="--fa-primary-opacity: 1"
					title="Required"
				/>
			</span>
		</label>

		<span v-if="clearable && hasValue" class="input-clear" @click="clearInput">
			<i class="far fa-times-circle" />
		</span>

		<div
			class="input-area"
			:style="type === 'color' && value ? `--selected-color: ${value};` : ''"
		>
			<span v-if="type === 'color'" class="color-select-text">
				Select Color
			</span>

			<slot v-if="$slots.input" name="input" />
			<input
				v-else
				v-bind="$attrs"
				:value="value"
				:name="name"
				:placeholder="placeholder"
				:type="type"
				:required="required"
				:autocomplete="autocomplete"
				:readonly="readonly"
				@input="$emit('input', $event.target.value)"
				v-on="listeners"
			/>

			<slot name="input-extra" />
		</div>
	</div>
</template>
