export interface Autor {
  /** Slug usado na URL: /blog/autor/[slug]/ */
  slug: string
  /** Nome completo exibido nos posts e na página de autor */
  nome: string
  /** Iniciais para o avatar de fallback */
  iniciais: string
  /** Bio exibida na página de autor */
  bio: string
  /** Caminho da foto a partir de /public/ — ex: /images/autores/thiago-areias.webp */
  avatar?: string
}

export const autores: Autor[] = [
  {
    slug: 'thiago-areias',
    nome: 'Thiago Areias',
    iniciais: 'TA',
    bio: 'Idealizador e criador do Pretensão Salarial, Thiago Areias atua há mais de 10 anos com SEO e desenvolvimento web. Entusiasta de IA e análise de dados, criou o projeto com o objetivo de ajudar trabalhadores a entender melhor seu valor de mercado e negociar com mais força, clareza e embasamento.',
    avatar: '/images/autores/thiago-areias.webp',
  },
]

/** Retorna o slug do autor a partir do nome completo. */
export function slugAutor(nome: string): string {
  const autor = autores.find(a => a.nome === nome)
  if (autor) return autor.slug
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

/** Retorna as iniciais do autor a partir do nome completo. */
export function iniciaisAutor(nome: string): string {
  const autor = autores.find(a => a.nome === nome)
  if (autor) return autor.iniciais
  return nome
    .split(' ')
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase()
}

/** Retorna o avatar do autor a partir do nome completo (undefined se não houver). */
export function avatarAutor(nome: string): string | undefined {
  return autores.find(a => a.nome === nome)?.avatar
}