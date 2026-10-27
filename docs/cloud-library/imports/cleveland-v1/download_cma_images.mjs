// CMA official-source downloader. Node 18+; run from repository root.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.dirname(new URL(import.meta.url).pathname);
const manifest=JSON.parse(await fs.readFile(path.join(root,'CMA_50_TARGETS.json'),'utf8'));
const output=path.join(root,'sources'); await fs.mkdir(output,{recursive:true});
const accessions=[...new Set(manifest.candidates.map(x=>x.accessionNumber))];
const report=[];
async function download(url){
 const u=new URL(url);
 if(u.protocol!=='https:' || !(u.hostname==='clevelandart.org'||u.hostname.endsWith('.clevelandart.org')))throw Error('unapproved host: '+u.host);
 const res=await fetch(url,{signal:AbortSignal.timeout(45000)});
 if(!res.ok)throw Error('HTTP '+res.status);
 const dest=new URL(res.url);
 if(dest.protocol!=='https:'||!(dest.hostname==='clevelandart.org'||dest.hostname.endsWith('.clevelandart.org')))throw Error('redirected to unapproved host: '+dest.host);
 return res;
}
for(const accessionNumber of accessions){
 try {
  const endpoint='https://openaccess-api.clevelandart.org/api/artworks/'+encodeURIComponent(accessionNumber);
  const item=(await(await download(endpoint)).json()).data;
  if(!item||item.accession_number!==accessionNumber)throw Error('accession mismatch');
  if(String(item.share_license_status).toUpperCase()!=='CC0')throw Error('not CC0');
  const imageUrl=item.images?.print?.url||item.images?.web?.url;
  if(!imageUrl)throw Error('no official image');
  const image=await download(imageUrl);
  const bytes=Buffer.from(await image.arrayBuffer());
  if(bytes.byteLength<1024||bytes.byteLength>40_000_000)throw Error('unexpected size');
  const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
  const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const webp=bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP';
  if(!jpg&&!png&&!webp)throw Error('invalid image');
  const ext=jpg?'jpg':png?'png':'webp';
  const filename=accessionNumber.replace(/[^\w.-]/g,'_')+'.'+ext;
  await fs.writeFile(path.join(output,filename),bytes);
  report.push({accessionNumber,status:'downloaded',filename,title:item.title,creationDate:item.creation_date,technique:item.technique,culture:item.culture,license:item.share_license_status,officialUrl:item.url||'https://www.clevelandart.org/art/'+accessionNumber,imageUrl,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),verifiedAt:new Date().toISOString()});
 }catch(error){report.push({accessionNumber,status:'skipped',reason:String(error.message||error)});}
 console.log(report.at(-1));
}
await fs.writeFile(path.join(root,'download_report.json'),JSON.stringify({report},null,2));
console.log('Inspect source photographs, choose actual distinct cloud crops, and record normalized x/y/width/height. No unreviewed imports.');
