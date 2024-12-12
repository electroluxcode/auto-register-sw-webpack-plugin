/**
 * @description sass-loader 配置
 * @param config
 * @returns {{loader: string, options: {sourceMap: boolean, additionalData: string, lessOptions: {javascriptEnabled: boolean}}}}
 */
const Loader = (config) => {
	const { sourceMap = true } = config
	return {
		loader: require.resolve("sass-loader"),
		options: {
			sourceMap
		}
	}
}

module.exports = Loader
