/**
 * @description less-loader 配置
 * @param config
 * @returns {{loader: string, options: {sourceMap: boolean, additionalData: string, lessOptions: {javascriptEnabled: boolean}}}}
 */
const Loader = (config) => {
	const { sourceMap = true } = config
	return {
		loader: require.resolve("less-loader"),
		options: {
			sourceMap,
			lessOptions: {
				javascriptEnabled: true
			}

			// additionalData: `
			// 	@import "@/assets/styles/variables.less";
			// 	@import "@/assets/styles/mixins.less";
			// `
		}
	}
}

module.exports = Loader
