const puppeteer = require('puppeteer');
const _cl = require('console-color-mr');

// 等待1000毫秒
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
})


const URL = `https://movie.douban.com/explore#!type=movie&tag=%E7%BB%8F%E5%85%B8&sort=rank&page_limit=20&page_start=0`;

; (async () => {

    console.log('Start');

    // 1.启动一个浏览器--------------------------------------------------------
    const brower = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
        headless: true, //false 打开浏览器，默认true
        devtools: false, //打开浏览器开发工具
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

    //注入jquery
    // await page.addScriptTag({
    //     url: "https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"
    // });


    //4.页面进行操作--------------------------------------------------------

    // const content = await page.content();  //返回页面的完整 html 代码，包括 doctype。
    // console.log(content)

    // const cookies = await page.cookies();  //page.cookies([...urls]) 如果不指定任何 url，此方法返回当前页面域名的 cookie。 如果指定了 url，只返回指定的 url 下的 cookie。
    // console.log(cookies);

    // var htmlCont = await page.$('#content');   //page.$(selector);  此方法在页面内执行 document.querySelector。如果没有元素匹配指定选择器，返回值是 null。
    // console.log(htmlCont);

    // var pageTitle = await page.$eval('.nav-logo>a', (el) => {    //DOM 操作
    //     var cont = {
    //         'innerHtml': el.innerHTML,
    //         'href': el.href,
    //         'outerHTML': el.outerHTML
    //     }
    //     return cont;
    // });
    // console.log(pageTitle)

    //注入jquery
    // await page.addScriptTag({
    //     url: "https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"
    // });


    // 点击搜索框拟人输入  
    // await page.type('#inp-query', '肖申克的救赎', { delay: 0 });
    // await page.keyboard.press('Enter');  // 回车

    await sleep(1000);

    await page.waitForSelector('.more');  // 页面'加载更多'按钮出现

    // 只爬取两页的数据
    for (let i = 0; i < 1; i++) {
        await sleep(1000);
        await page.click('.more')  // 点击'加载更多'按钮   page.click(selector[, options]);  selector-要点击的元素的选择器。 如果有多个匹配的元素, 点击第一个。
    }

    // 结果
    const result = await page.evaluate(() => {  // page.evaluate方法就是在浏览器中植入javaScript代码,这些代码都是在浏览器里执行的，比如你在evaluate方法中执行console.log('puppeteer'),你在你的执行终端是看不到输出的，你需要在浏览器的console那去看。
        // 拿到页面上的jQuery  如果网站有jquery也可以直接用，没有的话需要外部注入
        var $ = window.$;
        var items = $('.list-wp a');
        var links = [];
        if (items.length >= 1) {
            items.each((index, item) => {
                console.log(item);
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

        return links;
    });



    // console.log(JSON.stringify(result));

    // await page.waitFor(2500); //等待2500毫秒 

    // await page.screenshot({
    //     path: './example.png',  //截图保存路径。
    //     type: 'png',  //指定截图类型, 可以是 jpeg 或者 png , 默认 'png'
    //     fullPage: true,  //如果设置为true，则对完整的页面（需要滚动的部分也包含在内）。默认是false
    // });  // 页面截图并保存；有些图片还没加载完成就截图了，所以最好结合 page.waitFor() 使用


    // 5.关闭浏览器--------------------------------------------------------
    await brower.close();

})();

