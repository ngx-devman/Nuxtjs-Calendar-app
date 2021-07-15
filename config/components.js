/**
 * Some times nuxt spits out warnings about components
 * having the same name. If this is happening, use this
 * in nuxt.config.js for the components config
 */
import fs from 'fs'
import path from 'path'

const dirs = ['~/components']
const componentDir = path.resolve('components')

fs.readdirSync(componentDir).forEach(file => {
	const filePath = path.resolve(componentDir, file)
	if (fs.lstatSync(filePath).isDirectory()) {
		dirs.push({
			path: filePath,
			prefix: file
		})
	}
})

export default {
	dirs
}
