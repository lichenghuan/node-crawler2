const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path"); //系统路径模块

// 等待1000毫秒
const sleep = time =>
    new Promise(resolve => {
        setTimeout(resolve, time);
    });

const URL = `https://www.zhipin.com/job_detail/`;

const Position = [
    { name: 'web', title: 'web前端' },
    { name: 'java', title: 'JAVA' },
    { name: 'php', title: 'PHP' },
    { name: 'python', title: 'Python' },
    { name: 'node', title: 'Node' },
    { name: 'cs', title: '测试' },
    { name: 'golang', title: 'Golang' },
    { name: 'sf', title: '算法' },
    { name: 'cp', title: '产品' },
    { name: 'ui', title: 'UI设计' },
    { name: 'android', title: '安卓' },
    { name: 'ios', title: 'IOS' },
    { name: 'ImpleEngineer', title: '实施工程师' },
    { name: 'maintenance', title: '运维工程师' }
];

(async () => {
    console.log("Start");
    // 1.启动一个浏览器--------------------------------------------------------
    const brower = await puppeteer.launch({
        args: ["--no-sandbox"],
        dumpio: false,
        headless: false, //false 打开浏览器，默认true
        devtools: true //打开浏览器开发工具
    });

    // 2.开启一个新页面--------------------------------------------------------
    const page = await brower.newPage();

    //设置窗口
    page.setViewport({
        width: 1024,
        height: 820,
        isMobile: false
    });

    // 3.前往那个页面--------------------------------------------------------
    await page.goto(URL, {
        waitUntil: "networkidle2" // 网络空闲说明已加载完毕
    });

    //4.页面进行操作(类似DOM操作)--------------------------------------------------------

    // await page.click('.search-form-con>.city-sel');
    // await page.waitFor(1000);
    // await page.hover('.city-box>.dorpdown-province>[ka=sel-province-27]');
    // await page.waitFor(1000);
    // await page.click('.dorpdown-city>.show>[ka=hot-city-101280600]'); //深圳

    for (let idx = 0; idx < Position.length; idx++) {

        // //清空输入框的值
        await page.$eval(".ipt-search", input => input.value = '');
        await page.type(".ipt-search", Position[idx].title, { delay: 100 });// 输入变慢，像一个用户
        await page.click(".btn-search");
        await page.waitFor(600); //等待600毫秒

        var arr = [];
        var x = 1;
        for (; ;) {
            result = await page.evaluate(() => {
                // 注意 在这里面做的操作都是在无头浏览器中执行的，例如以下的  console.log('running') ，它会在浏览器控制台中打印
                console.log('running...');
                var $ = window.$;
                var jsonArr = [];
                var flag = false;
                $(".job-list ul li").each((i, item) => {
                    var salaryRed = $(item).find("span.red").text();
                    if (!/天/ig.test(salaryRed)) {   //去掉包含 ‘天’ 的实习生岗位
                        var companyInfo = $(item).find(".company-text>p").html();
                        companyInfo = companyInfo.split('<em class="vline"></em>');
                        var primaryInfo = $(item).find(".info-primary>p").html();
                        primaryInfo = primaryInfo.split('<em class="vline"></em>');
                        jsonArr.push({
                            index: i,
                            position: $(item).find(".job-title").text(),
                            salary: salaryRed,
                            company: $(item).find(".company-text .name a").text(),
                            primaryInfo: primaryInfo,
                            companyInfo: companyInfo
                        });
                    }
                });
                if ($(".job-list .page .next.disabled").length > 0) { flag = true; }
                return { jsonArr: jsonArr, flag: flag };
            });
            if (result.flag) break;
            await page.click(".job-list .page .next");
            await page.waitFor(1000);
            arr = arr.concat(result.jsonArr);
            x++;
        }

        console.log(`共${x}页数据`);
        //指定创建目录及文件名称，__dirname为执行当前js文件的目录
        let file = path.join(__dirname, `./jsonData/${Position[idx].name}.json`);
        //写入文件
        fs.writeFile(file, JSON.stringify(arr), function (err) {
            if (err) { return console.log(err); }
            console.log("文件创建成功，地址：" + file);
        });
    }

    // 5.关闭浏览器--------------------------------------------------------
    await brower.close();
    console.log('End');
})();