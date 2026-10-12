# template → site/index.html；圖片用相對路徑（部署到 Vercel 時隨 assets/ 一起上傳），章節秒數取自 film/timeline.json
import json,shutil,os
t=open('src/explainer.template.html',encoding='utf-8').read()
TL=json.load(open('film/timeline.json',encoding='utf-8'))
names={'s01':'開場','s02':'量價本利','s03':'保本公式','s04':'兩層分析','s05':'首頁','s06':'第1頁 經營概覽','s07':'第2頁 原生','s08':'第3頁 HTML','s09':'第4頁 單品','s10':'第5頁 口徑','s11':'資料模型','s12':'結語'}
CH=[[names[s['k']],round(s['T'],1)] for s in TL['scenes']]
d={}
for i in range(6):
    d[f'p{i}']=f'assets/p{i}.jpg'; d[f'p{i}_s']=f'assets/p{i}_s.jpg'; d[f'p{i}_hi']=f'assets/p{i}_hi.jpg'
assert '/*IMGS*/{}' in t and '/*CHAPTERS*/[]' in t
t=t.replace('/*IMGS*/{}',json.dumps(d)).replace('/*CHAPTERS*/[]',json.dumps(CH,ensure_ascii=False))
os.makedirs('site/assets',exist_ok=True)
for f in os.listdir('assets'):
    if f.endswith('_film.jpg'): continue
    shutil.copy(f'assets/{f}',f'site/assets/{f}')
open('site/index.html','w',encoding='utf-8').write(t)
print('ok',len(t)//1024,'KB',CH)
