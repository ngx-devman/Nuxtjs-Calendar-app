<script lang="ts">
import { Vue, Component, Emit, Prop } from 'nuxt-property-decorator'

@Component
export default class ScrollNotifier extends Vue {
	@Prop({ type: Number, default: 80 }) percent!: number

	mounted() {
		this.attachListeners()
	}

	beforeDestroy() {
		const el = this.$el as HTMLElement

		el.removeEventListener('wheel', this.onScroll)
	}

	render(h: Vue.CreateElement) {
		return this.$slots.default
	}

	attachListeners(): any {
		if (!this.$el) {
			return this.$nextTick().then(() => this.attachListeners())
		}
		const el = this.$el as HTMLElement

		el.addEventListener('scroll', this.onScroll, { passive: true })
	}

	onScroll() {
		const target = this.$el as HTMLElement
		const scrollable = target.scrollHeight - target.offsetHeight
		const scrolled = (target.scrollTop / scrollable) * 100

		if (scrolled > this.percent) {
			this.$emit('end')
		} else if (scrolled < this.percent - 100) {
			this.$emit('start')
		}
	}
}
</script>
