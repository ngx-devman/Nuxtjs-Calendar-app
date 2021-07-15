import { Plugin } from '@nuxt/types'

let workbox: any
declare global {
	interface Window {
		$workbox: any
	}
}

const UpdaterPlugin: Plugin = ctx => {
	console.log('ClubLisi v' + ctx.$config.version)
	// if (process.server || !window.$workbox) return
	localStorage.setItem('version', ctx.$config.version)
	if (!ctx.app.head) return
	let links: any

	if (typeof ctx.app.head === 'function') links = ctx.app.head().link
	else links = ctx.app.head?.link
	if (!links) return

	const manifest_url = links.find((l: any) => l.hid === 'manifest')
	if (!manifest_url) return

	ctx.$axios
		.$get('/version?timestamp=' + new Date().valueOf())
		.then(version => {
			console.log(version, ctx.$config.version)
			if (version !== ctx.$config.version) {
				ctx.$notify.show('new update available')
			}
		})
		.catch(console.log)

	// const updateChannel = new BroadcastChannel('precache-channel')

	// window.$workbox.then((worker: any) => {
	// 	console.log(worker)
	// 	// worker.precaching.addPlugins([
	// 	// 	new window.$workbox.broadcastUpdate.Plugin({
	// 	// 		channelName: 'precache-channel'
	// 	// 	})
	// 	// ])
	// 	worker.addEventListener('installed', function (event: any) {
	// 		console.log('install', self, event)
	// 	})

	// 	worker.addEventListener('activated', (event: any) => {
	// 		console.log('worker activated', event)

	// 		if (event.isUpdate) {
	// 			console.log('there is a update')
	// 		}
	// 	})

	// 	worker.addEventListener('message', (...args: any[]) =>
	// 		console.log('message', args)
	// 	)

	// 	worker.addEventListener('waiting', (...args: any[]) =>
	// 		console.log('waiting', args)
	// 	)

	// 	worker.addEventListener('updatefound', (...args: any[]) =>
	// 		console.log('updatefound', args)
	// 	)
	// })

	// updateChannel.addEventListener('message', event => {
	// 	console.log(event)
	// })
}

export default UpdaterPlugin
