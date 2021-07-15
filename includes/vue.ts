export const ImmediateDeep = { deep: true, immediate: true }

declare module 'vue/types/vue' {
	interface Vue {
		$style: {
			[key: string]: string
		}
	}
}
