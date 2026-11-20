/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/contact.js - CONTACT page only (pages/contact.html)
   WHAT IT DOES:
     Validates #contactForm (name, email, topic, message >= 20 characters, consent), shows errors under each field (.field.bad),
     then replaces the form with the success panel #formOk (reference number #okRef, "Email it instead" link #mailBtn).
     The message is kept in localStorage "aa_messages" (there is no server). CSS: §23.
   HTML IT USES: #contactForm .field .field__err #formOk #okName #okRef #mailBtn #again
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Contact form: validation, saved message, mailto fallback. Styles: css/style.css §23 */
(function(){
  'use strict';
  const form=document.getElementById('contactForm'), ok=document.getElementById('formOk'), msg=form.message, count=document.getElementById('msgCount');
  const rules={
    name:v=>v.trim().length>=2||'Please enter your name (at least 2 characters).',
    email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||'Please enter a valid email address.',
    topic:v=>!!v||'Please choose a topic.',
    message:v=>v.trim().length>=20||'Please write at least 20 characters so we can help properly.',
    consent:(v,el)=>el.checked||'Please tick the box so we may reply to you.'
  };
  function check(el){
    const r=rules[el.name](el.value,el), wrap=el.closest('.field'), err=wrap.querySelector('.field__err');
    const bad=r!==true;wrap.classList.toggle('bad',bad);el.setAttribute('aria-invalid',bad);err.textContent=bad?r:'';return !bad;
  }
  Object.keys(rules).forEach(n=>{const el=form[n];el.addEventListener('blur',()=>check(el));el.addEventListener('input',()=>{if(el.closest('.field').classList.contains('bad'))check(el)})});
  msg.addEventListener('input',()=>{count.textContent=msg.value.length+' / 600'});
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const bad=Object.keys(rules).map(n=>form[n]).filter(el=>!check(el));
    if(bad.length){bad[0].focus();return}
    const ref='AA-'+Date.now().toString(36).toUpperCase().slice(-6);
    const data={ref,name:form.name.value.trim(),email:form.email.value.trim(),topic:form.topic.value,level:form.level.value,message:msg.value.trim(),sent:new Date().toISOString()};
    try{const all=JSON.parse(localStorage.getItem('aa_messages')||'[]');all.push(data);localStorage.setItem('aa_messages',JSON.stringify(all))}catch(x){}
    document.getElementById('okName').textContent=data.name.split(' ')[0];
    document.getElementById('okRef').textContent=ref;
    const body='Reference: '+ref+'\nName: '+data.name+'\nExperience: '+data.level+'\n\n'+data.message;
    document.getElementById('mailBtn').href='mailto:hello@alpineascents.example?subject='+encodeURIComponent('['+data.topic+'] '+ref)+'&body='+encodeURIComponent(body);
    form.style.display='none';ok.classList.add('show');ok.setAttribute('tabindex','-1');ok.focus();
  });
  document.getElementById('again').addEventListener('click',()=>{form.reset();count.textContent='0 / 600';form.style.display='';ok.classList.remove('show');form.name.focus()});
})();
