import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            '@next/next': nextPlugin,
            'unused-imports': unusedImports,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
            'react-hooks/exhaustive-deps': 'off',
            '@next/next/no-document-import-in-page': 'off',
            'quotes': [1, 'single'],
            'semi': [1, 'always'],
            'indent': [1, 4, { 'SwitchCase': 1 }],
            'object-curly-spacing': [1, 'always'],
            'no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'off',
            'unused-imports/no-unused-vars': 'off',
            'no-undef': 'warn',
            'no-unreachable': 'warn',
            'no-fallthrough': 'warn',
            'no-constant-binary-expression': 'warn',
            'no-unsafe-optional-chaining': 'warn',
            'no-extra-boolean-cast': 'warn',
            'no-prototype-builtins': 'warn',
            'no-case-declarations': 'warn'
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly'
            }
        }
    }
];