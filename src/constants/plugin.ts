import { PluginItem, Plugin } from '../types/index.js'

// eslint template
export const ESLINT_BASIC = 'eslint-basic'
export const ESLINT_TYPESCRIPT = 'eslint-typescript'
export const ESLINT_REACT = 'eslint-react'
export const ESLINT_TS_REACT = 'eslint-typescript-react'
export const ESLINT_VUE = 'eslint-vue'

// stylelint template
export const STYLELINT_BASIC = 'stylelint-basic'

// ts template
export const TSCONFIG_BASIC = 'tsconfig-basic'

export const PLUGINS: PluginItem[] = [
  {
    title: 'Prettier',
    plugin: Plugin.Prettier
  },
  {
    title: 'Stylelint-Less',
    plugin: Plugin.StylelintLess
  },
  {
    title: 'Eslint + React + ts',
    plugin: Plugin.EslintReactTs
  },
  {
    title: 'commit-lint',
    plugin: Plugin.CommitLint
  },
  {
    title: 'tsconfig-node-esm',
    plugin: Plugin.TsNodeEsm
  },
  {
    title: 'tsconfig-react',
    plugin: Plugin.TsconfigReact
  },
  {
    title: 'babel-react-app',
    plugin: Plugin.BabelReactApp
  },
  {
    title: 'babel-react-library',
    plugin: Plugin.BabelReactLibrary
  }
]
