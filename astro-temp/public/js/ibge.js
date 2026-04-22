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

function setupEstadoAutocomplete() {
  const input = document.getElementById('estado')
  const cidadeInput = document.getElementById('cidade')
  if (!input) return

  const estadoItems = ESTADOS.map(e => `${e.sigla} — ${e.nome}`)

  criarAutocomplete('estado', 'estado-suggestions', estadoItems, async (valor) => {
    const sigla = valor.split(' — ')[0]
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