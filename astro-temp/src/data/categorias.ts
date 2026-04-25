export interface Categoria {
  label: string
  bg: string
  text: string
}

export const categorias: Categoria[] = [
  { label: 'Pretensão salarial',    bg: '#EDE9FE', text: '#5B21B6' },
  { label: 'Negociação salarial',   bg: '#D1FAE5', text: '#065F46' },
  { label: 'Mercado de trabalho',   bg: '#DBEAFE', text: '#1E40AF' },
  { label: 'Currículo',             bg: '#FEF3C7', text: '#92400E' },
  { label: 'Entrevista de emprego', bg: '#FCE7F3', text: '#9D174D' },
  { label: 'Busca e candidatura',     bg: '#F3F4F6', text: '#374151' },
]

export function slugCategoria(cat: string): string {
  return cat
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

export function corCategoria(cat: string): { bg: string; text: string } {
  return categorias.find(c => c.label === cat) ?? { bg: '#F3F4F6', text: '#374151' }
}