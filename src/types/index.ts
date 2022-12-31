export type CreateType = 'app' | 'plugin'

export type AppType = 'react' | 'vue'

export enum App {
  react_webpack_vite_app = 'react_webpack_vite_app' // react+webpack+vite
  // REACT_QK_SUB_APP, // react qiankun 子应用模板 (react-router-dom 采用v6)
  // REACT_QK_MAIN_APP, // react qiankun 基座应用
}

export enum Plugin {
  EslintReactTs = 'eslint-react-ts', // react + ts 的eslint插件
  TsNodeEsm = 'ts-node-esm', // tsconfig的esm环境开发
  StylelintLess = 'stylelint-less', // stylelint
  Prettier = 'prettier', // prettier配置
  CommitLint = 'commit-lint', // commitLint配置
  TsconfigReact = 'tsconfig-react', // tsconfig react配置
  BabelReactApp = 'babel-react-app', // babel 普通项目配置
  BabelReactLibrary = 'babel-react-library' // babel react库
}

export type Source = 'repo'

export interface CreateParams {
  createType: CreateType
  createPath?: string // 创建路径
  createName?: string // 创建应用的名称
  app?: App
  plugin?: Plugin
}

export interface DownloadAppParams {
  createPath?: string
  createName: string
  appInfo: AppItem
}

export interface AnyOptions {
  [propname: string]: any
}

export interface AppItem {
  title: string
  appPath: string
  app: App
  appType: AppType
  source: 'repo' | 'template'
}

export interface PluginItem {
  title: string
  plugin: Plugin
}

export interface QuestionItem {
  type: 'input' | 'list'
  name: string
  message: string
  choices: string[] | { name: string; value: App | string }[]
}

export interface PluginConfigJson {
  packageInfo: {
    devDependencies?: AnyOptions
    dependencies?: AnyOptions
    scripts?: AnyOptions
  }
  input: {
    checkFiles: string[]
    templateFiles: string[]
    config?: AnyOptions | null
  }
  output: {
    files: string[]
  }
}
