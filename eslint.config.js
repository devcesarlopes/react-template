import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			import: importPlugin,
		},
		settings: {
			"import/resolver": {
				typescript: {
					project: "./tsconfig.json",
				},
			},
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			quotes: ["warn", "double"],
			semi: ["warn", "always"],
			"jsx-quotes": ["error", "prefer-double"],
			"@typescript-eslint/no-unused-vars": "off",
			"import/order": [
				"warn",
				{
					groups: [
						"builtin", // ex: fs, path, react, react-dom
						"external", // ex: lodash, axios
						"internal", // ex: @/*
						"parent", // ex: ../algo
						"sibling", // ex: ./algo
						"index", // ex: './'
					],
					pathGroups: [
						{
							pattern: "{react,vite}",
							group: "builtin",
							position: "before",
						},
						{
							pattern: "@/assets/**",
							group: "internal",
							position: "after",
						},
						{
							pattern: "@/components/**",
							group: "internal",
							position: "after",
						},
						{
							pattern: "@/**",
							group: "internal",
							position: "after",
						},
					],
					pathGroupsExcludedImportTypes: ["react"],
					distinctGroup: true,
					"newlines-between": "never",
					alphabetize: {
						order: "asc",
						caseInsensitive: true,
					},
				},
			],
		},
	},
);
