/********** Datos de ejemplo (avisos ficticios) **********/
const sampleNotices = [
  {id:1,pub:'2025-08-18 12:00',ent:'2025-08-20T15:00',region:'Metropolitana',comuna:'Santiago',sector:'Beauchef 850, terraza',tipo:'gato',cantidad:1,edad:'2 meses',contact:'María',photos:["img/gato1a.jpg", "img/gato1b.jpg"],desc:'Cachorro muy cariñoso'},
  {id:2,pub:'2025-08-17 19:00',ent:'2025-08-21T10:00',region:'Metropolitana',comuna:'Ñuñoa',sector:'Plaza',tipo:'perro',cantidad:3,edad:'2 meses',contact:'Carlos',photos:["img/perros1.jpg"],desc:'Tres hermanitos, juguetones'},
  {id:3,pub:'2022-08-17 18:00',ent:'2022-08-20T09:00',region:'Metropolitana',comuna:'Santiago',sector:'Parque O\'higgins',tipo:'gato',cantidad:2,edad:'1 mes',contact:'Ana',photos:["img/gato2.jpg", "img/gato2a.jpg"],desc:'Rescatados del parque'},
  {id:4,pub:'2025-08-15 09:30',ent:'2025-08-26T11:00',region:'Biobío',comuna:'Concepción',sector:'Barrio Universitario',tipo:'perro',cantidad:1,edad:'1 año',contact:'Pedro',photos:["img/perro5.jpg"],desc:'Adulto, castrado'},
  {id:5,pub:'2025-08-10 08:10',ent:'2025-08-14T13:00',region:'Valparaíso',comuna:'Viña del Mar',sector:'Avenida',tipo:'gato',cantidad:1,edad:'6 meses',contact:'Luisa',photos:["img/gato3.jpg"],desc:'Busca hogar tranquilo'}
];

