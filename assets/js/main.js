/* JWA Locações — shared interactions. Demo only: no data leaves the browser. */
(function(){
"use strict";

/* Mobile nav */
var burger=document.querySelector('.burger'), nav=document.querySelector('nav.main');
if(burger&&nav){burger.addEventListener('click',function(){
  var open=nav.classList.toggle('open');
  burger.setAttribute('aria-expanded',open?'true':'false');
  burger.textContent=open?'✕':'☰';
});}

/* FAQ accordion */
document.querySelectorAll('.faq-item > button').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=btn.parentElement, was=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');i.querySelector('button').setAttribute('aria-expanded','false');});
    if(!was){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
  });
});

/* ---------- WhatsApp bot chat mock (hero, index.html) ---------- */
var chat=document.getElementById('chat');
if(chat){
  var state={tamanho:null,tipo:null,endereco:null,dias:null,data:null,nome:null};
  var step=0, busy=false;
  var inputRow=document.getElementById('chat-input-row');
  var input=document.getElementById('chat-text');
  var sendBtn=document.getElementById('chat-send');
  var restartBtn=document.getElementById('chat-restart');
  var now=function(){var d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};

  function scrollChat(){chat.scrollTop=chat.scrollHeight;}
  function addBubble(text,who){
    var b=document.createElement('div');
    b.className='bubble '+who;
    b.innerHTML='';
    b.appendChild(document.createTextNode(text));
    var t=document.createElement('span');t.className='time';t.textContent=now();
    b.appendChild(t);chat.appendChild(b);scrollChat();return b;
  }
  function typing(cb){
    var t=document.createElement('div');t.className='typing';
    t.innerHTML='<i></i><i></i><i></i>';
    chat.appendChild(t);scrollChat();
    setTimeout(function(){t.remove();cb();},750);
  }
  function botSay(text,next){
    typing(function(){addBubble(text,'bot');if(next)setTimeout(next,350);});
  }
  function showChips(options){
    var q=document.createElement('div');q.className='quick';
    options.forEach(function(o){
      var b=document.createElement('button');b.type='button';b.textContent=o.label;
      b.addEventListener('click',function(){q.remove();addBubble(o.label,'user');o.onPick();});
      q.appendChild(b);
    });
    chat.appendChild(q);scrollChat();
  }
  function showTextInput(placeholder,onValue){
    inputRow.style.display='flex';input.placeholder=placeholder;input.value='';input.focus();
    var done=false;
    var submit=function(){
      var v=input.value.trim();if(!v||done)return;done=true;
      inputRow.style.display='none';addBubble(v,'user');onValue(v);
    };
    sendBtn.onclick=submit;
    input.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();submit();}};
  }
  function showDateInput(onValue){
    var q=document.createElement('div');q.className='quick';
    var d=document.createElement('input');d.type='date';d.setAttribute('aria-label','Data de entrega');
    d.style.cssText='font-family:inherit;font-size:.9rem;padding:.5rem .7rem;border:1.5px solid #075E54;border-radius:8px';
    var b=document.createElement('button');b.type='button';b.textContent='Confirmar data';
    b.addEventListener('click',function(){
      if(!d.value){d.focus();return;}
      var parts=d.value.split('-');var fmt=parts[2]+'/'+parts[1]+'/'+parts[0];
      q.remove();addBubble(fmt,'user');onValue(fmt);
    });
    q.appendChild(d);q.appendChild(b);chat.appendChild(q);scrollChat();
  }

  function step1(){
    step=1;
    botSay('Olá! Sou o assistente da JWA Locações. Vamos pedir sua caçamba? Qual o tamanho?',function(){
      showChips([
        {label:'Pequena',onPick:function(){state.tamanho='Pequena';step2();}},
        {label:'Média',onPick:function(){state.tamanho='Média';step2();}},
        {label:'Grande',onPick:function(){state.tamanho='Grande';step2();}},
        {label:'Não sei o tamanho',onPick:function(){state.tamanho='Não sei o tamanho';step2();}}
      ]);
    });
  }
  function step2(){
    step=2;
    botSay('Ótimo! Agora me diga: o que vai descartar?',function(){
      showChips([
        {label:'Entulho de obra',onPick:function(){state.tipo='Entulho de obra';step3();}},
        {label:'Reforma',onPick:function(){state.tipo='Reforma';step3();}},
        {label:'Terra',onPick:function(){state.tipo='Terra';step3();}},
        {label:'Móveis velhos',onPick:function(){state.tipo='Móveis velhos';step3();}},
        {label:'Poda',onPick:function(){state.tipo='Poda';step3();}}
      ]);
    });
  }
  function step3(){
    step=3;
    botSay('Perfeito! Agora o endereço da entrega:',function(){
      showTextInput('Digite o bairro e a cidade',function(v){state.endereco=v;step4();});
    });
  }
  function step4(){
    step=4;
    botSay('Por quantos dias precisa da caçamba?',function(){
      showChips([
        {label:'3 dias',onPick:function(){state.dias='3 dias';step5();}},
        {label:'5 dias',onPick:function(){state.dias='5 dias';step5();}},
        {label:'7 dias',onPick:function(){state.dias='7 dias';step5();}},
        {label:'10 dias',onPick:function(){state.dias='10 dias';step5();}}
      ]);
    });
  }
  function step5(){
    step=5;
    botSay('Qual a data de entrega?',function(){
      showDateInput(function(v){state.data=v;step6();});
    });
  }
  function step6(){
    step=6;
    botSay('Qual seu nome?',function(){
      showTextInput('Digite seu nome',function(v){state.nome=v;step7();});
    });
  }
  function step7(){
    step=7;
    botSay('Aqui está o resumo do seu pedido:',function(){
      var s=document.createElement('div');s.className='summary';s.id='order-summary';
      s.innerHTML='<h4>Resumo do pedido</h4>'+
        '<dl>'+
        '<dt>Tamanho:</dt><dd data-f="tamanho"></dd>'+
        '<dt>Material:</dt><dd data-f="tipo"></dd>'+
        '<dt>Entrega:</dt><dd data-f="data"></dd>'+
        '<dt>Dias:</dt><dd data-f="dias"></dd>'+
        '<dt>Endereço:</dt><dd data-f="endereco"></dd>'+
        '<dt>Nome:</dt><dd data-f="nome"></dd>'+
        '</dl>'+
        '<p class="note">Demonstração — os valores finais são confirmados pela equipe JWA no WhatsApp.</p>';
      var btn=document.createElement('button');btn.type='button';btn.className='btn';btn.textContent='Enviar pedido';
      btn.addEventListener('click',function(){
        btn.disabled=true;btn.textContent='Pedido enviado — demonstração';
        var ok=document.createElement('p');ok.className='note';ok.style.marginTop='.5rem';
        ok.textContent='Demonstração: nenhum pedido real foi enviado. A equipe JWA confirma os valores e a entrega no WhatsApp.';
        s.appendChild(ok);scrollChat();
      });
      s.appendChild(btn);
      chat.appendChild(s);
      Object.keys(state).forEach(function(k){
        var el=s.querySelector('[data-f="'+k+'"]');if(el)el.textContent=state[k]||'—';
      });
      scrollChat();
    });
  }
  function resetChat(){
    chat.innerHTML='';inputRow.style.display='none';
    state={tamanho:null,tipo:null,endereco:null,dias:null,data:null,nome:null};step=0;
    step1();
  }
  if(restartBtn)restartBtn.addEventListener('click',resetChat);
  /* Start the conversation on load */
  step1();
  /* "Testar o bot agora" scrolls to the phone and restarts the flow */
  document.querySelectorAll('[data-restart-bot]').forEach(function(el){
    el.addEventListener('click',function(e){
      e.preventDefault();
      var phone=document.getElementById('bot-phone');
      if(phone)phone.scrollIntoView({behavior:'smooth',block:'center'});
      resetChat();
    });
  });
}

