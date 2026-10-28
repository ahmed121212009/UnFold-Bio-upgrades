# UnFold-BIO upgrades

A standalone prototype for the Guide RNA Design section, with three lessons: Basic Guide, structure-linked 6E9F crRNA design, and a sequence-only NCBI RefSeq transcript lab. The 6E9F lesson pairs a Mol* structure view with a synchronized sequence reading head.

## Verified 6E9F sequence data

The sequence records in the 6E9F PDB coordinate file identify:

- Chain C target RNA (27 nt): 5′-ACGUUUUGAUCUGAAAUAUUCAGGUCU-3′
- Chain B crRNA (52 nt): 5′-CACCCGUGCAAAAAUGCAGGGGUCUAAAACGACCUGAAUAUUUCAGAUCAAA-3′
- The target-paired segment is target chain C residues 5–26 (22 nt): 5′-UUUGAUCUGAAAUAUUCAGGUC-3′
- The matching spacer is crRNA chain B residues 31–52 (22 nt): 5′-GACCUGAAUAUUUCAGAUCAAA-3′

The spacer is the reverse complement of that target segment using RNA pairing (A–U, G–C). Shorter 18 nt and 20 nt options are shown as design exercises, not as experimentally validated designs. The embedded 3D view shows the observed 6E9F complex. Shorter lengths are sequence exercises mapped to the observed structure; they are not separate experimentally measured designs. The mismatch control demonstrates a noncanonical pair visually and makes no prediction about cleavage or activity.

## Data sources

- [RCSB PDB entry 6E9F](https://www.rcsb.org/structure/6E9F) — EsCas13d–crRNA–target RNA ternary complex.
- [RCSB PDB sequence page for 6E9F](https://www.rcsb.org/sequence/6E9F) — chain sequence records.
- Coordinate file bundled as public/6E9F.pdb from the project’s original UnFold-BIO repository, matching the RCSB entry.
- The **NCBI transcript lab** bundles the original FASTA at `src/NM_002046.7.fasta`, downloaded from the NCBI RefSeq record [NM_002046.7](https://www.ncbi.nlm.nih.gov/nuccore/NM_002046.7), human GAPDH transcript variant 1. The app reads the FASTA and converts T to U for the RNA pairing lesson. Window choices and reverse complements are sequence exercises only; they are not activity, accessibility, or specificity predictions.
- [RCSB PDB entry 6E9E](https://www.rcsb.org/structure/6E9E) is the related EsCas13d–crRNA binary complex. The viewer links to its online structure view as a target-free comparison. The local Mol* view remains 6E9F.

The DNA viewer screenshot is used as a layout reference for the reading head, sequence strip, and structure facts. Its B-DNA geometry values are not reused for the RNA complex.

## Run locally

```sh
npm install
npm run dev
```

Build a static site with `npm run build`. The prototype is configured for relative asset paths so it can be deployed under a GitHub Pages project path.
