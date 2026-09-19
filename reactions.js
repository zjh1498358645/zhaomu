'use strict';
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Reactions=api;})(typeof window!=='undefined'?window:globalThis,function(){
  const valid=slot=>slot==='name1'||slot==='name2';
  function validateSlot(slot){if(!valid(slot))throw Error('请先选择你的身份');return slot;}
  function normalize(memory){const slots=[...new Set((Array.isArray(memory?.reactionSlots)?memory.reactionSlots:[]).filter(valid))].sort();return {...memory,reactionSlots:slots,reactionCount:slots.length};}
  function toggleLocal(memory,slot){validateSlot(slot);const next=normalize(memory),set=new Set(next.reactionSlots);set.has(slot)?set.delete(slot):set.add(slot);next.reactionSlots=[...set].sort();next.reactionCount=next.reactionSlots.length;return next;}
  return {normalize,toggleLocal,validateSlot};
});