/* ---------- Orçamento page: live estimate panel ---------- */
var qform=document.getElementById('quote-form');
if(qform){
  var est={tamanho:'—',tipo:'—',bairro:'—',dias:'7 dias',data:'—'};
  var daysSlider=document.getElementById('q-dias');
  var daysVal=document.getElementById('q-dias-val');
  var upd=function(key,val){est[key]=val||'—';
    var el=document.querySelector('[data-est="'+key+'"]');if(el)el.textContent=est[key];
  };
  qform.querySelectorAll('[data-pick]').forEach(function(group){
    var key=group.getAttribute('data-pick');
    group.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click',function(){
        group.querySelectorAll('button').forEach(function(x){x.classList.remove('sel');x.setAttribute('aria-pressed','false');});
        b.classList.add('sel');b.setAttribute('aria-pressed','true');
        upd(key,b.getAttribute('data-value')||b.textContent.trim());
      });
    });
  });
  var bairro=document.getElementById('q-bairro');
  if(bairro)bairro.addEventListener('input',function(){upd('bairro',bairro.value.trim());});
  var dataEl=document.getElementById('q-data');
  if(dataEl)dataEl.addEventListener('change',function(){
    if(!dataEl.value){upd('data','—');return;}
    var p=dataEl.value.split('-');upd('data',p[2]+'/'+p[1]+'/'+p[0]);
  });
  if(daysSlider){
    var snap=function(){
      var vals=[3,5,7,10],v=parseInt(daysSlider.value,10),best=vals[0];
      vals.forEach(function(n){if(Math.abs(n-v)<Math.abs(best-v))best=n;});
      daysSlider.value=best;
      if(daysVal)daysVal.textContent=best+' dias';
      upd('dias',best+' dias');
    };
    daysSlider.addEventListener('input',snap);daysSlider.addEventListener('change',snap);snap();
  }
  qform.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=document.getElementById('quote-ok');if(ok)ok.style.display='block';
    if(ok)ok.scrollIntoView({behavior:'smooth',block:'center'});
  });
}

/* ---------- Contact form (demo only) ---------- */
var cform=document.getElementById('contact-form');
if(cform){
  cform.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=document.getElementById('contact-ok');if(ok)ok.style.display='block';
    cform.reset();
  });
}
})();
