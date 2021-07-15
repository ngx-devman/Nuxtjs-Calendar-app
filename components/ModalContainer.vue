<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class ModalContainer extends Vue {
	modals: any[] = []

	mounted() {
		// this.$modal.$on('open', () => {
		// 	this.modals = this.$modal.current
		// })
		// this.$modal.$on('closed', () => {
		// 	this.modals = []
		// })
	}
}
</script>

<template>
	<div
		class="modal-container"
		:class="{ hide: !$modal.current || !$modal.current.length }"
	>
		<template v-for="(modal, i) in $modal.current">
			<transition :key="i + modal.is" name="modal" appear>
				<component :is="modal.is" v-bind.sync="$modal.current[i]" />
			</transition>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.modal-container {
	@include flex(column, center, center);
	width: 100%;
	height: 100%;

	position: fixed;
	left: 0px;
	top: 0px;
	z-index: 50;

	opacity: 1;

	// animation: modalFadeIn 0.25s;
	// animation-fill-mode: forwards;
	transition: opacity 0.25s;

	&.hide {
		opacity: 0;
		pointer-events: none;
		transition-delay: 0.5s;
	}
}
</style>
