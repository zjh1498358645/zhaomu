'use strict';
(()=>{
const KEY='our-days-reply-author-slot',TYPES=new Set(['image/jpeg','image/png','image/webp','image/gif']);
function selectedAuthor(){const v=localStorage.getItem(KEY);return v==='name1'||v==='name2'?v:'';}
function setSelectedAuthor(slot){if(slot!=='name1'&&slot!=='name2')throw Error('请选择有效身份');localStorage.setItem(KEY,slot);return slot;}
function validateFiles(files){const list=[...(files||[])];if(list.length>10)throw Error('每条回复最多选择 10 张图片');for(const f of list){if(!TYPES.has(f.type))throw Error('图片格式仅支持 JPG、PNG、WebP 或 GIF');if(!f.size)throw Error('不能上传空图片');if(f.size>20*1024*1024)throw Error('单张图片不能超过 20MB');}return list;}
function formatReplyTime(value){const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});}
function flattenForDisplay(items){const unique=new Map();for(const item of items||[])if(item?.id&&!unique.has(item.id))unique.set(item.id,item);const sorted=[...unique.values()].sort((a,b)=>(a.createdAt||0)-(b.createdAt||0)||String(a.id).localeCompare(String(b.id))),children=new Map();for(const item of sorted){const parent=unique.has(item.parentId)?item.parentId:'';if(!children.has(parent))children.set(parent,[]);children.get(parent).push(item);}const out=[],seen=new Set();function walk(parent,level){for(const item of children.get(parent)||[]){if(seen.has(item.id))continue;seen.add(item.id);out.push({...item,visualDepth:Math.min(level,2)});walk(item.id,level+1);}}walk('',0);for(const item of sorted)if(!seen.has(item.id))out.push({...item,visualDepth:Math.min(Number(item.depth)||0,2)});return out;}
async function filePayloads(files){validateFiles(files);return Promise.all([...files].map(file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({data:reader.result,name:file.name});reader.onerror=()=>reject(reader.error||Error('读取图片失败'));reader.readAsDataURL(file);})));}
window.Replies={selectedAuthor,setSelectedAuthor,validateFiles,formatReplyTime,flattenForDisplay,filePayloads};
})();
