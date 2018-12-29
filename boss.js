const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path'); //系统路径模块

// 等待1000毫秒
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

const URL = `https://www.zhipin.com/job_detail/`;

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
    var info = 'ios';

    // await page.click('.search-form-con>.city-sel');
    // await page.waitFor(1000);
    // await page.hover('.city-box>.dorpdown-province>[ka=sel-province-27]');
    // await page.waitFor(1000);
    // await page.click('.dorpdown-city>.show>[ka=hot-city-101280600]'); //深圳

    await page.type('.ipt-search', info);

    await page.click('.btn-search');

    await page.waitFor(1000); //等待1000毫秒 

    var arr = [];
    var x = 1;
    for (; ;) {
        result = await page.evaluate(() => {
            var $ = window.$;
            var jsonArr = [];
            var flag = false;
            $('.job-list ul li').each((i, item) => {
                var companyInfo = $(item).find('.company-text>p').html();
                companyInfo = companyInfo.split('<em class="vline"></em>');
                var primaryInfo = $(item).find('.info-primary>p').html();
                primaryInfo = primaryInfo.split('<em class="vline"></em>');
                jsonArr.push({
                    'index': i,
                    'position': $(item).find('.job-title').text(),
                    'salary': $(item).find('span.red').text(),
                    'company': $(item).find('.company-text .name a').text(),
                    'primaryInfo': primaryInfo,
                    'companyInfo': companyInfo,
                })
            })
            if ($('.job-list .page .next.disabled').length > 0) {
                flag = true;
            }
            return { 'jsonArr': jsonArr, 'flag': flag };
        });
        if (result.flag) {
            break;
        }
        await page.click('.job-list .page .next');
        await page.waitFor(1000);
        arr = arr.concat(result.jsonArr);
        x++;
    }
    // console.log(JSON.stringify(arr));
    console.log(`共${x}页数据`)
    //指定创建目录及文件名称，__dirname为执行当前js文件的目录
    var file = path.join(__dirname, `./jsonData/ios.json`);
    //写入文件
    fs.writeFile(file, JSON.stringify(arr), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('文件创建成功，地址：' + file);
    });

    // 5.关闭浏览器--------------------------------------------------------
    await brower.close();

})();