/********** Utilidad: placeholders de imágenes **********/
function placeholderDataURL(w,h,text){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><rect width='100%' height='100%' fill='%23ddd'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23666'>${text}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}


/********************************************************
 *  INICIO (inicio.html)
 ********************************************************/
function renderHomeLatest(){
  const wrap=document.getElementById("homeLatest");
  if (!wrap) return;
  wrap.innerHTML="";
  sampleNotices.slice(0,5).forEach(n=>{
    const div=document.createElement("div");
    div.className="notice";

    // Usa la primera imagen, o un placeholder si no hay
    const imgSrc = n.photos && n.photos.length > 0 
      ? n.photos[0] 
      : placeholderDataURL(400,240, n.tipo);

    div.innerHTML = `
      <div class='meta'><strong>${n.pub}</strong> • ${n.region} • ${n.comuna}</div>
      <div style='margin-top:6px;'>${n.sector}</div>
      <div class='muted' style='margin-top:6px;'>${n.cantidad} ${n.tipo} • ${n.edad}</div>
      <img src='${imgSrc}' alt='foto principal' style='max-width:100%; margin-top:8px;'>
    `;
    wrap.appendChild(div);
  });
}

/********************************************************
 *  AGREGAR AVISO (agregar-aviso.html)
 ********************************************************/
// Poblar selects Región/Comuna desde region_comuna.js
function populateRegions() {
  const regionSelect=document.getElementById("region");
  const comunaSelect=document.getElementById("comuna");
  if (!regionSelect || !comunaSelect) return;

  regionSelect.innerHTML="<option value=''>--Seleccione--</option>";
  comunaSelect.innerHTML="<option value=''>--Seleccione--</option>";

  region_comuna.regiones.forEach(r=>{
    const opt=document.createElement("option");
    opt.value=r.nombre;
    opt.textContent=r.nombre;
    regionSelect.appendChild(opt);
  });

  regionSelect.addEventListener("change",()=>{
    comunaSelect.innerHTML="<option value=''>--Seleccione--</option>";
    const region=region_comuna.regiones.find(r=>r.nombre===regionSelect.value);
    if (region){
      region.comunas.forEach(c=>{
        const opt=document.createElement("option");
        opt.value=c.nombre;
        opt.textContent=c.nombre;
        comunaSelect.appendChild(opt);
      });
    }
  });
}

// Prellenar fecha mínima (+3 horas)
function prefillDate(){
  const inp=document.getElementById("availableDate");
  if (!inp) return;
  const now=new Date(); now.setHours(now.getHours()+3);
  const pad=n=> n.toString().padStart(2,'0');
  const yyyy=now.getFullYear(), mm=pad(now.getMonth()+1), dd=pad(now.getDate());
  const hh=pad(now.getHours()), min=pad(now.getMinutes());
  const val=`${yyyy}-${mm}-${dd}T${hh}:${min}`;
  inp.value=val;
  inp.setAttribute("data-prefill", val);
}

// Manejo de input adicional según canal de contacto
function setupContactChannel(){
  const sel=document.getElementById("contactChannel");
  const wrap=document.getElementById("channelInfoWrap");
  if (!sel || !wrap) return;
  sel.addEventListener("change",()=>{
    wrap.style.display = sel.value ? "block" : "none";
  });
}

// Manejo de fotos (máx 5)
function setupPhotoInputs(){
  const btn=document.getElementById("addPhotoBtn");
  if (!btn) return;
  btn.addEventListener("click",()=>{
    const container=document.getElementById("photoInputs");
    const count=container.querySelectorAll(".photoInput").length;
    if(count>=5){ alert("No puede agregar más de 5 fotos"); return; }
    const inp=document.createElement("input");
    inp.type="file"; inp.accept="image/*"; inp.className="photoInput";
    container.appendChild(inp);
  });
}

/********** Validaciones **********/
function clearErrors(){
  document.querySelectorAll(".error").forEach(e=>e.textContent="");
}
function setError(id,msg){
  const el=document.getElementById("error-"+id);
  if(el) el.textContent=msg;
}
function validateEmail(email){
  return /^\S+@\S+\.\S+$/.test(email);
}

function validateForm(){
  clearErrors(); let ok=true;
  const region=document.getElementById("region").value.trim();
  const comuna=document.getElementById("comuna").value.trim();
  const sector=document.getElementById("sector").value.trim();
  const name=document.getElementById("contactName").value.trim();
  const email=document.getElementById("contactEmail").value.trim();
  const phone=document.getElementById("contactPhone").value.trim();
  const contactChannel=document.getElementById("contactChannel").value.trim();
  const channelInfo=document.getElementById("channelInfo").value.trim();
  const petType=document.getElementById("petType").value.trim();
  const petCount=document.getElementById("petCount").value.trim();
  const petAge=document.getElementById("petAge").value.trim();
  const petAgeUnit=document.getElementById("petAgeUnit").value.trim();
  const availableDate=document.getElementById("availableDate").value;

  if(!region){ setError("region","La región es obligatoria"); ok=false; }
  if(!comuna){ setError("comuna","La comuna es obligatoria"); ok=false; }
  if(sector.length>100){ setError("sector","Máximo 100 caracteres"); ok=false; }

  if(name.length<3 || name.length>200){ setError("contactName","Nombre obligatorio (3-200 caracteres)"); ok=false; }
  if(!validateEmail(email)){ setError("contactEmail","Email inválido"); ok=false; }
  if(phone && !/^[+]\d{11,15}$/.test(phone)){ setError("contactPhone","Formato inválido. Ej: +56912345678"); ok=false; }
  if(contactChannel && (channelInfo.length<4 || channelInfo.length>50)){ setError("channelInfo","ID/URL debe tener entre 4 y 50 caracteres"); ok=false; }

  if(!petType){ setError("petType","Debe seleccionar tipo de mascota"); ok=false; }
  if(!petCount || !Number.isInteger(Number(petCount)) || Number(petCount)<1){ setError("petCount","Cantidad debe ser entero ≥ 1"); ok=false; }
  if(!petAge || !Number.isInteger(Number(petAge)) || Number(petAge)<1){ setError("petAge","Edad debe ser entero ≥ 1"); ok=false; }
  if(!petAgeUnit){ setError("petAgeUnit","Seleccione la unidad de edad"); ok=false; }

  const prefilled=document.getElementById("availableDate").getAttribute("data-prefill");
  if(!availableDate){ setError("availableDate","Fecha disponible es obligatoria"); ok=false; }
  else if(prefilled && availableDate < prefilled){ setError("availableDate","La fecha y hora no pueden ser previas a las sugeridas"); ok=false; }

  const photoInputs=Array.from(document.querySelectorAll(".photoInput"));
  const totalFiles=photoInputs.reduce((acc,i)=> acc + (i.files?.length||0), 0);
  if(totalFiles<1){ setError("photos","Debe subir al menos 1 foto"); ok=false; }
  if(totalFiles>5){ setError("photos","Máximo 5 fotos"); ok=false; }

  return ok;
}

/********************************************************
 *  LISTADO (listado.html)
 ********************************************************/
function renderList(){
  const tbody=document.getElementById("listBody");
  if (!tbody) return;
  tbody.innerHTML="";
  sampleNotices.forEach(n=>{
    const tr=document.createElement("tr");
    tr.innerHTML = `
      <td>${n.pub}</td>
      <td>${n.ent.replace("T"," ")}</td>
      <td>${n.comuna}</td>
      <td>${n.sector}</td>
      <td>${n.cantidad} ${n.tipo} • ${n.edad}</td>
      <td>${n.contact}</td>
      <td>${n.photos ? n.photos.length : 0}</td>
    `;
    tr.style.cursor="pointer";
    tr.addEventListener("click",()=>{
      location.href="detalle.html?id="+n.id;
    });
    tbody.appendChild(tr);
  });
}

/********************************************************
 *  DETALLE (detalle.html)
 ********************************************************/
function showDetail(id){
  const n=sampleNotices.find(x=>x.id===id);
  const cont=document.getElementById("detailContent");
  if (!cont || !n) return;

  let photosHtml='<div class="photo-grid">';
  if(n.photos && n.photos.length>0){
    n.photos.forEach((src,i)=>{
      const large = src; // aquí podrías tener versiones grandes si quieres
      photosHtml += `<img src='${src}' data-large='${large}' alt='foto ${i+1}'/>`;
    });
  } else {
    photosHtml += `<img src='${placeholderDataURL(320,240,"sin foto")}' alt='sin foto'/>`;
  }
  photosHtml+='</div>';

  cont.innerHTML=`
    <h3>${n.cantidad} ${n.tipo}(s) — ${n.edad}</h3>
    <p><strong>Publicado:</strong> ${n.pub}</p>
    <p><strong>Fecha entrega:</strong> ${n.ent.replace("T"," ")}</p>
    <p><strong>Comuna / Sector:</strong> ${n.comuna} — ${n.sector}</p>
    <p><strong>Contacto:</strong> ${n.contact}</p>
    <p><strong>Descripción:</strong> ${n.desc}</p>
    <h4>Fotos</h4>
    ${photosHtml}
  `;

  // Click para ampliar fotos
  cont.querySelectorAll(".photo-grid img").forEach(img=>{
    img.style.cursor="pointer";
    img.addEventListener("click",()=>{
      const large=img.getAttribute("data-large");
      showOverlay(`
        <div class="modal" style="padding:0">
          <div style="position:relative">
            <img src="${large}" style="display:block;max-width:100%;height:auto"/>
            <div style="position:absolute;top:8px;right:8px">
              <button id="closeLarge" class="btn btn-ghost">Cerrar</button>
            </div>
          </div>
        </div>
      `, true);
      document.getElementById("closeLarge").addEventListener("click", hideOverlay);
    });
  });
}
/********************************************************
 *  ESTADÍSTICAS (estadisticas.html)
 ********************************************************/
function drawLine(canvas, labels, values){
  const ctx=canvas.getContext("2d"); ctx.clearRect(0,0,canvas.width,canvas.height);
  const W=canvas.width, H=canvas.height, pad=40;
  ctx.strokeStyle="#ccc"; ctx.beginPath(); ctx.moveTo(pad,pad); ctx.lineTo(pad,H-pad); ctx.lineTo(W-pad,H-pad); ctx.stroke();
  const max=Math.max(...values,1);
  const stepX=(W-2*pad)/Math.max(1,labels.length-1);
  ctx.strokeStyle="#2b7a78"; ctx.lineWidth=2; ctx.beginPath();
  values.forEach((v,i)=>{
    const x=pad+i*stepX; const y=H-pad - ((H-2*pad)*(v/max));
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    ctx.fillStyle="#2b7a78"; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#333"; ctx.font="12px sans-serif"; ctx.fillText(labels[i], x-10, H-8);
  });
  ctx.stroke();
}
function drawPie(canvas, data, labels){
  const ctx=canvas.getContext("2d"); ctx.clearRect(0,0,canvas.width,canvas.height);
  const cx=canvas.width/2, cy=canvas.height/2, r=Math.min(cx,cy)-20;
  const total=data.reduce((a,b)=>a+b,0); let start=-Math.PI/2;
  const colors=["#2b7a78","#f08a5d","#b0d6da","#c4c4c4"];
  data.forEach((v,i)=>{
    const angle=(v/total)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,start+angle); ctx.closePath();
    ctx.fillStyle=colors[i%colors.length]; ctx.fill();
    const mid=start+angle/2; const lx=cx+(r+20)*Math.cos(mid); const ly=cy+(r+20)*Math.sin(mid);
    ctx.fillStyle="#333"; ctx.font="12px sans-serif"; ctx.fillText(`${labels[i]} (${v})`, lx-20, ly);
    start+=angle;
  });
}
function drawBar(canvas, labels, seriesA, seriesB){
  const ctx=canvas.getContext("2d"); ctx.clearRect(0,0,canvas.width,canvas.height);
  const W=canvas.width, H=canvas.height, pad=40;
  const n=labels.length; const barW=(W-2*pad)/(n*2+(n-1)*0.3);
  const max=Math.max(...seriesA.concat(seriesB),1);
  labels.forEach((lab,i)=>{
    const x0=pad+i*(barW*2+barW*0.3);
    const hA=(H-2*pad)*(seriesA[i]/max), hB=(H-2*pad)*(seriesB[i]/max);
    ctx.fillStyle="#2b7a78"; ctx.fillRect(x0,H-pad-hA,barW,hA);
    ctx.fillStyle="#f08a5d"; ctx.fillRect(x0+barW,H-pad-hB,barW,hB);
    ctx.fillStyle="#333"; ctx.font="12px sans-serif"; ctx.fillText(lab,x0,H-8);
  });
}
function drawAllCharts(){
  drawLine(document.getElementById("lineChart"), ["01","02","03","04","05","06","07"], [1,3,2,4,5,2,3]);
  drawPie(document.getElementById("pieChart"), [12,8], ["Gatos","Perros"]);
  drawBar(document.getElementById("barChart"), ["Ene","Feb","Mar","Abr"], [5,3,6,2], [3,4,2,5]);
}

/********************************************************
 *  OVERLAY (para confirmaciones y fotos grandes)
 ********************************************************/
function showOverlay(html, modal=false){
  let ov = document.getElementById('overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'overlay';
    ov.style.position = 'fixed';
    ov.style.top = '0';
    ov.style.left = '0';
    ov.style.width = '100%';
    ov.style.height = '100%';
    ov.style.display = 'none';
    ov.style.justifyContent = 'center';
    ov.style.alignItems = 'center';
    ov.style.background = 'rgba(0,0,0,0.6)';
    document.body.appendChild(ov);
  }
  ov.innerHTML = html;
  ov.style.display = 'flex';
  if (!modal) ov.addEventListener('click', hideOverlay, {once:true});
}

function hideOverlay(){
  const ov = document.getElementById('overlay');
  if (ov) {
    ov.style.display = 'none';
    ov.innerHTML = '';
  }
}