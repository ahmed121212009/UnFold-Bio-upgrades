import './style.css'
import { initStructure, showReadingPair, hasStructure } from './structure.js'
import {
  BASES,
  BASIC_TARGET,
  CRRNA_SPACER,
  GUIDE_LENGTHS,
  TARGET_SITE,
  TARGET_START_RESIDUE,
  baseClass,
  complement,
  guideResidueForTargetIndex,
  hydrogenBonds,
  reverseComplement,
} from './sequence.js'

const app = document.getElementById('app')
app.innerHTML = [
  '<div class="app-shell">',
  '  <header class="topbar">',
  '    <div class="brandline"><h1 class="brand"><small>UnFold-BIO · Upgrade prototype</small>Guide RNA design</h1></div>',
  '    <div class="top-meta"><span>Structure <strong>6E9F</strong></span><span>EsCas13d · crRNA · target RNA</span><button class="control-btn" id="scan-btn" type="button">Scan sequence</button></div>',
  '  </header>',
  '  <nav class="mode-nav" aria-label="Learning mode">',
  '    <button class="mode-btn" data-mode="basic" type="button">Basic guide</button>',
  '    <button class="mode-btn active" data-mode="structure" type="button">6E9F crRNA design</button>',
  '    <span class="mode-caption">Learn simple pairing first, then design against a real structure</span>',
  '  </nav>',
  '  <main class="workspace" id="workspace">',
  '    <section class="visual-column" aria-label="Molecular structure">',
  '      <div class="visual-head"><span class="eyebrow">Molecule view</span><span class="structure-badge"><i class="status-dot"></i><span id="structure-status">Loading 6E9F coordinates…</span></span></div>',
  '      <div id="molstar-stage"></div>',
  '      <div class="viewer-overlay"><span class="legend-pill"><i class="legend-swatch" style="background:#49c8b1"></i>crRNA spacer · chain B</span><span class="legend-pill"><i class="legend-swatch" style="background:#f0a45b"></i>target site · chain C</span></div>',
  '      <div class="viewer-message" id="viewer-message">Loading the 6E9F molecular structure…</div>',
  '      <div class="basic-art" aria-hidden="true">',
  '        <svg viewBox="0 0 520 360" role="img">',
  '          <path class="strand" stroke="#49c8b1" d="M90 35 C420 85 100 130 430 180 C110 230 410 280 90 325"/>',
  '          <path class="strand" stroke="#f0a45b" d="M430 35 C100 85 420 130 90 180 C410 230 110 280 430 325"/>',
  '          <g class="base-rung"><path d="M148 50 L372 50 M226 91 L294 91 M161 139 L359 139 M115 180 L405 180 M171 221 L349 221 M234 269 L286 269 M146 309 L374 309"/></g>',
  '          <g fill="#49c8b1"><circle class="node" cx="90" cy="35" r="8"/><circle class="node" cx="430" cy="85" r="8"/><circle class="node" cx="100" cy="130" r="8"/><circle class="node" cx="430" cy="180" r="8"/><circle class="node" cx="110" cy="230" r="8"/><circle class="node" cx="410" cy="280" r="8"/><circle class="node" cx="90" cy="325" r="8"/></g>',
  '          <g fill="#f0a45b"><circle class="node" cx="430" cy="35" r="8"/><circle class="node" cx="100" cy="85" r="8"/><circle class="node" cx="420" cy="130" r="8"/><circle class="node" cx="90" cy="180" r="8"/><circle class="node" cx="410" cy="230" r="8"/><circle class="node" cx="110" cy="280" r="8"/><circle class="node" cx="430" cy="325" r="8"/></g>',
  '        </svg><div class="basic-art-caption">A simple pairing sketch · switch to 6E9F for the observed Cas13d complex</div>',
  '      </div>',
  '    </section>',
  '    <aside class="lesson-column" aria-label="Sequence design lesson">',
  '      <section class="card primary">',
  '        <div class="reading-top"><div><h2 class="card-title">Reading head</h2><div class="reading-count" id="pair-count">Pair 1 of 22</div></div><div class="progress-track" aria-label="Sequence progress"><div class="progress-fill" id="progress-fill"></div></div></div>',
  '        <div class="strand-row"><span class="base-chip" id="target-chip">U</span><span class="strand-name" id="target-name">Target RNA</span><span class="strand-detail" id="target-detail">Uracil · pyrimidine</span></div>',
  '        <div class="strand-row"><span class="base-chip" id="guide-chip">·</span><span class="strand-name" id="guide-name">crRNA spacer</span><span class="strand-detail" id="guide-detail">Choose a base to build the guide</span></div>',
  '        <div class="pair-explanation" id="pair-explanation"></div>',
  '      </section>',
  '      <section class="card">',
  '        <div class="card-head"><h2 class="card-title" id="sequence-heading">Sequence window</h2><span class="eyebrow" id="sequence-position">Target C:5–26</span></div>',
  '        <div class="row-label" id="target-row-label">Target RNA · 5′ → 3′</div>',
  '        <div class="sequence-wrap"><div class="sequence-row" id="target-row"></div></div>',
  '        <div class="rung-row" id="rung-row"></div>',
  '        <div class="row-label" id="guide-row-label">crRNA · 3′ → 5′ across the pairing</div>',
  '        <div class="sequence-wrap"><div class="sequence-row" id="guide-row"></div></div>',
  '        <div class="guide-seq"><span id="guide-seq-label">Guide written 5′ → 3′: </span><code id="guide-seq"></code></div>',
  '        <div class="sequence-note" id="sequence-note"></div>',
  '      </section>',
  '      <section class="card">',
  '        <div class="card-head"><h2 class="card-title">Choose the guide base</h2><span class="eyebrow" id="base-hint">Select a position above</span></div>',
  '        <div class="controls palette" id="base-picker"></div>',
  '        <div class="controls" style="margin-top:11px">',
  '          <button class="control-btn primary-btn" id="build-btn" type="button">Build reverse complement</button>',
  '          <button class="control-btn" id="reference-btn" type="button">Use 6E9F spacer</button>',
  '          <button class="control-btn" id="clear-btn" type="button">Clear guide</button>',
  '        </div>',
  '      </section>',
  '      <section class="card" id="length-card">',
  '        <div class="card-head"><h2 class="card-title">Guide length</h2><span class="eyebrow">Spacer only</span></div>',
  '        <div class="controls length-controls" id="length-picker"></div>',
  '        <p class="length-note">Shorter options trim the guide’s 5′ end and the matching target window. They are design exercises, not claims about experimentally validated activity.</p>',
  '      </section>',
  '      <section class="card">',
  '        <div class="card-head"><h2 class="card-title" id="facts-heading">6E9F structure facts</h2><span class="eyebrow" id="facts-position">Target C:5 · crRNA B:52</span></div>',
  '        <div class="fact-grid" id="fact-grid"></div>',
  '      </section>',
  '      <p class="source-line">Sequence and coordinates: <a href="https://www.rcsb.org/structure/6E9F" target="_blank" rel="noreferrer">RCSB PDB 6E9F</a>. The viewer shows the deposited complex; edited guide letters are a design exercise.</p>',
  '    </aside>',
  '  </main>',
  '</div>',
].join('')

