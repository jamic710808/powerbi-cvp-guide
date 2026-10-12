// 線上公開版儀表板 → 逐頁 2.5× 截圖（頁面為 1200×1500 直式 ActualSize，只截 .displayArea）
// 為什麼不用 Desktop Bridge：直式頁面超出視窗，只截得到上半部，且原生圖表頁會是空的
const fs=require('fs'),path=require('path');
let P;for(const t of ['puppeteer-core','C:/nvm4w/nodejs/node_modules/hyperframes/node_modules/puppeteer-core']){try{P=require(t);break}catch{}}
const URL=process.argv[2], OUT=path.resolve(process.argv[3]||'online');
const PAGES=['報告首頁','經營概覽','公司量本利分析','公司保本與利潤模擬','單品貢獻與保本模擬','口徑說明'];
(async()=>{
 const b=await P.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--hide-scrollbars']});
 const pg=await b.newPage(); await pg.setViewport({width:1300,height:1650,deviceScaleFactor:2.5});
 await pg.goto(URL,{waitUntil:'networkidle2',timeout:90000});
 fs.mkdirSync(OUT,{recursive:true});
 for(let i=0;i<PAGES.length;i++){
  if(i>0){ await pg.evaluate(()=>{[...document.querySelectorAll('button')].find(b=>b.getAttribute('aria-label')==='下一頁').click()}); await pg.mouse.move(5,5); }
  await new Promise(r=>setTimeout(r,i===0?9000:7000));
  const box=await pg.evaluate(()=>{const r=document.querySelector('.displayArea').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}});
  await pg.screenshot({path:path.join(OUT,`o${i}.png`),clip:box});
  console.log(i,PAGES[i],JSON.stringify(box));
 }
 await b.close();
})();
