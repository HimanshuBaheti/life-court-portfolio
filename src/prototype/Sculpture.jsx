import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Bespoke geometric letterforms, extruded as real meshes rather than a text image.
const outlines = {
  H: [[0,0],[.25,0],[.25,.61],[.75,.61],[.75,0],[1,0],[1,1.5],[.75,1.5],[.75,.89],[.25,.89],[.25,1.5],[0,1.5]],
  I: [[.24,0],[.76,0],[.76,.2],[.63,.2],[.63,1.3],[.76,1.3],[.76,1.5],[.24,1.5],[.24,1.3],[.37,1.3],[.37,.2],[.24,.2]],
  M: [[0,0],[.24,0],[.24,1.02],[.5,.63],[.76,1.02],[.76,0],[1,0],[1,1.5],[.75,1.5],[.5,1.08],[.25,1.5],[0,1.5]],
  A: [[0,0],[.27,0],[.36,.34],[.66,.34],[.75,0],[1.02,0],[.63,1.5],[.39,1.5]],
  N: [[0,0],[.24,0],[.24,1.03],[.76,0],[1,0],[1,1.5],[.76,1.5],[.76,.48],[.24,1.5],[0,1.5]],
  S: [[0,0],[1,0],[1,.87],[.26,.87],[.26,1.24],[1,1.24],[1,1.5],[0,1.5],[0,.62],[.74,.62],[.74,.26],[0,.26]],
  U: [[0,1.5],[.26,1.5],[.26,.29],[.74,.29],[.74,1.5],[1,1.5],[1,.17],[.83,0],[.17,0],[0,.17]],
};
function letterGeometry(letter) {
  const shape = new THREE.Shape(outlines[letter].map(([x,y]) => new THREE.Vector2(x - .5, y - .75)));
  if (letter === 'A') shape.holes.push(new THREE.Path([[.43,.61],[.51,1.01],[.59,.61]].map(([x,y]) => new THREE.Vector2(x-.5,y-.75))));
  return new THREE.ExtrudeGeometry(shape, { depth: .3, bevelEnabled: true, bevelThickness: .014, bevelSize: .014, bevelSegments: 2, steps: 1 });
}

