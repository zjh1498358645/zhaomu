'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MemoryMetadata=api;})(typeof window!=='undefined'?window:globalThis,function(){
  const clean=(v,max)=>String(v||'').trim().slice(0,max);
  function parseList(value){const list=[...new Set((Array.isArray(value)?value:String(value||'').split(/[,，]/)).map(v=>String(v).trim()).filter(Boolean))];if(list.length>10)throw Error('人物和标签最多各 10 项');if(list.some(v=>[...v].length>20))throw Error('人物和标签每项最多 20 字');return list;}
  function normalize(record={}){const date=clean(record.capturedAt||record.date,10);return {title:clean(record.title,100),capturedAt:date,date,place:clean(record.place,60),people:parseList(record.people||[]),tags:parseList(record.tags||[]),note:clean(record.note,500),authorSlot:record.authorSlot==='name1'||record.authorSlot==='name2'?record.authorSlot:''};}
  function validate(value,{today}={}){const result=normalize(value);if(!result.title)throw Error('请给这段回忆起个名字');if(!/^\d{4}-\d{2}-\d{2}$/.test(result.capturedAt))throw Error('请选择有效拍摄日期');if(today&&result.capturedAt>today)throw Error('拍摄日期不能在未来');if(value.authorSlot&&result.authorSlot!==value.authorSlot)throw Error('请选择有效身份');return result;}
  return {normalize,parseList,validate};
});
