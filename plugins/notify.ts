import Vue from 'vue'
import { NuxtAppOptions, Plugin } from '@nuxt/types'
import Component from 'vue-class-component'

const debug = require('debug')('app:plugin:notify')

@Component
export class NotifyEvents extends Vue {
	items: any[] = []

	show(item: any) {
		if (typeof item !== 'object') item = { content: item }

		item.id = Math.round(Math.random() * 1000)
		this.items.push(item)

		setTimeout(() => {
			this.remove(item)
		}, item.duration || 10000)
	}

	remove(item: any) {
		this.items = this.items.filter(i => i.id !== item.id)
	}
}

declare module 'vue/types/vue' {
	interface Vue {
		$notify: NotifyEvents
	}
}

declare module '@nuxt/types' {
	interface NuxtAppOptions {
		$notify: NotifyEvents
	}

	interface Context {
		$notify: NotifyEvents
	}
}

declare module 'vuex/types/index' {
	interface Store<S> {
		$notify: NotifyEvents
	}
}

const NotifyPlugin: Plugin = (ctx, inject) => {
	inject('notify', new NotifyEvents(ctx.app))
}

export default NotifyPlugin
