import fasta from './NM_002046.7.fasta?raw'

export const NCBI_ACCESSION = 'NM_002046.7'
export const NCBI_LABEL = 'Homo sapiens GAPDH transcript variant 1 mRNA'
export const NCBI_TRANSCRIPT = fasta.split(/\r?\n/).filter((line) => line && !line.startsWith('>')).join('').replaceAll('T', 'U')
