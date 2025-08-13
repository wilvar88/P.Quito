/* Render dinámico y modo coordenadas */
(function(){
  const container = document.getElementById('hotspots');
  const img = document.getElementById('base');
  const coordsBox = document.getElementById('coords');
  let coordMode = false;

  function render(){
    if(!window.HOTSPOTS){ console.error('No hay HOTSPOTS'); return; }
    container.innerHTML = '';
    for(const h of window.HOTSPOTS){
      const btn = document.createElement('button');
      btn.className = 'hotspot';
      btn.style.left = h.x + '%';
      btn.style.top = h.y + '%';
      if(h.align === 'left'){ btn.dataset.align = 'left'; }
      btn.setAttribute('aria-label', h.title || 'Detalle');
      btn.innerHTML = `
        <span class="num">${h.n ?? ''}</span>
        <span class="tip" role="tooltip">
          <h3>${h.title ?? 'Detalle'}</h3>
          <p>${h.text ?? ''}</p>
        </span>
      `;
      container.appendChild(btn);
    }
  }

  function toggleCoordMode(){
    coordMode = !coordMode;
    coordsBox.hidden = !coordMode;
    coordsBox.textContent = coordMode ? 'Modo coordenadas: clic en la imagen para copiar X%,Y%' : '';
  }

  function onMove(e){
    if(!coordMode) return;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    coordsBox.textContent = `x:${x.toFixed(2)}%  y:${y.toFixed(2)}%`;
  }

  function onClick(e){
    if(!coordMode) return;
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const snippet = `{ x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, n: 0, title: "Título", text: "Descripción" },`;
    navigator.clipboard.writeText(snippet).catch(()=>{});
    coordsBox.textContent = `Copiado: ${snippet}`;
  }

  document.addEventListener('keydown', (e)=>{
    if(e.key.toLowerCase() === 'e'){ toggleCoordMode(); }
  });

  img.addEventListener('mousemove', onMove);
  img.addEventListener('click', onClick);

  window.addEventListener('load', render);
  window.addEventListener('resize', ()=>coordMode && (coordsBox.textContent = ''));
})();