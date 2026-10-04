// Compact layouts reuse the named components in scenes/*.svg.
// Coordinates passed to place() are the desired top-left and the original
// top-left, followed by an optional scale. This also scales internal animations.
function component(scene, id) {
  const opening = `<g id="${id}">`;
  const start = scene.indexOf(opening);
  if (start < 0) throw new Error(`Missing component: ${id}`);
  const tags = /<\/?g\b[^>]*>/g;
  tags.lastIndex = start;
  let depth = 0;
  for (let tag; (tag = tags.exec(scene));) {
    depth += tag[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return scene.slice(start, tags.lastIndex);
  }
  throw new Error(`Unclosed component: ${id}`);
}

function place(scene, id, x, y, originalX, originalY, scale = 1) {
  const dx = Number((x - originalX * scale).toFixed(4));
  const dy = Number((y - originalY * scale).toFixed(4));
  return component(scene, id).replace('<g ', `<g transform="translate(${dx} ${dy}) scale(${scale})" `);
}

function text(x, y, content, size = 26, anchor = 'middle', extra = '') {
  return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" class="ink" ${extra}>${content}</text>`;
}

function connect(d, delay = 0) {
  return `<path d="${d}" class="connector" />\n<path d="${d}" class="packet motion" pathLength="100" style="animation-delay:${delay}s" />`;
}

function canvas(scene, height, body) {
  const metadata = scene.match(/<title\b[^>]*>[\s\S]*?<\/desc>/)[0];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${height}" role="img" aria-labelledby="title desc">
  ${metadata}
  <!-- SHARED_STYLE -->
  <rect x="1" y="1" width="598" height="${height - 2}" rx="22" class="canvas" />
  ${body.join('\n  ')}
</svg>\n`;
}

export function mobileScene(name, scene) {
  switch (name) {
    case 'intro': {
      const copy = [...component(scene, 'intro-copy').matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map(match => match[1]);
      return canvas(scene, 550, [
        '<circle cx="362" cy="384" r="118" class="halo" />',
        '<path d="M24 468C161 418 194 501 350 451S491 468 576 385" class="wave motion" />',
        '<rect x="32" y="32" width="360" height="48" rx="24" class="soft" />',
        text(52, 64, copy[0], 24, 'start', 'letter-spacing="1.4"'),
        text(32, 139, copy[1], 46, 'start', 'font-weight="700"'),
        text(32, 197, copy[2], 46, 'start', 'font-weight="700"'),
        text(32, 244, copy[3], 24, 'start', 'letter-spacing="1"'),
        connect('M132 365H158Q177 365 177 385V427H202'),
        connect('M444 464H479V376.59', -4),
        place(scene, 'database', 48, 329, 502, 68),
        place(scene, 'laptop', 202, 389, 601, 177),
        place(scene, 'web', 394, 260, 891, 51, 0.89),
        place(scene, 'answer-sheet', 494, 425, 1005, 211, 0.8),
      ]);
    }
    case 'workflow':
      return canvas(scene, 560, [
        text(32, 40, 'Connected applications', 26, 'start'),
        connect('M236 149H364', -1.35),
        connect('M530 149H556V274H153V327', -3.2),
        connect('M236 391H405', -5),
        place(scene, 'code', 70, 85, 44, 67),
        place(scene, 'web', 364, 85, 342, 67),
        place(scene, 'desktop', 70, 327, 638, 67),
        place(scene, 'database', 405, 348, 966, 108),
        text(153, 249, 'C# / .NET'),
        text(447, 249, 'ASP.NET Core'),
        text(153, 493, 'WPF'),
        text(447, 493, 'SQL Server / MySQL', 24),
      ]);
    case 'aria-omr':
      return canvas(scene, 300, [
        '<circle cx="99" cy="138" r="105" class="halo" />',
        connect('M137.7024 131H206'),
        connect('M341 131H412', -3),
        place(scene, 'answer-sheet', 24, 54, 45, 34, 0.94),
        place(scene, 'scanner', 206, 85, 313, 67),
        place(scene, 'report', 412, 48, 583, 38, 0.8),
        place(scene, 'result', 531, 166, 865, 65, 0.52),
        text(81, 258, 'Scan'),
        text(273.5, 258, 'Process'),
        text(494, 258, 'Report'),
      ]);
    case 'ecms':
      return canvas(scene, 500, [
        '<ellipse cx="300" cy="163" rx="222" ry="135" class="halo" />',
        connect('M300 216V278H100.5V310'),
        connect('M300 278H289.5V315', -3),
        connect('M300 278H498.5V300', -7),
        place(scene, 'dashboard', 159, 58, 429, 49),
        place(scene, 'branches', 35, 310, 68, 64),
        place(scene, 'student', 236, 315, 769, 49),
        place(scene, 'finance', 413, 300, 950, 65),
        text(300, 35, 'Management dashboard'),
        text(100.5, 467, 'Branches'),
        text(289.5, 467, 'Students'),
        text(498.5, 467, 'Finances'),
      ]);
    case 'hms':
      return canvas(scene, 290, [
        '<ellipse cx="100" cy="132" rx="92" ry="100" class="halo" />',
        connect('M172.5 127H229'),
        connect('M404.2 127H467', -5),
        place(scene, 'hospital', 24, 70, 94, 65, 0.75),
        place(scene, 'employees', 229, 45, 509, 42, 0.8),
        place(scene, 'access', 467, 66, 955, 67, 0.85),
        text(98.25, 245, 'Hospital'),
        text(316.6, 245, 'Employees'),
        text(518.85, 245, 'Access'),
      ]);
    default:
      throw new Error(`Unknown scene: ${name}`);
  }
}
