module.exports = function(api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'module-resolver',
				{
					root: ["./"],
					alias: {
						"@styles": "./styles",
						"@assets": "./assets",
						"@screens": "./screens",
						"@components": "./components",
						"@utils": "./utils",
						"@controllers": "./controllers",
						"@lotties": "./lotties",
					}
				}
			],
			...[
				'react-native-classname-to-style',
				[
					'react-native-platform-specific-extensions', 
					{ extensions: ["scss", "sass"] }
				]
			]
		]
	}
};
