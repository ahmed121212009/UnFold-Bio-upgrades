import 'molstar/build/viewer/molstar.css'
import { Viewer } from 'molstar/lib/apps/viewer/app'
import { MolScriptBuilder as MS } from 'molstar/lib/mol-script/language/builder'
import { Script } from 'molstar/lib/mol-script/script'
import { StructureSelection } from 'molstar/lib/mol-model/structure'
import { Color } from 'molstar/lib/mol-util/color'
import { guideResidueForTargetIndex, TARGET_START_RESIDUE } from './sequence.js'

const BASE_URL = import.meta.env.BASE_URL
const SCENES = {
  '6E9F': { url: BASE_URL + '6E9F.pdb', format: 'pdb', protein: 'A', guide: 'B', target: 'C', guideRange: [31, 52], targetRange: [5, 26] },
  '9LZT': { url: 'https://files.rcsb.org/download/9LZT.pdb', format: 'pdb', protein: 'B', guide: 'A' },
  '9LZU': { url: BASE_URL + '9LZU.pdb', format: 'pdb', protein: 'A', guide: 'C', target: 'B' },
  '4UN3': { url: 'https://files.rcsb.org/download/4UN3.pdb', format: 'pdb', protein: 'B', guide: 'A', target: 'C', secondTarget: 'D' },
}
const viewers = new Map()
const beadComponents = new Map()
let activeScene = null

function chainRange(chain, start = 1, end = 9999) {
  return MS.struct.generator.atomGroups({
    'chain-test': MS.core.rel.eq([MS.ammp('auth_asym_id'), chain]),
    'residue-test': MS.core.rel.inRange([MS.ammp('auth_seq_id'), start, end]),
  })
}

function structureCell(viewer) {
  const items = viewer?.plugin?.managers?.structure?.hierarchy?.current?.structures
  return items?.length ? items[0].cell : undefined
}

async function addCartoon(viewer, structure, chain, label, color, range) {
  const expr = range ? chainRange(chain, range[0], range[1]) : chainRange(chain)
  const component = await viewer.plugin.builders.structure.tryCreateComponentFromExpression(
    structure, expr, label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'), { label }
  )
  if (!component) return
  await viewer.plugin.builders.structure.representation.addRepresentation(component, {
    type: 'cartoon',
    color: 'uniform',
    colorParams: { value: Color(color) },
  })
  return component
}

async function createScene(id) {
  const cfg = SCENES[id]
  if (!cfg) throw new Error('Unknown structure scene: ' + id)
  const viewer = await Viewer.create('scene-' + id, {
    layoutIsExpanded: false,
    layoutShowControls: false,
    layoutShowSequence: false,
    layoutShowLog: false,
    layoutShowLeftPanel: false,
    layoutShowRemoteState: false,
    collapseLeftPanel: true,
    collapseRightPanel: true,
    viewportShowReset: false,
    viewportShowScreenshotControls: false,
    viewportShowControls: false,
    viewportShowExpand: false,
    viewportShowToggleFullscreen: false,
    viewportShowSettings: false,
    viewportShowSelectionMode: false,
    viewportShowAnimation: false,
    viewportShowTrajectoryControls: false,
    viewportBackgroundColor: '#080b10',
  })
  await viewer.loadStructureFromUrl(cfg.url, cfg.format, false)
  const structure = structureCell(viewer)
  if (!structure) throw new Error('Structure ' + id + ' loaded without a model.')

  const proteinColor = id === '4UN3' ? 0x66758b : 0x657181
  await addCartoon(viewer, structure, cfg.protein, id === '4UN3' ? 'SpCas9 protein' : id === '9LZT' || id === '9LZU' ? 'RfxCas13d · CasRx' : 'EsCas13d', proteinColor)
  if (id === '6E9F') {
    await addCartoon(viewer, structure, cfg.guide, 'crRNA spacer', 0x49c8b1, cfg.guideRange)
    await addCartoon(viewer, structure, cfg.target, 'target RNA', 0xf0a45b, cfg.targetRange)
  } else if (id === '9LZT') {
    await addCartoon(viewer, structure, cfg.guide, 'RfxCas13d crRNA', 0x49c8b1)
  } else if (id === '9LZU') {
    await addCartoon(viewer, structure, cfg.guide, 'RfxCas13d crRNA', 0x49c8b1)
    await addCartoon(viewer, structure, cfg.target, 'bound RNA · off-target example', 0xf0a45b)
  } else {
    await addCartoon(viewer, structure, cfg.guide, 'SpCas9 single-guide RNA', 0x49c8b1)
    await addCartoon(viewer, structure, cfg.target, 'target DNA strand', 0x8e9cff)
    await addCartoon(viewer, structure, cfg.secondTarget, 'non-target DNA · PAM strand', 0xf0a45b)
  }
  return { viewer, structure }
}

export async function showScene(id) {
  for (const scene of Object.keys(SCENES)) {
    const element = document.getElementById('scene-' + scene)
    if (element) element.hidden = scene !== id
  }
  activeScene = id
  if (!viewers.has(id)) viewers.set(id, await createScene(id))
  return viewers.get(id)
}

async function addPairBead(viewer, chain, residue, label, color) {
  const structure = structureCell(viewer)
  const component = await viewer.plugin.builders.structure.tryCreateComponentFromExpression(
    structure, chainRange(chain, residue, residue), 'reading-head-' + chain + '-' + residue, { label }
  )
  if (!component) return null
  await viewer.plugin.builders.structure.representation.addRepresentation(component, {
    type: 'spacefill', typeParams: { sizeFactor: 2.1, alpha: 0.98 },
    color: 'uniform', colorParams: { value: Color(color) },
  })
  return component
}

export async function showReadingPair(targetIndex, guideLength = 22) {
  const scene = viewers.get('6E9F')
  if (!scene || activeScene !== '6E9F') return
  const old = beadComponents.get('6E9F') || []
  if (old.length) {
    const builder = scene.viewer.plugin.build()
    for (const component of old) if (component?.ref) builder.delete(component.ref)
    await builder.commit()
  }
  const targetResidue = TARGET_START_RESIDUE + targetIndex
  const guideResidue = guideResidueForTargetIndex(targetIndex)
  const target = await addPairBead(scene.viewer, 'C', targetResidue, 'Target RNA C:' + targetResidue, 0xffb55f)
  const guide = targetIndex < guideLength
    ? await addPairBead(scene.viewer, 'B', guideResidue, 'crRNA B:' + guideResidue, 0x70f0d7)
    : null
  beadComponents.set('6E9F', [target, guide].filter(Boolean))
}

export function hasScene(id) { return viewers.has(id) }
export function activeSceneId() { return activeScene }
