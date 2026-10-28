export const CHAPTERS = [
  { id: 'pairing', title: '1 · Read the target', short: 'RNA pairing', scene: '6E9F' },
  { id: 'design', title: '2 · Build a crRNA', short: 'Guide design', scene: '6E9F' },
  { id: 'cas13-load', title: '3 · Load CasRx', short: 'Guide locator', scene: '9LZT' },
  { id: 'specificity', title: '4 · Test specificity', short: 'Ethics & trade-offs', scene: '9LZU' },
  { id: 'pam', title: '5 · Find Cas9’s PAM', short: 'DNA targeting', scene: '4UN3' },
  { id: 'cut', title: '6 · Open and cut DNA', short: 'R-loop & scissors', scene: '4UN3' },
  { id: 'repair', title: '7 · Repair & reflect', short: 'NHEJ / HDR', scene: '4UN3' },
]

export const CAS9_TARGET_DNA = 'TTTTTTACAAATTGAGTTAT'
export const CAS9_GUIDE_RNA = 'AUAACUCAAUUUGUAAAAAA'
export const CAS9_PAM = 'TGG'
export const CAS9_PDB_TARGET_CHAIN = 'C'
export const CAS9_PDB_NONTARGET_CHAIN = 'D'

export const CHAPTER_COPY = {
  pairing: {
    kicker: 'CHAPTER 01 · THE TARGET',
    title: 'Start with the message',
    summary: 'RNA is written 5′ → 3′. A guide binds it in the opposite direction through complementary bases.',
    question: 'Tap a base pair and watch the reading head move between the sequence strip and the 6E9F structure.',
    takeaway: 'The target is RNA. This Cas13 example does not use Cas9’s DNA PAM rule.',
  },
  design: {
    kicker: 'CHAPTER 02 · BUILD YOUR CRRNA',
    title: 'Write the reverse complement',
    summary: 'Choose each guide base yourself. Work across the target, then read the completed guide 5′ → 3′.',
    question: 'Select a target position, choose its complementary guide base, and check the whole spacer.',
    takeaway: 'This is sequence practice. Pairing alone does not predict binding strength or cleavage activity.',
  },
  'cas13-load': {
    kicker: 'CHAPTER 03 · MOLECULAR DOCKING',
    title: 'The guide loads into CasRx',
    summary: 'The crRNA scaffold helps Cas13d hold its guide; the spacer provides sequence recognition.',
    question: 'Watch the guide-loaded state, then add an RNA and compare the deposited complexes.',
    takeaway: 'The viewer uses experimental RfxCas13d structures. The highlighted docking sequence is a visual explanation, not a simulation of forces.',
  },
  specificity: {
    kicker: 'CHAPTER 04 · SPECIFICITY & ETHICS',
    title: 'A match is not the whole story',
    summary: 'Near-matches can bind in some contexts. Active Cas13 can also show collateral RNA cleavage, with effects that vary by system and cell context.',
    question: 'Compare the target and decoy, then choose what a responsible design review should ask next.',
    takeaway: 'Off-target binding and collateral cleavage are different risks. A nuclease-dead dCasRx can bind without Cas13’s own RNA-cutting activity; it may still carry a fused effector.',
  },
  pam: {
    kicker: 'CHAPTER 05 · CHANGE SYSTEMS',
    title: 'Cas9 searches for a PAM',
    summary: 'SpCas9 recognizes a DNA PAM, commonly 5′-NGG-3′, before it checks the adjacent protospacer.',
    question: 'Find the NGG on the non-target strand in this 4UN3-derived sequence example.',
    takeaway: 'PAM rules depend on the Cas9 variant. This chapter is specifically about SpCas9.',
  },
  cut: {
    kicker: 'CHAPTER 06 · R-LOOP & CUT',
    title: 'Unzip, check, then cut',
    summary: 'PAM recognition opens local DNA. Guide–DNA pairing forms an R-loop; HNH and RuvC cut opposite strands.',
    question: 'Advance the animation to reveal the strand-specific cut marks about three bases upstream of the PAM.',
    takeaway: 'The sequence diagram is a teaching schematic; 4UN3 is a deposited bound structure and does not show every dynamic intermediate.',
  },
  repair: {
    kicker: 'CHAPTER 07 · REPAIR & CONSEQUENCES',
    title: 'The cell makes the next move',
    summary: 'After a double-strand break, repair can produce different outcomes. NHEJ often joins ends with small insertions or deletions; HDR can use a matching template.',
    question: 'Choose a repair pathway and inspect a simplified example. The animation does not predict a real cell’s outcome.',
    takeaway: 'Cas9 changes DNA; Cas13 targets RNA. Their persistence, reversibility, and ethical questions differ.',
  },
}
