module.exports = {
	content: ["./web/**/*.tsx"],
	theme: {
		colors: {
      darkgrey: "#111",
			grey: "#222",
			lightgrey: "#ccc",
			white: "#fff",
			purple: "#9a9cea",
			blue: "#a2b9ee",
			cyan: "#a2dcee",
			green: "#adeee2",
			transparent: "transparent"
		},
		fontFamily: {
			switzer: ["Switzer","sans-serif"]
		},
		extend: {
        spacing: {
          "128": "32rem",
          "192": "48rem",
          "256": "64rem"
        },
      }
			},
	plugins: []
}
