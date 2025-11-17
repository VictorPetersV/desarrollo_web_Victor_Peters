document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.evaluate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const avisoId = Number(btn.getAttribute('data-id'));
      openEvaluationModal(avisoId);
    });
  });
});

function openEvaluationModal(avisoId) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div id="eval-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:18px;border-radius:8px;min-width:280px;">
        <h3>Evaluar aviso #${avisoId}</h3>
        <label>Selecciona una nota (1 a 7)</label>
        <select id="nota-select" style="width:100%;margin-top:8px;">
          ${Array.from({length:7}, (_,i)=>`<option value="${i+1}">${i+1}</option>`).join('')}
        </select>
        <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end;">
          <button id="cancel-eval" class="btn">Cancelar</button>
          <button id="submit-eval" class="btn btn-primary">Enviar</button>
        </div>
      </div>
    </div>`;
  modalRoot.style.display = 'block';

  document.getElementById('cancel-eval').addEventListener('click', closeModal);
  document.getElementById('submit-eval').addEventListener('click', () => {
    const nota = Number(document.getElementById('nota-select').value);
    if (!Number.isInteger(nota) || nota < 1 || nota > 7) {
      alert('Nota inválida. Debe ser un entero entre 1 y 7.');
      return;
    }
    submitNota(avisoId, nota);
  });
}

function closeModal() {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.style.display = 'none';
  modalRoot.innerHTML = '';
}

function submitNota(avisoId, nota) {
  fetch('/api/notas/agregar', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({avisoId: avisoId, nota: nota})
  })
  .then(res => res.json())
  .then(json => {
    if (json.ok) {
      // actualizar promedio y contador en la tabla
      const promEl = document.getElementById('prom-' + avisoId);
      if (promEl) {
        if (json.promedio === null) {
          promEl.textContent = '-';
        } else {
          // formatear a 1 decimal
          promEl.textContent = Number(json.promedio).toFixed(1);
        }
      }
      // si vino total, actualizar small entre paréntesis (opcional)
      if (json.total !== undefined) {
        // pequeño hack: actualizar el small que está después del span
        const row = promEl.parentElement;
        if (row) {
          const small = row.querySelector('small');
          if (small) small.textContent = '(' + json.total + ')';
        }
      }

      closeModal();
    } else {
      alert('Error: ' + (json.error || 'No se pudo guardar la nota.'));
    }
  })
  .catch(err => {
    console.error(err);
    alert('Error de conexión al servidor.');
  });
}
