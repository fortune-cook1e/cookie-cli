import path from 'node:path'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import ora from 'ora'

import { Plugin, PluginConfigJson } from './../types/index.js'

import { checkFileIfExists, readJson, writeJson, mergeObject, copyFile } from './index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PKG_JSON = 'package.json'

const DEFAULT_CREATE_PATH = process.cwd()

/**
 * @description 读取对应插件的配置json文件
 * @description 每个json文件必须有3or4个字段：config、devDependencies、dependencies、checkFiles
 * @param {Plugin} plugin
 * @date 2022-10-16 18:01:03
 * @return {PluginConfigJson}
 */
function getPluginConfigJson(plugin: Plugin): PluginConfigJson {
  const configJsonPath = path.resolve(__dirname, `../configs/${plugin}/config.json`)
  return readJson(configJsonPath)
}

// 检查插件配置文件是否已存在
function checkConfigFiles(plugin: Plugin, checkFiles: string[]) {
  const hasPkg = checkFileIfExists([PKG_JSON])
  const file = checkFileIfExists(checkFiles)
  if (!hasPkg) {
    throw new Error(`${PKG_JSON} 文件不存在`)
  }
  if (file) {
    throw new Error(`${file} 已存在`)
  }
}

/**
 * @description 创建插件
 * @param {Plugin} plugin
 * @date 2022-10-16 18:11:15
 * @return {void}
 */
export function createPlugin(plugin: Plugin) {
  const spinner = ora().start()
  const {
    packageInfo,
    input: { checkFiles = [], templateFiles = [], config },
    output: { files = [] }
  } = getPluginConfigJson(plugin)
  checkConfigFiles(plugin, checkFiles)

  const originPkgPath = path.resolve(DEFAULT_CREATE_PATH, './package.json')

  try {
    const originPackage = readJson(originPkgPath)

    // 1. 先合并package.json 并重新覆盖package.json
    const newPackage = mergeObject({
      originObj: packageInfo,
      targetObj: originPackage,
      mergeKeys: Object.keys(packageInfo)
    })
    writeJson({
      writePath: originPkgPath,
      writeData: newPackage
    })

    // 2. 确定创建配置文件的方法
    //  2.1 创建文件的方法有2种：1）根据config读取 2）直接利用模板创建
    const createdByConfig = !!config

    // 输出文件
    // FixMe: 这里需要注意 输出js文件时 文件末尾会出现 export {}
    const createdFileNamesStr = files.join(',')

    if (createdByConfig) {
      let filename = files[0] || 'unknown-name'
      const createPath = path.resolve(DEFAULT_CREATE_PATH, filename)
      writeJson({
        writePath: createPath,
        writeData: config
      })
    } else {
      templateFiles.forEach((file: string, index: number) => {
        const templateFilePath = path.resolve(__dirname, `../configs/${plugin}/${file}`)
        const createFilename = files[index]
        const createPath = DEFAULT_CREATE_PATH + `/${createFilename}`
        console.log('creat path..', { createPath, templateFilePath })
        copyFile(templateFilePath, createPath)
      })
    }

    spinner.succeed(`创建 ${chalk.blue(createdFileNamesStr)} 文件成功`)
  } catch (e) {
    console.log({ e })
    throw new Error(e)
  }
}
