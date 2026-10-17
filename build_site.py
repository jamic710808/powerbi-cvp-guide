# template → site/index.html；圖片用相對路徑（部署到 Vercel 時隨 assets/ 一起上傳），章節秒數取自 film/timeline.json
import json,shutil,os
t=open('src/explainer.template.html',encoding='utf-8').read()
TL=json.load(open('film/timeline.json',encoding='utf-8'))
names={'s01':'開場','s02':'量價本利','s03':'保本公式','s04':'兩層分析','s05':'首頁','s06':'第1頁 經營概覽','s07':'第2頁 原生','s08':'第3頁 HTML','s09':'第4頁 單品','s10':'第5頁 口徑','s11':'資料模型','s12':'結語'}
CH=[[names[s['k']],round(s['T'],1)] for s in TL['scenes']]
d={}
for i in range(6):
    d[f'p{i}']=f'assets/p{i}.jpg'; d[f'p{i}_s']=f'assets/p{i}_s.jpg'; d[f'p{i}_hi']=f'assets/p{i}_hi.jpg'
assert '/*IMGS*/{}' in t and '/*CHAPTERS*/[]' in t and '/*CHAPTERS2*/[]' in t
AN=json.load(open('../cvp-animation/timeline.json',encoding='utf-8'))
an_names={'s01':'月會','s02':'量價本利','s03':'保本線','s04':'兩層六頁','s05':'經營概覽','s06':'公司層','s07':'旗艦君','s08':'口徑與模型','s09':'回到會議室'}
CH2=[[an_names[s['id']],round(s['startFrame']/30,1)] for s in AN['scenes']]
t=t.replace('/*IMGS*/{}',json.dumps(d)).replace('/*CHAPTERS*/[]',json.dumps(CH,ensure_ascii=False)).replace('/*CHAPTERS2*/[]',json.dumps(CH2,ensure_ascii=False))
os.makedirs('site/assets',exist_ok=True)
for f in os.listdir('assets'):
    if f.endswith('_film.jpg'): continue
    shutil.copy(f'assets/{f}',f'site/assets/{f}')
open('site/index.html','w',encoding='utf-8').write(t)
print('ok',len(t)//1024,'KB',CH)

# 動畫版影片與封面（來源：cvp-animation/site）
shutil.copy('../cvp-animation/site/animation.mp4','site/animation.mp4');shutil.copy('../cvp-animation/site/poster.jpg','site/anim-poster.jpg')