const state = {
  mode: 'structure',
  selected: 0,
  length: 22,
  guide: Array(22).fill(null),
  basicSelected: 0,
  basicGuide: Array(BASIC_TARGET.length).fill(null),
  scanning: false,
  scanTimer: null,
}

const $ = (id) => document.getElementById(id)

function sequenceForMode() {
  return state.mode === 'basic' ? BASIC_TARGET : TARGET_SITE.slice(0, state.length)
}

function activeLength() {
  return state.mode === 'basic' ? BASIC_TARGET.length : state.length
}

function selectedIndex() {
  return state.mode === 'basic' ? state.basicSelected : state.selected
}

function guideBaseAt(targetIndex) {
  if (state.mode === 'basic') return state.basicGuide[targetIndex] || null
  const guideIndex = state.length - 1 - targetIndex
  return guideIndex >= 0 ? state.guide[guideIndex] || null : null
}

function currentGuideSequence() {
  if (state.mode === 'basic') return state.basicGuide.map((base) => base || '·').join('')
  return state.guide.map((base) => base || '·').join('')
}

function classForBase(base) {
  return base ? 'base-' + base : ''
}

function currentPairStatus() {
  const target = sequenceForMode()[selectedIndex()]
  const guide = guideBaseAt(selectedIndex())
  return { target, guide, bonds: hydrogenBonds(target, guide || '') }
}

