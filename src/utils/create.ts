import path from 'node:path'

import chalk from 'chalk'
import download from 'download-git-repo'
import fs from 'fs-extra'
import ora from 'ora'

import { APP_LIST } from '../constants/app.js'
import { CreateParams, DownloadAppParams } from '../types/index.js'

import { Plugin } from './../types/index.js'
import { createPlugin } from './plugin.js'

import { filePathExist, copyFile } from './index.js'

const DEFAULT_CREATE_PATH = process.cwd()
const spinner = ora()

export async function create({
  createType = 'app',
  createName = '', // 创建文件夹名称
  app,
  plugin
}: CreateParams): Promise<void> {
  try {
    const isApp = createType === 'app'
    if (isApp) {
      spinner.start(`begin to create the app named ${chalk.blue(createName)}`)
      await createApp({
        createName,
        app
      })
      spinner.succeed(chalk.blue('Create application successfully'))
    } else {
      spinner.start(`begin to create the ${plugin} plugin`)
      createPlugin(plugin)
      spinner.succeed(`Create ${chalk.blue(plugin)} plugin successfully`)
    }
  } catch (e) {
    spinner.fail(`Failed to create:${chalk.red(e.message || e.msg || 'unknown error')},${plugin}`)
    process.exit(1)
  }
}
/**
 * @description 创建 app
 * @date 2022-10-10 17:43:13
 */
const createApp = async ({ app, createName = '' }) => {
  const currentCreateAppInfo = APP_LIST.find(a => a.app === app)
  if (currentCreateAppInfo) {
    await downloadApp({ appInfo: currentCreateAppInfo, createName })
  } else {
    console.log(chalk.red(`The template ${app} is invalid!`))
    process.exit(1)
  }
}

// 下载应用
const downloadApp = async ({
  createPath = DEFAULT_CREATE_PATH,
  appInfo,
  createName = ''
}: DownloadAppParams) => {
  const { appPath, source } = appInfo
  const templatePath = path.join(createPath, createName)
  // 如果目录存在则直接停止创建
  const templatePathExist = await filePathExist(templatePath, false)
  if (!templatePathExist) {
    fs.mkdirSync(templatePath)
  }

  // 根据来源创建项目
  // 如果是repo类型 则从对应的 repo 地址下载即可
  // 如果是packages 则是从 packages 目录下 copy 过来
  switch (source) {
    case 'repo':
      return downloadFromRepo({ repoPath: appPath, templatePath })
    // case 'packages':
    //   return downloadFromPackages({ localPath: appPath, templatePath })
    default: {
      console.log(chalk.red(`The source ${source} is invalid!`))
      process.exit(1)
    }
  }
}

const downloadFromRepo = ({ repoPath = '', templatePath = '' }) => {
  return new Promise((resolve, reject) => {
    spinner.color = 'yellow'
    spinner.text = 'Pulling~'
    const name = path.basename(templatePath)
    download(repoPath, name, err => {
      if (err) {
        spinner.fail(chalk.red('Failed to pull remote template'))
        reject(err)
      }
      resolve('')
      spinner.succeed(`${chalk.blue('Pull remote template successfully')}`)
    })
  })
}

const downloadFromPackages = async ({ localPath = '', templatePath = '' }) => {
  const spinner = ora('Pulling remote template~').start()
  spinner.color = 'yellow'
  try {
    await copyFile(templatePath, localPath)
    spinner.color = 'green'
    spinner.succeed(`${chalk.blue('Pulling successfully')}`)
  } catch (e) {
    spinner.color = 'red'
    spinner.fail(chalk.red('Failed to pull'))
    process.exit(1)
  }
}
