import Vue from 'vue'
import { NuxtAppOptions, Plugin } from '@nuxt/types'
import Component from 'vue-class-component'
import _ from 'lodash'

const debug = require('debug')('app:plugin:modal')

export interface ModalObject {
	is: string
	sync?: boolean
	props?: {
		[name: string]: any
	}
	[name: string]: any
}

@Component
export class ModalEvents extends Vue {
	current: any[] = []

	set(modal: string | ModalObject) {
		const modals = this.current

		if (typeof modal === 'string') {
			modals.push({ is: modal })
		} else modals.push(modal)

		this.current = _.uniqBy(modals, 'is')
		return this
	}

	remove(modal: string | ModalObject) {
		this.current = this.current.filter(m => {
			if (typeof modal === 'string') {
				if (typeof m === 'string') return m !== modal
				else return m.is !== modal
			}
			return !Object.is(modal, m)
		})
		return this
	}

	open(modal: string | ModalObject) {
		this.set(modal)
		return this
	}

	close(what?: string | ModalObject) {
		let w: string | ModalObject
		if (!what && this.current.length) {
			w = this.current[this.current.length - 1]
		} else if (!this.current.length) {
			return false
		} else w = what as any

		return this.remove(w)
	}
}

declare module 'vue/types/vue' {
	interface Vue {
		$modal: ModalEvents
	}
}

declare module 'vuex/types/index' {
	interface Store<S> {
		$modal: ModalEvents
	}
}

const ModalPlugin: Plugin = (ctx, inject) => {
	inject('modal', new ModalEvents(ctx.app))
}

export default ModalPlugin
