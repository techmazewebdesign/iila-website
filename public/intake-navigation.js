
(function(){
 const sensitive=p=>/^\/(?:fa\/)?(?:human-rights-complaint|intake-admin|intake-privacy)(?:\/|$)/.test(p);
 document.addEventListener('click',function(e){
  const a=e.target.closest&&e.target.closest('a[href]');
  if(!a||a.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
  const to=new URL(a.href,location.href);
  if(to.origin===location.origin && sensitive(to.pathname)!==sensitive(location.pathname)){
   e.preventDefault();e.stopImmediatePropagation();location.assign(to.href);
  }
 },true);
})();