function reverseTexture(index) {
  const canvas = document.createElement('canvas'); canvas.width=256; canvas.height=384;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=['#004fff','#ff5e00','#1a1a1a'][index%3];ctx.fillRect(0,0,256,384);
  ctx.strokeStyle='#f4f4f0';ctx.lineWidth=2;
  if(index%3===0){
    ctx.strokeRect(32,40,192,300);ctx.strokeRect(65,40,126,300);ctx.beginPath();ctx.moveTo(32,190);ctx.lineTo(224,190);ctx.moveTo(65,110);ctx.lineTo(191,110);ctx.moveTo(65,270);ctx.lineTo(191,270);ctx.moveTo(128,110);ctx.lineTo(128,270);ctx.stroke();
  }else if(index%3===1){
    for(let y=60;y<330;y+=45)for(let x=35;x<230;x+=45){ctx.strokeRect(x,y,27,27);}
  }else{
    for(let j=0;j<9;j++){ctx.beginPath();for(let x=0;x<=256;x++){const y=180+Math.sin(x/60+j*.4)*60+j*12; x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
  }
  ctx.fillStyle='#f4f4f0';ctx.font='12px monospace';ctx.fillText(['ON COURT','IN THE ROOM','NEW COORDINATES'][index%3],22,365);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

export default function Sculpture({ progress, reduced, selected, onReady }) {
  const hostRef=useRef(null);
  const controls=useRef({ progress:0, reduced, selected });
  const [failed,setFailed]=useState(false);
  useEffect(()=>{ controls.current.reduced=reduced;controls.current.selected=selected; },[reduced,selected]);
  useEffect(()=>{ controls.current.progress=progress.get();return progress.on('change',value=>{controls.current.progress=value;}); },[progress]);

  useEffect(()=>{
    const host=hostRef.current;
    let renderer;
    try { renderer=new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' }); }
    catch { setFailed(true); onReady();return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
    host.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(32,1,.1,100);
    camera.position.set(0,1.6,15);camera.lookAt(0,0,0);
    scene.add(new THREE.HemisphereLight(0xffffff,0xa6a29a,3));
    const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(-3,7,5);key.castShadow=true;
    key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-9,right:9,top:7,bottom:-7});key.shadow.bias=-.001;key.shadow.normalBias=.025;scene.add(key);
    const rim=new THREE.DirectionalLight(0xcad4ff,2);rim.position.set(5,2,-3);scene.add(rim);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.16}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.35;ground.receiveShadow=true;scene.add(ground);
    const assembly=new THREE.Group();scene.add(assembly);
    const letters=[];const palette=[0xe6e4df,0x004fff,0xe6e4df,0xe6e4df,0xff5e00,0xe6e4df,0xe6e4df,0x004fff];
    'HIMANSHU'.split('').forEach((character,index)=>{
      const group=new THREE.Group();group.position.x=(index-3.5)*1.15;assembly.add(group);
      const geometry=letterGeometry(character);
      const face=new THREE.MeshStandardMaterial({color:palette[index],roughness:.34,metalness:.12});
      const edge=new THREE.MeshStandardMaterial({color:index===4?0xb83900:index===1||index===7?0x0029a8:0xaaa89f,roughness:.45,metalness:.2});
      const mesh=new THREE.Mesh(geometry,[face,edge]);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
      const outline=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,25),new THREE.LineBasicMaterial({color:0x004fff,transparent:true,opacity:0}));group.add(outline);
      const backing=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0x004fff,transparent:true,opacity:0,roughness:.4,metalness:.15}));group.add(backing);
      const reverse=new THREE.Mesh(new THREE.PlaneGeometry(.96,1.5),new THREE.MeshStandardMaterial({map:reverseTexture(index),roughness:.65}));reverse.rotation.y=Math.PI;reverse.position.z=-.09;group.add(reverse);
      letters.push({group,mesh,outline,backing,reverse,base:group.position.x,index});
    });
    const connections=new THREE.Group();assembly.add(connections);
    for(let i=0;i<7;i++){
      const start=new THREE.Vector3((i-3.5)*1.15,-.3,-1.1),end=new THREE.Vector3((i-2.5)*1.15,.3,-1.1);
      const path=new THREE.CatmullRomCurve3([start,new THREE.Vector3(start.x+.45,-.3,-1.1),new THREE.Vector3(end.x-.45,.3,-1.1),end]);
      connections.add(new THREE.Mesh(new THREE.TubeGeometry(path,20,.013,6,false),new THREE.MeshBasicMaterial({color:0xff5e00})));
      const dot=new THREE.Mesh(new THREE.SphereGeometry(.06,12,12),new THREE.MeshBasicMaterial({color:0xff5e00}));dot.position.copy(start);connections.add(dot);
    }
    const pointer={x:0,y:0};
    const move=e=>{const rect=host.getBoundingClientRect();pointer.x=(e.clientX-rect.left)/rect.width-.5;pointer.y=(e.clientY-rect.top)/rect.height-.5;};
    const leave=()=>{pointer.x=0;pointer.y=0;};host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);
    const resize=()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.position.z=Math.max(7.8,5.4/(Math.tan(THREE.MathUtils.degToRad(16))*camera.aspect));camera.updateProjectionMatrix();};
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    let frame;let current=controls.current.progress;let last=performance.now();let disposed=false;
    const interpolate=(values,p)=>{const n=Math.min(2,Math.floor(p*3));return THREE.MathUtils.lerp(values[n],values[n+1],Math.min(1,p*3-n));};
    const draw=now=>{
      if(disposed)return;
      const delta=Math.min((now-last)/1000,.05);last=now;
      const state=controls.current;current=state.reduced?state.progress:THREE.MathUtils.damp(current,state.progress,8,delta);
      const explode=Math.max(0,1-Math.abs(current*3-2));
      assembly.rotation.y=interpolate([-.07,-.82,-.42,-Math.PI],current)+(state.reduced?0:pointer.x*.055);
      assembly.rotation.x=interpolate([.02,.15,-.10,0],current)+(state.reduced?0:pointer.y*.035);
      assembly.rotation.z=interpolate([-.025,.07,-.035,0],current);
      assembly.scale.setScalar(interpolate([1,1,.86,.96],current));
      assembly.position.y=state.reduced?0:Math.sin(now*.0005)*.045;
      letters.forEach(({group,mesh,outline,backing,reverse,base,index})=>{
        group.position.x=base*(1+explode*.045);
        group.position.z=Math.sin(index*1.6)*explode*.42;
        mesh.position.z=explode*.85;
        outline.position.z=-explode*.35;outline.material.opacity=explode*.7;
        backing.position.z=-explode*1.25;backing.material.opacity=explode*.23;
        reverse.material.transparent=true;reverse.material.opacity=THREE.MathUtils.smoothstep(current,.72,.93);
        mesh.material[0].emissive.setHex(state.selected===index%3?0x111111:0x000000);
      });
      connections.visible=explode>.05;connections.scale.z=1+explode*.2;
      renderer.render(scene,camera);
      frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);onReady();
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);scene.traverse(object=>{object.geometry?.dispose();if(object.material){for(const material of Array.isArray(object.material)?object.material:[object.material]){material.map?.dispose();material.dispose();}}});renderer.dispose();renderer.domElement.remove();};
  },[onReady]);
  return <div className="sculpture-canvas" ref={hostRef} role="img" aria-label="Interactive extruded HIMANSHU sculpture; use the viewpoint controls to rotate and separate its layers.">{failed&&<div className="sculpture-fallback"><strong>HIMANSHU</strong><span>Explore the perspectives below. 3D rendering is unavailable in this browser.</span></div>}</div>;
}
