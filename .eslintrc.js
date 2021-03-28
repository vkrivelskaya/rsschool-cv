module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "single"],
        "default-case": ["error", { "commentPattern": "^skip\\sdefault" }],
        "keyword-spacing": ["error", { "after": true }]
    }
};