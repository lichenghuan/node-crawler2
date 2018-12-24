const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path'); //系统路径模块

// 等待1000毫秒
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

const URL = `https://juejin.im/`;

; (async () => {
    console.log('Start');
    // 1.启动一个浏览器--------------------------------------------------------
    const brower = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
        headless: true, //false 打开浏览器，默认true
        devtools: true, //打开浏览器开发工具
    });

    // 2.开启一个新页面--------------------------------------------------------
    const page = await brower.newPage()

    //设置窗口 
    page.setViewport({
        width: 1024,
        height: 820,
        isMobile: false
    });

    // 3.前往那个页面--------------------------------------------------------
    await page.goto(URL, {
        waitUntil: 'networkidle2'  // 网络空闲说明已加载完毕
    });

    //4.页面进行操作--------------------------------------------------------

    //注入jquery
    await page.addScriptTag({
        url: "https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"
    });

    // 结果
    const result = await page.evaluate(() => {
        let data = [];
        let elements = $('.info-box');   //获取所有的li
        elements.each((i, ele) => {
            console.log(ele);
            let username = $(ele).find('.username  .user-popover-box a').text();
            let title = $(ele).find('.title').text();
            data.push({ title, username, i }); // 存入数组
        })
        return data;
    });

    //指定创建目录及文件名称，__dirname为执行当前js文件的目录
    var file = path.join(__dirname, 'juejin.json');

    //写入文件
    fs.writeFile(file, JSON.stringify(result), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('文件创建成功，地址：' + file);
    });

    // 5.关闭浏览器--------------------------------------------------------
    // await brower.close();

})();

