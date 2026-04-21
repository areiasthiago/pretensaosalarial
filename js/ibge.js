const ESTADOS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
]

let cidadesCache = []
let estadoSelecionado = null

function criarAutocomplete(inputId, suggestionsId, items, onSelect) {
  const input = document.getElementById(inputId)
  const list = document.getElementById(suggestionsId)
  if (!input || !list) return

  input.addEventListener('input', () => {
    const termo = input.value.toLowerCase().trim()
    list.innerHTML = ''
    if (!termo) { list.classList.remove('visible'); return }

    const filtrados = items.filter(item =>
      item.toLowerCase().includes(termo)
    ).slice(0, 8)

    if (!filtrados.length) { list.classList.remove('visible'); return }

    const rect = input.getBoundingClientRect()
    const parentRect = input.parentElement.getBoundingClientRect()
    list.style.top = (rect.bottom - parentRect.top + 8) + 'px'

    filtrados.forEach((item, index) => {
      const div = document.createElement('div')
      div.className = 'autocomplete-item'
      div.setAttribute('tabindex', '-1')
      div.textContent = item

      div.addEventListener('mousedown', () => {
        input.value = item
        list.classList.remove('visible')
        if (onSelect) onSelect(item)
      })

      div.addEventListener('keydown', (e) => {
        const itens = list.querySelectorAll('.autocomplete-item')
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          if (itens[index + 1]) itens[index + 1].focus()
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (itens[index - 1]) itens[index - 1].focus()
          else input.focus()
        }
        if (e.key === 'Enter') {
          input.value = item
          list.classList.remove('visible')
          if (onSelect) onSelect(item)
          input.focus()
        }
      })

      div.addEventListener('blur', (e) => {
        if (!list.contains(e.relatedTarget) && e.relatedTarget !== input) {
          list.classList.remove('visible')
        }
      })

      list.appendChild(div)
    })

    list.classList.add('visible')
  })

  input.addEventListener('keydown', (e) => {
    const itens = list.querySelectorAll('.autocomplete-item')
    if (!itens.length || !list.classList.contains('visible')) return

    if (e.key === 'Tab') {
      e.preventDefault()
      input.value = itens[0].textContent
      list.classList.remove('visible')
      if (onSelect) onSelect(itens[0].textContent)
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      itens[0].focus()
    }
  })

  input.addEventListener('blur', (e) => {
    if (!list.contains(e.relatedTarget)) {
      setTimeout(() => list.classList.remove('visible'), 150)
    }
  })

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) input.dispatchEvent(new Event('input'))
  })
}

function setupEstadoAutocomplete() {
  const input = document.getElementById('estado')
  const list = document.getElementById('estado-suggestions')
  const cidadeInput = document.getElementById('cidade')
  if (!input || !list) return

  const estadoItems = ESTADOS.map(e => `${e.sigla} — ${e.nome}`)

  criarAutocomplete('estado', 'estado-suggestions', estadoItems, async (valor) => {
    const sigla = valor.split(' — ')[0]
    estadoSelecionado = sigla
    if (cidadeInput) {
      cidadeInput.disabled = true
      cidadeInput.value = ''
      cidadeInput.placeholder = 'Carregando cidades...'
    }
    await loadCidades(sigla)
  })
}

async function loadCidades(sigla) {
  const cidadeInput = document.getElementById('cidade')
  if (!cidadeInput) return

  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios?orderBy=nome`
    )
    const cidades = await res.json()
    cidadesCache = cidades.map(c => c.nome)
    cidadeInput.disabled = false
    cidadeInput.placeholder = 'Digite sua cidade...'
    criarAutocomplete('cidade', 'cidade-suggestions', cidadesCache, null)
  } catch {
    cidadeInput.placeholder = 'Erro ao carregar cidades'
    cidadeInput.disabled = false
  }
}

async function setupAreaAutocomplete() {
  const { data } = await db.from('areas').select('nome').order('nome')
  if (!data) return
  const nomes = data.map(a => a.nome)
  criarAutocomplete('area', 'area-suggestions', nomes, null)
}

async function setupSetorAutocomplete() {
  const { data } = await db.from('setores').select('nome').order('nome')
  if (!data) return
  const nomes = data.map(s => s.nome)
  criarAutocomplete('setor', 'setor-suggestions', nomes, null)
}

document.addEventListener('DOMContentLoaded', () => {
  setupEstadoAutocomplete()
  setupAreaAutocomplete()
  setupSetorAutocomplete()
})