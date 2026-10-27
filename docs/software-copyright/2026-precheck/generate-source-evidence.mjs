/**
 * Internal source evidence generator. Original files are copied unchanged.
 * This is NOT a lawful assertion that AI was unused; developer has used Codex.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const target=path.join(repo,'_copyright_evidence_2026');
const apps=[
 {id:'01-image-embroidery',title:'梨花季图像分色与数字绣稿辅助设计软件',entry:'#create',core:['assets/engine.js'],integration:['app.js','index.html'],reference:['assets/embroidery-export.js','pages.css']},
 {id:'02-story-pattern',title:'梨花季故事语义驱动的传统纹样辅助创作软件',entry:'#story',core:['assets/intent-engine.js','assets/knowledge-retriever.js','assets/story-page.js','assets/story-session.js'],integration:['assets/engine.js','app.js','index.html'],reference:['content/cultural-knowledge.json','content/sources.json','contracts/story-to-intent.schema.json','assets/story.css']},
 {id:'03-stitch-lab',title:'梨花季苏绣数字针迹交互教学软件',entry:'#ar / 数字针迹实验室',core:['assets/stitch-lab.js','assets/stitch/StitchPlayer.js','assets/stitch/StitchRenderer.js','assets/stitch/StitchSurface.js','assets/stitch/SantaoTimeline.js','assets/stitch/SantaoVisual.js','assets/stitch/SantaoExperience.js'],integration:['app.js'],reference:['assets/stitch-lab.css','content/stitch-demos/demo-straight-basic.json','content/stitch-demos/demo-tao-basic.json','content/stitch-demos/demo-gun-basic.json','content/stitch-demos/demo-santao-pear-petal.json']},
 {id:'04-ar-layered',title:'梨花季传统纹样增强现实识别与分层展示软件',entry:'#ar / AR 绣境',core:['assets/ar-experience.js','assets/ar/LayeredPattern.js','assets/ar/TrackingState.js','assets/ar/Tween.js','assets/ar/CraftOverlay.js','assets/ar/svg-layers.js'],integration:['app.js','assets/ar/SantaoARAdapter.js'],reference:['assets/ar-experience.html','assets/ar-experience.css','assets/ar-assets/targets.json']}
];

function safeFile(relative){
 if(relative.startsWith('/')||relative.includes('..')||relative.includes('\\')||!/^[\w./-]+$/.test(relative))throw Error('Unsafe path: '+relative);
 const p=path.resolve(repo,relative);
 if(!p.startsWith(repo+path.sep)||!fs.statSync(p).isFile())throw Error('Not a file '+relative);
 return p;
}
let revision='unknown';
try{revision=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim()}catch{}
fs.rmSync(target,{recursive:true,force:true});
fs.mkdirSync(target,{recursive:true});
const refs=new Map();
const totals=[];
for(const app of apps){
 const dir=path.join(target,app.id);fs.mkdirSync(dir,{recursive:true});
 const files=[];
 for(const role of ['core','integration','reference'])for(const relative of app[role]){
  const source=safeFile(relative);const bytes=fs.readFileSync(source);
  const sha=crypto.createHash('sha256').update(bytes).digest('hex');
  const dest=path.join(dir,'original',relative);
  fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);
  const decoded=bytes.toString('utf8');
  const physicalLines=decoded?decoded.split('\n').length-(decoded.endsWith('\n')?1:0):0;
  files.push({path:relative,role,bytes:bytes.length,physicalLines,sha256:sha});
  refs.set(relative,[...(refs.get(relative)||[]),app.id+':'+role]);
 }
 const manifest={status:'INTERNAL-ONLY-NOT-APPLICATION',generatedAt:new Date().toISOString(),
  repository:'yzou6525-ai/lihuaji',revision,title:app.title,entry:app.entry,
  aiDisclosure:'AI assistant Codex used in the real development history. Never certify that no AI was used.',
  caveats:['This is a source snapshot not a verified independent executable.','The integration files are shared by multiple modules.','Third-party vendor source files are excluded.','Physical line counts may be compressed/minified.','Authenticity, copyright ownership, release dates, and legality must be established by applicant.'],
  files};
 fs.writeFileSync(path.join(dir,'MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
 const md=['# '+app.title,'','内部核验用原始源码快照，不可冒充正式登记材料。','','仓库提交：'+revision,'真实网页入口：'+app.entry,
 '','## 源文件明细','','| 分类 | 相对路径 | 物理行数 | 字节数 | SHA-256 |','|---|---|---:|---:|---|'];
 for(const f of files)md.push('| '+f.role+' | '+f.path+' | '+f.physicalLines+' | '+f.bytes+' | '+f.sha256+' |');
 md.push('','第三方组件、跨软件公共代码、AI辅助开发必须如实披露；实际可独立运行能力尚未通过此脚本证明。','');
 fs.writeFileSync(path.join(dir,'FILE-INDEX.md'),md.join('\n'));
 totals.push({id:app.id,title:app.title,files:files.length,corePhysicalLines:files.filter(x=>x.role==='core').reduce((n,x)=>n+x.physicalLines,0)});
}
const overlaps=[...refs].filter(([,uses])=>uses.length>1).map(([file,uses])=>({file,uses}));
fs.writeFileSync(path.join(target,'CROSS-MODULE-REFERENCES.json'),JSON.stringify({revision,overlaps,totals},null,2)+'\n');
fs.writeFileSync(path.join(target,'READ-ME-FIRST.txt'),
 'INTERNAL EVIDENCE ONLY. Not a registration application, not signed documents.\n'+
 'AI assistance occurred during software development. Do not certify otherwise.\n'+
 'Original files copied byte-for-byte from the checkout; note shared modules and vendor dependencies.\n');
console.log(JSON.stringify({directory:target,revision,totals,overlaps:overlaps.length},null,2));
