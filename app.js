(function(){
  var burger=document.getElementById('burger'), menu=document.getElementById('menu');
  function zamknij(){menu.classList.remove('otw');burger.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  burger.addEventListener('click',function(){
    var o=menu.classList.toggle('otw');burger.setAttribute('aria-expanded',o?'true':'false');
    document.body.style.overflow=o?'hidden':'';
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij);});

  // aktywna pozycja menu
  var linki=[].slice.call(menu.querySelectorAll('a[href^="#"]:not(.menu-cta)'));
  var sekcje=linki.map(function(a){return document.querySelector(a.getAttribute('href'));});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){linki.forEach(function(a){a.classList.toggle('akt',a.getAttribute('href')==='#'+e.target.id);});}
    });},{rootMargin:'-45% 0px -50% 0px'});
    sekcje.forEach(function(s){s&&io.observe(s);});
    // dolny pasek na telefonie dopiero po minięciu przycisków w hero
    var mob=document.getElementById('mob'), cta=document.getElementById('heroCta');
    new IntersectionObserver(function(es){var e=es[0];
      mob.classList.toggle('widac',!e.isIntersecting && e.boundingClientRect.top<0);
    }).observe(cta);
  }

  // przeciąganie myszą
  function drag(el){
    var x0=0,s0=0,ciag=false,ruch=0;
    el.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;ciag=true;ruch=0;x0=e.clientX;s0=el.scrollLeft;el.classList.add('ciag');});
    window.addEventListener('pointermove',function(e){if(!ciag)return;ruch=Math.abs(e.clientX-x0);el.scrollLeft=s0-(e.clientX-x0);});
    window.addEventListener('pointerup',function(){if(!ciag)return;ciag=false;el.classList.remove('ciag');});
    el.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();}},true);
    el.addEventListener('dragstart',function(e){e.preventDefault();});
  }

  // karuzele w kartach
  document.querySelectorAll('[data-car]').forEach(function(car){
    var tor=car.querySelector('.car-tor'), n=tor.children.length; if(n<2)return;
    var kr=document.createElement('div');kr.className='car-kropki';
    for(var i=0;i<n;i++){kr.appendChild(document.createElement('i'));}
    car.appendChild(kr);
    ['l','r'].forEach(function(s){var b=document.createElement('button');b.className='car-btn '+s;b.type='button';
      b.setAttribute('aria-label',s==='l'?'Poprzednie zdjęcie':'Następne zdjęcie');b.innerHTML=s==='l'?'&#8592;':'&#8594;';
      b.addEventListener('click',function(){var w=tor.clientWidth,i=Math.round(tor.scrollLeft/w)+(s==='l'?-1:1);
        if(i<0)i=n-1;if(i>=n)i=0;tor.scrollTo({left:i*w,behavior:'smooth'});});
      car.appendChild(b);});
    function on(){var i=Math.round(tor.scrollLeft/tor.clientWidth);[].forEach.call(kr.children,function(k,j){k.classList.toggle('on',j===i);});}
    tor.addEventListener('scroll',function(){window.requestAnimationFrame(on);},{passive:true});on();
    drag(tor);
    tor.addEventListener('pointerup',function(){var w=tor.clientWidth;setTimeout(function(){tor.scrollTo({left:Math.round(tor.scrollLeft/w)*w,behavior:'smooth'});},0);});
  });

  // trasa po mieście
  var trasa=document.getElementById('trasaTor');
  if(trasa){drag(trasa);
    document.querySelectorAll('.strz').forEach(function(b){b.addEventListener('click',function(){
      trasa.scrollBy({left:(+b.dataset.kier)*Math.min(800,trasa.clientWidth*.8),behavior:'smooth'});});});
  }

  // wybór wycieczki w formularzu
  var sel=document.getElementById('f-wyc');
  document.querySelectorAll('[data-wycieczka]').forEach(function(a){a.addEventListener('click',function(){
    var v=a.dataset.wycieczka;[].forEach.call(sel.options,function(o){if(o.text===v)sel.value=o.value;});
  });});

  // formularz (podgląd)
  document.getElementById('formularz').addEventListener('submit',function(e){e.preventDefault();
    document.getElementById('formInfo').textContent='To podgląd strony - na docelowej stronie zamówienie trafi od razu na biuro@e-sandomierz.pl.';
  });
})();
