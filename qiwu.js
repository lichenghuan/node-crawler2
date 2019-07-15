// 奇舞周刊

const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        timeout: 0
    }); //默认超时时间为30000如果设零也不会超时 
    const page = await browser.newPage();
    const viewConfig = {
        width: 360,
        height: 640,
        isMobile: false
    };
    //设置窗口 
    page.setViewport(viewConfig);
    //跳转 
    await page.goto('https://weekly.75team.com/', {
        // waitUntil: 'networkidle2' // 等待网络状态为空闲的时候才继续执行 
    });
    //处理拿到需要的数据 
    const result = await page.evaluate(() => {
        // var list = [...document.querySelectorAll('#bd > div.issues.container > ol > li> a')]
        // console.log(list);
        // return list.map(el => {
        //     return {
        //         href: el.href.trim(),
        //         title: el.innerText
        //     }
        // })
        //方法二
        let data = [];
        let elements = document.querySelectorAll('.issue-list li');   //获取所有的li
      
        for (var element of elements) { // 循环
            let title = element.querySelector('a').innerHTML;
            let url = element.querySelector('a').href;     //抓取链接（href）属性
            let date = element.querySelector('.date').innerHTML;

            data.push({ title, url, date }); // 存入数组
        }
        return data;
    });
    //跳转到添加的页面
    // await page.goto('http://yourwebsite.com/add.html', {
    //     waitUntil: 'networkidle2'
    // });
    // console.log(result)    //转出数组
    //填充数据并提交
    // await page.type('#title', result.title);
    // await page.type('#url', result.url);
    // await page.type('#date', result.date);
    // await page.waitFor(1000);
    // await page.click('.submit');
    // await page.waitFor(3000);
    // browser.close(); 
})();