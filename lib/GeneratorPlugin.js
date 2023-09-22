const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const program = require('commander')
const chalk = require('chalk')
const ora = require('ora');
const spawn = require('cross-spawn');
const {reset} = require("chalk");

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    console.log(`\r\nSuccessfully created plugin ${chalk.cyan(args[2].pluginName)}`)
    console.log(`\r\ncd ${chalk.cyan(args[2].pluginName)}`)
    console.log('npm run serve\r\n')
    return result;
  } catch (error) {
    console.log(error)
    // 状态为修改为失败
    spinner.fail('生成插件失败 ...')
  }
}

async function createProject(destPath,templatePath,projectInfo) {
  fs.mkdir(destPath,{recursive: true},(err)=>{
    if (err){
      // console.error('目录创建失败')
    }else {
      // 从模版目录中读取文件
      fs.readdir(templatePath, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          checkPathType(path.join(templatePath,file)).then(res=>{
            if (res==='文件'){
              // 使用 ejs 渲染对应的模版文件
              // renderFile（模版文件地址，传入渲染数据）
              if(file==='index.html'){
                fs.copyFile(path.join(templatePath, file),path.join(destPath, file),(err)=>{
                  // console.error(err)
                })
              }else {
                ejs.renderFile(path.join(templatePath, file), projectInfo).then(data => {
                  // 生成 ejs 处理后的模版文件
                  fs.writeFileSync(path.join(destPath, file) , data)
                }).catch(err=>{
                  console.error(err)
                })
              }
            }else {
              createProject(path.join(destPath,file),path.join(templatePath,file),projectInfo);
            }
          }).catch(err => {
            console.error(`无法确定 ${res} 的类型: ${err}`)
          })
        })
      })
    }
  })
}

function checkPathType(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        // 如果出现错误，说明路径不存在或无法访问
        reject(err);
      } else {
        if (stats.isFile()) {
          // 如果是文件
          resolve('文件');
        } else if (stats.isDirectory()) {
          // 如果是文件夹（目录）
          resolve('文件夹');
        } else {
          // 如果既不是文件也不是文件夹
          resolve('未知');
        }
      }
    });
  });
}

class Generator {
  constructor (name, targetDir){
    // 插件名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
  }


  // 核心创建逻辑
  // 使用本地模版创建
  async create(){
    inquirer.prompt([
      {
        type: 'list',
        name: 'pluginType',
        message: '请选择插件类型',
        default: 'ui',
        choices: [
          { name: 'UI', value: 'ui' },
          { name: '系统', value: 'system' },
        ]
      },
      {
        type: 'input',
        name: 'pluginDesc',
        message: '请输入插件描述',
        default: '这是一个Rubick插件'
      },
      {
        type: 'input',
        name: 'version',
        message: '请输入版本号',
        default: '0.0.1'
      },
      {
        type: 'input',
        name: 'author',
        message: '请输入作者',
        default: '再难也要坚持'
      },
    ]).then(projectInfo => {
      projectInfo.pluginName = this.name
      if (projectInfo.pluginType === 'system') {
        console.log(chalk.red('创建失败，系统插件模版快马加鞭开发中...'))
        return;
      }
      // 模版文件目录
      const templatePath = path.join(path.dirname(__dirname), 'templates');
      // 生成文件目录
      const destPath = process.cwd() + '/' + this.name;
      wrapLoading(createProject,'生成插件中......',destPath, templatePath, projectInfo)
    })
  }
}

module.exports = Generator;
