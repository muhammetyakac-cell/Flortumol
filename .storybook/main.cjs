/**
 * Storybook main configuration – Vite builder
 */
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react-vite',
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    // ensure Tailwind CSS works in storybook
    const { mergeConfig } = require('vite')
    return mergeConfig(config, {
      css: {
        postcss: require('postcss'),
      },
    })
  },
}
