export const PDB_ID = '6E9F'

export const FULL_TARGET = 'ACGUUUUGAUCUGAAAUAUUCAGGUCU'
export const CRRNA_FULL = 'CACCCGUGCAAAAAUGCAGGGGUCUAAAACGACCUGAAUAUUUCAGAUCAAA'

export const TARGET_START_RESIDUE = 5
export const TARGET_END_RESIDUE = 26
export const GUIDE_SPACER_START_RESIDUE = 31
export const GUIDE_SPACER_END_RESIDUE = 52

export const TARGET_SITE = FULL_TARGET.slice(TARGET_START_RESIDUE - 1, TARGET_END_RESIDUE)
export const CRRNA_SPACER = CRRNA_FULL.slice(GUIDE_SPACER_START_RESIDUE - 1, GUIDE_SPACER_END_RESIDUE)

export const BASIC_TARGET = 'AUGCAUGC'
export const GUIDE_LENGTHS = [18, 20, 22]
export const BASES = ['A', 'U', 'G', 'C']

const COMPLEMENT = { A: 'U', U: 'A', G: 'C', C: 'G' }

export function complement(base) {
  return COMPLEMENT[base] || ''
}

export function reverseComplement(sequence) {
  return [...sequence].reverse().map(complement).join('')
}

export function guideResidueForTargetIndex(targetIndex) {
  return GUIDE_SPACER_END_RESIDUE - targetIndex
}

export function baseClass(base) {
  if (base === 'A' || base === 'G') return 'purine'
  if (base === 'U' || base === 'C') return 'pyrimidine'
  return 'unknown'
}

export function hydrogenBonds(a, b) {
  const pair = a + b
  if (pair === 'AU' || pair === 'UA') return 2
  if (pair === 'GC' || pair === 'CG') return 3
  return 0
}