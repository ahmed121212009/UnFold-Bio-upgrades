# UnFold-BIO upgrades

A standalone prototype for the structure-linked Guide RNA Design section. It keeps a beginner-friendly Basic Guide mode alongside a sequence-accurate 6E9F design mode, with a synchronized Mol* structure viewer and sequence reading head.

## Verified 6E9F sequence data

The sequence records in the 6E9F PDB coordinate file identify:

- Chain C target RNA (27 nt): 5′-ACGUUUUGAUCUGAAAUAUUCAGGUCU-3′
- Chain B crRNA (52 nt): 5′-CACCCGUGCAAAAAUGCAGGGGUCUAAAACGACCUGAAUAUUUCAGAUCAAA-3′
- The target-paired segment is target chain C residues 5–26 (22 nt): 5′-UUUGAUCUGAAAUAUUCAGGUC-3′
- The matching spacer is crRNA chain B residues 31–52 (22 nt): 5′-GACCUGAAUAUUUCAGAUCAAA-3′

The spacer is the reverse complement of that target segment using RNA pairing (A–U, G–C). Shorter 18 nt and 20 nt options are shown as design exercises, not as experimentally validated designs. The 3D view always shows the observed 6E9F complex.

## Data sources

- [RCSB PDB entry 6E9F](https://www.rcsb.org/structure/6E9F) — EsCas13d–crRNA–target RNA ternary complex.
- [RCSB PDB sequence page for 6E9F](https://www.rcsb.org/sequence/6E9F) — chain sequence records.
- Coordinate file bundled as public/6E9F.pdb from the project’s original UnFold-BIO repository, matching the RCSB entry.

The DNA viewer screenshot is used as a layout reference. Its B-DNA geometry values are not reused for this RNA complex.

## Run locally

```sh
npm install
npm run dev
```

Build a static site with `npm run build`. The prototype is configured for relative asset paths so it can be deployed under a GitHub Pages project path.
