// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  ignores: [
    'components/ui/*.tsx',
    'tailwind.config.js',
  ],
})