function renderSequence() {
  const mode = state.mode
  const target = mode === 'basic' ? BASIC_TARGET : TARGET_SITE
  const length = activeLength()
  const selected = selectedIndex()
  const targetRow = []
  const guideRow = []
  const rungs = []
  const leftEnd = mode === 'basic' ? '' : '<span class="strand-end">5′</span>'
  const rightEnd = mode === 'basic' ? '' : '<span class="strand-end">3′</span>'
  const guideLeft = mode === 'basic' ? '' : '<span class="strand-end">3′</span>'
  const guideRight = mode === 'basic' ? '' : '<span class="strand-end">5′</span>'

  for (let i = 0; i < target.length; i++) {
    const base = target[i]
    const covered = i < length
    const guideBase = covered ? guideBaseAt(i) : null
    const isCorrect = !!guideBase && complement(guideBase) === base
    const selectedClass = i === selected ? ' selected' : ''
    const uncoveredClass = covered ? '' : ' uncovered'
    targetRow.push(
      '<button class="seq-cell ' + classForBase(base) + selectedClass + uncoveredClass + '" data-index="' + i + '" aria-label="Target position ' + (i + 1) + ', ' + base + '">' + base + '</button>'
    )
    const guideClasses = (guideBase ? classForBase(guideBase) : 'empty') + selectedClass + uncoveredClass + (isCorrect ? ' correct' : guideBase ? ' incorrect' : '')
    guideRow.push(
      '<button class="seq-cell ' + guideClasses + '" data-index="' + i + '" aria-label="Guide position paired with target ' + (i + 1) + ', ' + (guideBase || 'empty') + '">' + (guideBase || '·') + '</button>'
    )
    const rungText = guideBase ? (isCorrect ? '⋮⋮' : '×') : '·'
    rungs.push('<span class="rung' + (isCorrect ? ' correct' : guideBase ? ' incorrect' : '') + '">' + rungText + '</span>')
  }

  $('target-row').innerHTML = leftEnd + targetRow.join('') + rightEnd
  $('guide-row').innerHTML = guideLeft + guideRow.join('') + guideRight
  $('rung-row').innerHTML = (mode === 'basic' ? '' : '<span class="rung-spacer"></span>') + rungs.join('') + (mode === 'basic' ? '' : '<span class="rung-spacer"></span>')
  $('guide-seq').textContent = currentGuideSequence()
  $('sequence-heading').textContent = mode === 'basic' ? 'Basic pairing practice' : 'Sequence window'
  $('target-row-label').textContent = mode === 'basic' ? 'Target RNA · simplified' : 'Target RNA · 5′ → 3′'
  $('guide-row-label').textContent = mode === 'basic' ? 'Guide slots · paired by position for the basic lesson' : 'crRNA · 3′ → 5′ across the pairing'
  $('guide-seq-label').textContent = mode === 'basic' ? 'Basic guide slots: ' : 'Guide written 5′ → 3′: '
  $('sequence-position').textContent = mode === 'basic'
    ? '8 teaching positions'
    : 'Target C:' + TARGET_START_RESIDUE + '–' + (TARGET_START_RESIDUE + state.length - 1)
  $('sequence-note').innerHTML = mode === 'basic'
    ? '<strong>First, learn the pairing rule.</strong> A pairs with U; G pairs with C. The beginner board pairs positions directly and leaves antiparallel orientation for the structure lesson.'
    : '<strong>Read the target 5′ → 3′.</strong> The crRNA binds antiparallel. To write the guide 5′ → 3′, complement the target and reverse the result.'
  document.querySelectorAll('.seq-cell').forEach((cell) => {
    cell.addEventListener('click', () => selectPosition(Number(cell.dataset.index), true))
  })
}

