import 'molstar/build/viewer/molstar.css'
import { Viewer } from 'molstar/lib/apps/viewer/app'
import { MolScriptBuilder as MS } from 'molstar/lib/mol-script/language/builder'
import { Script } from 'molstar/lib/mol-script/script'
import { StructureSelection } from 'molstar/lib/mol-model/structure'
import { Color } from 'molstar/lib/mol-util/color'
import {
  GUIDE_SPACER_END_RESIDUE,
  GUIDE_SPACER_START_RESIDUE,
  TARGET_END_RESIDUE,
  TARGET_START_RESIDUE,
  guideResidueForTargetIndex,
} from './sequence.js'

const PDB_URL = import.meta.env.BASE_URL + '6E9F.pdb'
let viewer
let structureCell
let queue = Promise.resolve()
let activeComponents = []

function serial(work) {
  queue = queue.then(work, (error) => {
    console.error(error)
    return work()
  })
  return queue
}

function chainRange(chain, start, end) {
  return MS.struct.generator.atomGroups({
    'chain-test': MS.core.rel.eq([MS.ammp('auth_asym_id'), chain]),
    'residue-test': MS.core.rel.inRange([MS.ammp('auth_seq_id'), start, end]),
  })
}

function currentStructure() {
  const items = viewer?.plugin?.managers?.structure?.hierarchy?.current?.structures
  return items?.length ? items[0].cell : undefined
}

async function addCartoonOverlay(expression, key, label, hexColor) {
  const plugin = viewer.plugin
  const component = await plugin.builders.structure.tryCreateComponentFromExpression(
    structureCell,
    expression,
    key,
    { label }
  )
  if (!component) return
  await plugin.builders.structure.representation.addRepresentation(component, {
    type: 'cartoon',
    color: 'uniform',
    colorParams: { value: Color(hexColor) },
  })
  return component
}

async function addPairBead(chain, residue, label, hexColor) {
  const component = await viewer.plugin.builders.structure.tryCreateComponentFromExpression(
    structureCell,
    chainRange(chain, residue, residue),
    'reading-head-' + chain + '-' + residue,
    { label }
  )
  if (!component) return
  await viewer.plugin.builders.structure.representation.addRepresentation(component, {
    type: 'spacefill',
    typeParams: { sizeFactor: 2.6, alpha: 0.95 },
    color: 'uniform',
    colorParams: { value: Color(hexColor) },
  })
  return component
}

async function clearReadingHead() {
  if (!activeComponents.length) return
  const builder = viewer.plugin.build()
  for (const component of activeComponents) {
    if (component?.ref) builder.delete(component.ref)
  }
  await builder.commit()
  activeComponents = []
}

export async function initStructure() {
  viewer = await Viewer.create('molstar-stage', {
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
    viewportBackgroundColor: '#0a0c10',
  })

  await viewer.loadStructureFromUrl(PDB_URL, 'pdb', false)
  structureCell = currentStructure()
  if (!structureCell) throw new Error('The 6E9F structure loaded without a model.')

  const protein = MS.struct.generator.atomGroups({
    'chain-test': MS.core.rel.eq([MS.ammp('auth_asym_id'), 'A']),
  })
  await addCartoonOverlay(
    protein,
    'cas13d-protein',
    'EsCas13d protein',
    0x596477
  )
  await addCartoonOverlay(
    chainRange('B', GUIDE_SPACER_START_RESIDUE, GUIDE_SPACER_END_RESIDUE),
    'crrna-spacer',
    'crRNA spacer (chain B)',
    0x49c8b1
  )
  await addCartoonOverlay(
    chainRange('C', TARGET_START_RESIDUE, TARGET_END_RESIDUE),
    'target-site',
    'Target RNA site (chain C)',
    0xf0a45b
  )

  focusTargetSite()
  return viewer
}

function focusTargetSite() {
  if (!viewer || !structureCell) return
  const selection = Script.getStructureSelection(
    chainRange('C', TARGET_START_RESIDUE, TARGET_END_RESIDUE),
    structureCell.obj.data
  )
  viewer.plugin.managers.structure.focus.setFromLoci(
    StructureSelection.toLociWithSourceUnits(selection)
  )
}

export function showReadingPair(targetIndex, guideLength = 22) {
  if (!viewer || !structureCell) return Promise.resolve()
  const targetResidue = TARGET_START_RESIDUE + targetIndex
  const guideResidue = guideResidueForTargetIndex(targetIndex)
  const guideIsInLength = targetIndex < guideLength
  return serial(async () => {
    await clearReadingHead()
    const target = await addPairBead(
      'C',
      targetResidue,
      'Target RNA C:' + targetResidue,
      0xffa548
    )
    if (guideIsInLength) {
      const guide = await addPairBead(
        'B',
        guideResidue,
        'crRNA B:' + guideResidue,
        0x55dfc5
      )
      activeComponents = [target, guide].filter(Boolean)
    } else {
      activeComponents = [target].filter(Boolean)
    }
  })
}

export function hasStructure() {
  return !!viewer
}