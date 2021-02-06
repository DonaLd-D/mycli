#!/usr/bin/env node

const { program } = require('commander');
const fs = require("fs");
const inquirer = require('inquirer');
const templates = require('./templates/index');

function strToArr(value, preValue){
    return value.split(',')
}

program.version(require('./package').version, '-v, --version', 'cli的最新版本');

program
    .option('-d, --debug', '调试一下')
    .option('-l, --list <value>', '把字符串分割为数组', strToArr)
    .action((options, command) => {
        if(options.debug) {
            console.log("调试成功")
        }
        if(options.list !== undefined) {
            console.log(options.list)
        }
    });

let prompList = [
    {
        type:'list',
        name: 'template',
        message: '请选择你想要生成的模板？',
        choices: templates,
        default: templates[0]
    }
]

program
    .command('create <filename>')
    .description('创建一个文件')
    .action(async (filename) => {
        const res=await inquirer.prompt(prompList)
        if(res.template === 'reactClass') {
            templates.forEach((item) => {
                if(item.name === 'reactClass') {
                    fs.writeFile(`./${filename}.jsx`, item.src(filename), function(err) {
                        if(err) {
                            console.log('创建失败：', err)
                        } else {
                            console.log(`创建文件成功！${filename}.jsx`);
                        }
                    })
                }
            })
        }
        if(res.template === 'vueTemplate') {
            templates.forEach((item) => {
                if(item.name === 'vueTemplate') {
                    fs.writeFile(`./${filename}.vue`, item.src(), function(err) {
                        if(err) {
                            console.log('创建失败：', err)
                        } else {
                            console.log(`文件创建成功！${filename}`);
                        }
                    })
                }
            })
        } 
    })

program
    .command('create-f <folder>')
    .description('创建一个文件夹')
    .action((folder) => {
        if(fs.existsSync(folder)) {
            console.log('文件夹已存在')
        } else {
            fs.mkdirSync(folder);
            console.log('文件夹创建成功')
        }
    });

program.parse(process.argv);