function renderReadingHead() {
  const index = selectedIndex()
  const target = sequenceForMode()[index]
  const guide = guideBaseAt(index)
  const bonds = hydrogenBonds(target, guide || '')
  const mode = state.mode
  $('pair-count').textContent = 'Pair ' + (index + 1) + ' of ' + activeLength()
  $('progress-fill').style.width = (((index + 1) / activeLength()) * 100) + '%'
  $('target-chip').textContent = target || '·'
  $('target-chip').className = 'base-chip ' + classForBase(target)
  $('target-detail').textContent = target + ' · ' + baseClass(target)
  $('guide-chip').textContent = guide || '·'
  $('guide-chip').className = 'base-chip ' + (guide ? classForBase(guide) : '')
  $('target-name').textContent = mode === 'basic' ? 'Target RNA' : 'Target RNA · C:' + (TARGET_START_RESIDUE + index)
  $('guide-name').textContent = mode === 'basic' ? 'Your guide' : 'crRNA · B:' + guideResidueForTargetIndex(index)
  $('guide-detail').textContent = guide
    ? guide + ' · ' + baseClass(guide)
    : 'Choose a base to build the guide'
  $('base-hint').textContent = guide ? 'Change this position' : 'Select a base for this position'

  const explanation = $('pair-explanation')
  if (!guide) {
    explanation.className = 'pair-explanation'
    explanation.innerHTML = '<strong>READING HEAD</strong> Select a base below to test how it pairs with this target position.'
  } else if (bonds) {
    explanation.className = 'pair-explanation'
    explanation.innerHTML = '<strong>MATCH</strong> ' + target + ' pairs with ' + guide + ' through ' + bonds + ' hydrogen bonds. The guide base is complementary to the target.'
  } else {
    explanation.className = 'pair-explanation mismatch'
    explanation.innerHTML = '<strong>MISMATCH</strong> ' + target + ' and ' + guide + ' are not a canonical RNA base pair. Try the complementary base.'
  }

  $('facts-position').textContent = mode === 'basic'
    ? 'Practice pair ' + (index + 1)
    : 'Target C:' + (TARGET_START_RESIDUE + index) + ' · crRNA B:' + guideResidueForTargetIndex(index)
  $('fact-grid').innerHTML = mode === 'basic'
    ? '<div class="fact"><span class="fact-label">Pairing rule</span><span class="fact-value">A–U and G–C</span></div><div class="fact"><span class="fact-label">Practice</span><span class="fact-value">One base at a time</span></div>'
    : '<div class="fact"><span class="fact-label">Pair location</span><span class="fact-value">Target chain C, residue ' + (TARGET_START_RESIDUE + index) + '</span></div><div class="fact"><span class="fact-label">Guide location</span><span class="fact-value">crRNA chain B, residue ' + guideResidueForTargetIndex(index) + '</span></div><div class="fact"><span class="fact-label">Canonical bonds</span><span class="fact-value">A–U: 2 · G–C: 3</span></div><div class="fact"><span class="fact-label">Complex</span><span class="fact-value">EsCas13d · crRNA · target RNA</span></div>'
}

function renderControls() {
  const mode = state.mode
  const picker = $('base-picker')
  picker.innerHTML = BASES.map((base) =>
    '<button class="palette-btn" data-base="' + base + '" type="button"><span class="base-chip ' + classForBase(base) + '">' + base + '</span><span>pairs ' + complement(base) + '</span></button>'
  ).join('')
  picker.querySelectorAll('[data-base]').forEach((button) => {
    button.addEventListener('click', () => placeBase(button.dataset.base))
  })

  $('length-card').hidden = mode === 'basic'
  $('reference-btn').hidden = mode === 'basic'
  $('build-btn').textContent = mode === 'basic' ? 'Auto-fill complementary guide' : 'Build reverse complement'
  $('clear-btn').textContent = mode === 'basic' ? 'Clear practice' : 'Clear guide'

  const lengthPicker = $('length-picker')
  lengthPicker.innerHTML = '<span class="length-label">Choose an example length</span>' + GUIDE_LENGTHS.map((length) =>
    '<button class="control-btn' + (length === state.length ? ' active' : '') + '" data-length="' + length + '" type="button">' + length + ' nt</button>'
  ).join('')
  lengthPicker.querySelectorAll('[data-length]').forEach((button) => {
    button.addEventListener('click', () => setGuideLength(Number(button.dataset.length)))
  })

  const isBasic = mode === 'basic'
  document.querySelectorAll('.mode-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode)
  })
  $('workspace').classList.toggle('basic-mode', isBasic)
}

