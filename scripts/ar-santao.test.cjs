const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
test('AR and Lab share one visual, one timeline and one 56-stitch asset; seven AR cards match their target data',()=>{
 for(const file of ['assets/stitch/SantaoExperience.js','assets/ar/SantaoARAdapter.js']){const s=read(file);assert(s.includes("SantaoVisual.js"));assert(s.includes('SantaoTimeline.js'));assert(!s.includes('new THREE.WebGLRenderer'));assert(!s.includes('new THREE.Scene'));assert(!s.includes('requestAnimationFrame'));}
 assert.equal((read('assets/ar-experience.js').match(/new THREE.WebGLRenderer/g)||[]).length,1);assert.equal((read('assets/ar-experience.js').match(/setAnimationLoop\(animate\)/g)||[]).length,1);
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/ar-assets/targets.mind'))).digest('hex'),'2175ef5b25128e8afe1577c49073ed8c4735b71c1db56453003e5e96a2385e1b');
 const data=JSON.parse(read('content/stitch-demos/demo-santao-pear-petal.json'));assert.deepEqual(data.batches.map(b=>b.count),[28,14,14]);assert.equal(data.knowledgeId,'stitch-santao');
 const targets=JSON.parse(read('assets/ar-assets/targets.json'));assert.deepEqual(targets.map(t=>t.id),['caisson-sui','tuanshan-window-qing','haitang-window-ming','pipa-ornament-tang','embroidered-eye-mask','lotus','pear-blossom']);
 const referenceHashes=['fda5166fb7087a2faa09acdc963b43a72f13ce0bc03528f623341fda660092b8','d68cbb3de87c57ce3abc3d74a412cf0a3b7d7bf0663f60e4e02034d8b9348ddc','5661e4ec678031c9ec7c8be61c1cb3100273c0c45ff061adbcfeb468c5804120','131d2c1c11e636217f1307e94f17845652bd2d2bf261ba13a8c63fcdb85b399a'];
 const markerHashes=['cd7809e6af14d593224e695d68dd2454a57a4dc990486dbe4f82acfbb03600d7','6596bd30b34ac098da81d54c9d19bfb4d50ce9c1cb73f70829ca78ac9fb3ae1c','0e61aade8b1b8d9f49507ab18e3ef683c7e4a88bf11ccb7a95736f6ac8312797','ee3673f7dd918f614ce137796d99b21c61efd44448322d31b8f23e65013e53dd'];
 for(const [i,t] of targets.slice(0,4).entries()){
  assert(t.presentation.ornament);assert.equal(t.presentation.reliefDepth,0);assert.equal(t.layers.length,6);assert.equal(new Set(t.layers.map(layer=>layer.src)).size,6);
  assert(t.layers[0].depth===0&&t.layers.slice(1).every((layer,j)=>layer.depth-t.layers[j].depth>=.1));assert(t.layers.every(layer=>!layer.explodeOffset||Math.hypot(layer.explodeOffset.x,layer.explodeOffset.y)<1e-6));
  const hashes=t.layers.map(layer=>{const file=path.join(root,'assets',layer.src);assert(fs.existsSync(file),layer.src);const bytes=fs.readFileSync(file);assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');return crypto.createHash('sha256').update(bytes).digest('hex');});assert.equal(new Set(hashes).size,6);
  assert(fs.existsSync(path.join(root,'assets',t.image)));assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets',t.image))).digest('hex'),markerHashes[i]);
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets',`ar-assets/examples/${t.id}.png`))).digest('hex'),referenceHashes[i]);assert(t.assetProcessing.layeringStatus.includes('six independently textured'));assert(t.credit.includes('六层重绘'));
 }
 const pear=targets.find(t=>t.id==='pear-blossom');assert.equal(pear.craftExperiences[0].layerIndex,4);const entry=pear.craftExperiences[0];assert(entry.hotspot.u>0&&entry.hotspot.u<1&&entry.hotspot.v>0&&entry.hotspot.v<1);assert(entry.transform.z<.01);
});
test('internal and manual clocks produce identical states for all 11 seconds, with no manual RAF',async()=>{
 const {SantaoTimeline}=await import('../assets/stitch/SantaoTimeline.js');let now=0,callback;
 const internal=new SantaoTimeline({now:()=>now,requestFrame:cb=>{callback=cb;return 1;},cancelFrame:()=>{callback=null;}});
 const manual=new SantaoTimeline({clockMode:'manual',now:()=>now,requestFrame:()=>assert.fail('manual RAF')});internal.start();manual.start();
 for(now=100;now<=11000;now+=100){callback?.(now);manual.tick(now);const {pendingFrame:a,...one}=internal.state,{pendingFrame:b,...two}=manual.state;assert.deepEqual(one,two);assert.equal(b,false);}
 manual.seek(5);assert.equal(manual.time,5);manual.resume();now+=500;manual.tick(now);assert.equal(manual.time,5.5);manual.dispose();manual.tick(now+500);assert.equal(manual.time,5.5);
});
test('tracking pauses retain time, only automatic pauses resume; manual intent wins',async()=>{
 const {SantaoARAdapter}=await import('../assets/ar/SantaoARAdapter.js'),{SantaoTimeline}=await import('../assets/stitch/SantaoTimeline.js');let now=0;
 const adapter=Object.create(SantaoARAdapter.prototype);Object.assign(adapter,{disposed:false,trackingAvailable:true,pausedByTracking:false,timeline:new SantaoTimeline({clockMode:'manual',now:()=>now})});
 adapter.start();now=5000;adapter.timeline.tick(now);adapter.trackingLost();assert.equal(adapter.timeline.time,5);assert(adapter.pausedByTracking);now=9000;adapter.timeline.tick(now);assert.equal(adapter.timeline.time,5);adapter.trackingFound();assert(adapter.timeline.playing);now+=100;adapter.timeline.tick(now);assert.equal(adapter.timeline.time,5.1);
 adapter.pause();adapter.trackingLost();adapter.trackingFound();assert(!adapter.timeline.playing);assert(!adapter.pausedByTracking);
 adapter.resume();adapter.trackingLost();adapter.pause();adapter.trackingFound();assert(!adapter.timeline.playing);
});
test('capture/restore preserves every layer property without loading textures again',async()=>{
 const THREE=await import('../assets/vendor/three/build/three.module.js'),{captureARVisualState,restoreARVisualState}=await import('../assets/ar/SantaoARAdapter.js');
 const layered={selected:4,expanded:true,amount:1.7,state:'active',stopTweens(){},entries:Array.from({length:6},(_,i)=>{const mesh=new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.MeshBasicMaterial());mesh.visible=i!==1;mesh.position.set(.01*i,.02*i,.03*i);mesh.rotation.set(.01,.02,.03);mesh.scale.set(1.1,.9,1);mesh.material.opacity=.2+i*.1;return {mesh};})};
 const saved=captureARVisualState(layered);layered.entries.forEach(({mesh})=>{mesh.position.set(0,0,9);mesh.visible=true;mesh.material.opacity=0;mesh.scale.setScalar(3);mesh.rotation.set(1,1,1);});layered.selected=-1;restoreARVisualState(layered,saved);assert.deepEqual(captureARVisualState(layered),saved);layered.entries.forEach(({mesh})=>{mesh.geometry.dispose();mesh.material.dispose();});
});
