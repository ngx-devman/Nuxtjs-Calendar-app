import lodash from 'lodash'

export module helpers {
	export interface AnyObject extends Object {
		[key: string]: any
	}

	/**
	 * Simple truth check turned into a function
	 * @package includes/helpers
	 * @param what anything
	 * @param this_is the thing
	 * @returns anything === the thing
	 */
	export function is<This, What extends This>(
		what: What,
		this_is: This
	): this_is is What {
		return what === this_is
	}

	/**
	 * Extracts the properties of a given object
	 * @package includes/helpers
	 * @param obj {[key: string]: any}
	 * @param what Array<keyof obj>
	 * @returns obj only what
	 */
	export function extract<T extends AnyObject, W extends Array<keyof T>>(
		obj: T,
		what: W
	): Extract<T, W> {
		const data: any = {}

		for (const key of what) {
			const v = lodash.get(obj, key)
			if (typeof v !== 'undefined') lodash.set(data, key, v)
		}

		return data
	}

	/**
	 * Returns a object excluding the given properties
	 * @package includes/helpers
	 * @param o {[key: string]: any}
	 * @param w Array<keyof o>
	 * @returns o excluding w
	 */
	export function exclude<T extends Object, W extends Array<keyof T>>(
		o: T,
		w: W
	): Exclude<T, W> {
		const data: any = {}
		const keys = Object.keys(o) as W

		for (const k of keys) {
			if (!w.includes(k)) data[k] = o[k]
		}

		return data
	}
}
export default helpers
