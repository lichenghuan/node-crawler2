const puppeteer = require('puppeteer');

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
        headless: false, //false 打开浏览器，默认true
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
            console.log(ele)
            let username = $(ele).find('.username  .user-popover-box a').text();
            let title = $(ele).find('.title').text();
            data.push({ title, username, i }); // 存入数组
        })
        return data;
    });

    console.log(result)

    // 5.关闭浏览器--------------------------------------------------------
    // await brower.close();

})();