function render() {
  if (state.mode === 'basic') {
    state.basicSelected = Math.max(0, Math.min(BASIC_TARGET.length - 1, state.basicSelected))
  } else {
    state.selected = Math.max(0, Math.min(state.length - 1, state.selected))
  }
  renderSequence()
  renderReadingHead()
  renderControls()
}

function selectPosition(index, focusStructure) {
  if (index < 0 || index >= activeLength()) return
  if (state.mode === 'basic') state.basicSelected = index
  else state.selected = index
  render()
  if (focusStructure && state.mode === 'structure' && hasStructure()) {
    showReadingPair(state.selected, state.length)
  }
}

function placeBase(base) {
  const index = selectedIndex()
  if (state.mode === 'basic') {
    state.basicGuide[index] = base
  } else {
    const guideIndex = state.length - 1 - index
    state.guide[guideIndex] = base
  }
  render()
  if (state.mode === 'structure' && hasStructure()) showReadingPair(state.selected, state.length)
}

function buildGuide() {
  if (state.mode === 'basic') {
    state.basicGuide = BASIC_TARGET.split('').map(complement)
  } else {
    const site = TARGET_SITE.slice(0, state.length)
    state.guide = reverseComplement(site).split('')
  }
  render()
  if (state.mode === 'structure' && hasStructure()) showReadingPair(state.selected, state.length)
}

function useObservedSpacer() {
  if (state.mode !== 'structure') return
  state.guide = CRRNA_SPACER.slice(CRRNA_SPACER.length - state.length).split('')
  render()
  showReadingPair(state.selected, state.length)
}

function clearGuide() {
  if (state.mode === 'basic') state.basicGuide = Array(BASIC_TARGET.length).fill(null)
  else state.guide = Array(state.length).fill(null)
  render()
  if (state.mode === 'structure' && hasStructure()) showReadingPair(state.selected, state.length)
}

function setGuideLength(length) {
  if (!GUIDE_LENGTHS.includes(length)) return
  state.length = length
  state.selected = Math.min(state.selected, length - 1)
  state.guide = Array(length).fill(null)
  render()
  if (hasStructure()) showReadingPair(state.selected, state.length)
}

function changePosition(delta) {
  const next = (selectedIndex() + delta + activeLength()) % activeLength()
  selectPosition(next, true)
}

function stopScan() {
  if (state.scanTimer) clearInterval(state.scanTimer)
  state.scanTimer = null
  state.scanning = false
  $('scan-btn').textContent = 'Scan sequence'
  $('scan-btn').classList.remove('active')
}

function toggleScan() {
  if (state.scanning) {
    stopScan()
    return
  }
  state.scanning = true
  $('scan-btn').textContent = 'Stop scan'
  $('scan-btn').classList.add('active')
  state.scanTimer = setInterval(() => changePosition(1), 1150)
}

document.querySelectorAll('.mode-btn').forEach((button) => {
  button.addEventListener('click', () => {
    state.mode = button.dataset.mode
    stopScan()
    render()
  })
})

$('build-btn').addEventListener('click', buildGuide)
$('reference-btn').addEventListener('click', useObservedSpacer)
$('clear-btn').addEventListener('click', clearGuide)
$('scan-btn').addEventListener('click', toggleScan)
$('prev-btn')?.addEventListener('click', () => changePosition(-1))
$('next-btn')?.addEventListener('click', () => changePosition(1))

initStructure()
  .then(() => {
    $('structure-status').textContent = '6E9F structure ready'
    $('viewer-message').hidden = true
    showReadingPair(state.selected, state.length)
  })
  .catch((error) => {
    console.error(error)
    $('structure-status').textContent = 'Sequence lesson available'
    $('viewer-message').textContent = 'The 6E9F coordinates could not be loaded. The sequence lesson remains available.'
  })

render()
