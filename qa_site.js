const P=require('C:/nvm4w/nodejs/node_modules/hyperframes/node_modules/puppeteer-core');const fs=require('fs');
(async()=>{
 const b=await P.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--allow-file-access-from-files']});
 const out='qa_site';fs.mkdirSync(out,{recursive:true});const errs=[];
 for(const [name,w,h] of [['desk',1280,900],['mob',390,844]]){
  const pg=await b.newPage();await pg.setViewport({width:w,height:h});
  pg.on('pageerror',e=>errs.push(name+' pageerror '+e.message));pg.on('console',m=>{if(['error','warning'].includes(m.type()))errs.push(name+' console '+m.text())});
  pg.on('requestfailed',r=>errs.push(name+' reqfail '+r.url().slice(-60)));
  await pg.goto('file:///D:/CODEX/POWER%20BI/specs/research/bep/site/index.html',{waitUntil:'load'});
  await new Promise(r=>setTimeout(r,800));
  // interactions
  await pg.click('.fc[data-i="2"]'); 
  const t1=await pg.$eval('#fcInfo',e=>e.textContent.slice(0,30));
  await pg.evaluate(()=>{const e=document.querySelector('#inRev');e.value=1200;e.dispatchEvent(new Event('input'))});
  const sim=await pg.evaluate(()=>[...document.querySelectorAll('.simk b')].map(e=>e.textContent).join('|')+' :: '+document.querySelector('#simj').textContent);
  await pg.click('.layer[data-i="1"]'); await pg.click('.tab:nth-child(4)'); await pg.click('#pshot .hs'); 
  const hs=await pg.$eval('#hsInfo',e=>e.textContent.slice(0,40));
  await pg.click('.step:nth-child(4)'); await pg.click('.node[data-k="fx"]'); await pg.click('.flip[data-i="2"]');
  const ni=await pg.$eval('#nodeInfo',e=>e.textContent.slice(0,40));
  console.log(name,{t1,sim,hs,ni});
  await pg.screenshot({path:`${out}/${name}_full.png`,fullPage:true});
  await pg.close();
 }
 console.log('ERRS',errs);
 await b.close();
})();
