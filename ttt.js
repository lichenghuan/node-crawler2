const puppeteer = require('puppeteer');

// 等待3000毫秒
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

const url = `https://movie.douban.com/explore#!type=movie&tag=%E7%BB%8F%E5%85%B8&sort=rank&page_limit=20&page_start=0`;
; (async () => {
    console.log('Start');

    // 启动一个浏览器
    const brower = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
        headless: false, //false 打开浏览器
        devtools: false, //打开浏览器开发工具
    });

    const page = await brower.newPage()   // 开启一个新页面

    // 去豆瓣那个页面
    await page.goto(url, {
        waitUntil: 'networkidle2'  // 网络空闲说明已加载完毕
    });

    await sleep(3000);

    // 页面加载更多按钮出现
    await page.waitForSelector('.more');

    // 只爬取两页的数据
    for (let i = 0; i < 1; i++) {
        await sleep(3000);
        // 点击加载更多
        await page.click('.more')
    }

    // 结果
    const result = await page.evaluate(() => {
        // 拿到页面上的jQuery
        var $ = window.$;
        var items = $('.list-wp a');
        var links = [];

        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item)
                let doubanId = it.find('div').data('id')

                let title = it.find('img').attr('alt')
                let rate = Number(it.find('strong').text())
                let poster = it.find('img').attr('src')

                links.push({
                    doubanId,
                    title,
                    rate,
                    poster
                })
            });
        }
        return links
    });

    // 关闭浏览器
    brower.close();

    console.log(result);

})();

