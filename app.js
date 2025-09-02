// Drawer Handle Calculator (edge-to-hole distance for centred two-hole handles)
(function(){
  const widthEl = document.getElementById('width');
  const spacingEl = document.getElementById('spacing');
  const unitsEl = document.getElementById('units');
  const precisionEl = document.getElementById('precision');
  const calcBtn = document.getElementById('calcBtn');
  const resetBtn = document.getElementById('resetBtn');
  const copyBtn = document.getElementById('copyBtn');
  const pngBtn = document.getElementById('pngBtn');
  const resultsEl = document.getElementById('results');
  const unitLabels = document.querySelectorAll('.unit-label');

  function round(val, digits) {
    const p = Math.pow(10, digits);
    return Math.round((val + Number.EPSILON) * p) / p;
  }

  function toMM(val, units) {
    if (units === 'in') return val * 25.4;
    return val;
  }
  function fromMM(val, units) {
    if (units === 'in') return val / 25.4;
    return val;
  }

  function setUnitLabels(units) {
    unitLabels.forEach(el => { el.textContent = units; });
  }

  function calc() {
    const units = unitsEl.value;
    const d = parseInt(precisionEl.value, 10);
    const W_in = parseFloat(widthEl.value);
    const S_in = parseFloat(spacingEl.value);

    if (!isFinite(W_in) || W_in <= 0 || !isFinite(S_in) || S_in < 0) {
      resultsEl.innerHTML = '<p class="muted">Please enter a valid drawer width and hole spacing (≥ 0).</p>';
      copyBtn.disabled = true;
      pngBtn.disabled = true;
      return;
    }

    // Convert to mm for math
    const W = toMM(W_in, units);
    const S = toMM(S_in, units);

    if (S > W) {
      resultsEl.innerHTML = '<p class="muted">Hole spacing S cannot exceed drawer width W.</p>';
      copyBtn.disabled = true;
      pngBtn.disabled = true;
      return;
    }

    // margin m = (W - S)/2
    const m = (W - S) / 2;
    const x1 = (W / 2) - (S / 2);
    const x2 = (W / 2) + (S / 2);

    const m_u = round(fromMM(m, units), d);
    const x1_u = round(fromMM(x1, units), d);
    const x2_u = round(fromMM(x2, units), d);
    const W_u = round(W_in, d);
    const S_u = round(S_in, d);
    const unit = units;

    let html = '';
    html += `<p><strong>Edge-to-hole distance (both sides):</strong> ${m_u} ${unit}</p>`;
    html += '<table><thead><tr><th>Point</th><th>From left edge</th></tr></thead><tbody>';
    html += `<tr><td>Left hole centre (x₁)</td><td>${x1_u} ${unit}</td></tr>`;
    html += `<tr><td>Right hole centre (x₂)</td><td>${x2_u} ${unit}</td></tr>`;
    html += '</tbody></table>';
    resultsEl.innerHTML = html;

    copyBtn.disabled = false;
    pngBtn.disabled = false;

    copyBtn.onclick = async () => {
      const summary = `Drawer Handle (centred)
W=${W_u} ${unit}, S=${S_u} ${unit}
Edge-to-hole distance m = ${m_u} ${unit}
Left hole x1 = ${x1_u} ${unit}
Right hole x2 = ${x2_u} ${unit}`;
      try {
        await navigator.clipboard.writeText(summary);
        copyBtn.textContent = 'Copied ✓';
        setTimeout(()=>copyBtn.textContent='Copy Summary', 1200);
      } catch(e) {
        alert('Copied text is shown below:\n\n' + summary);
      }
    };

    pngBtn.onclick = () => {
      // Create a printable drill strip as PNG
      const canvas = document.createElement('canvas');
      const scale = 3;
      const width = 1200 * scale;
      const height = 220 * scale;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#000000';
      ctx.font = `${16*scale}px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial`;
      ctx.fillText('Drawer Handle Drill Strip', 20*scale, 30*scale);
      ctx.font = `${14*scale}px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial`;
      ctx.fillText(`W=${W_u} ${unit}, S=${S_u} ${unit}, Edge-to-hole m=${m_u} ${unit}`, 20*scale, 52*scale);

      // draw baseline
      const marginLeft = 20*scale;
      const marginRight = 20*scale;
      const y = 120*scale;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(marginLeft, y);
      ctx.lineTo(width - marginRight, y);
      ctx.stroke();

      // scale: line length represents drawer width W
      const lineLength = width - marginLeft - marginRight;
      function xFor(valMM) {
        const ratio = valMM / W; // 0..1 along width
        return marginLeft + ratio * lineLength;
      }

      // mark left and right edges
      ctx.fillText('LEFT EDGE', marginLeft, y - 10*scale);
      ctx.fillText('RIGHT EDGE', width - marginRight - 120*scale, y - 10*scale);

      // holes
      const x1p = xFor(x1);
      const x2p = xFor(x2);
      ctx.beginPath(); ctx.arc(x1p, y, 6*scale, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x2p, y, 6*scale, 0, Math.PI*2); ctx.fill();

      ctx.fillText(`x₁ ${x1_u} ${unit}`, x1p - 20*scale, y + 28*scale);
      ctx.fillText(`x₂ ${x2_u} ${unit}`, x2p - 20*scale, y + 28*scale);

      // download
      const link = document.createElement('a');
      link.download = 'drawer_handle_drill_strip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  }

  calcBtn.addEventListener('click', calc);
  resetBtn.addEventListener('click', () => {
    widthEl.value = '';
    spacingEl.value = '';
    resultsEl.innerHTML = '<p class="muted">Enter width & spacing and tap <strong>Calculate</strong>.</p>';
    copyBtn.disabled = true;
    pngBtn.disabled = true;
  });
  unitsEl.addEventListener('change', () => {
    const u = unitsEl.value;
    setUnitLabels(u);
  });

  // Unit labels
  setUnitLabels(unitsEl.value);
})();
