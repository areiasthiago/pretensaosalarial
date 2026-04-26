const BENEFICIOS_LABELS = [
  'Vale Refeição/Alimentação',
  'Plano de Saúde',
  'Plano Odontológico',
  'Vale Transporte',
  'Auxílio Home Office',
  'Previdência Privada',
  'Gympass/Wellhub',
  'Stock Options/Equity',
  'Outros'
]

const filtros = {
  cargo: null,
  area: null,
  nivel: null,
  posicao: null,
  regime: null,
  modelo: null,
  estado: null,
  cidade: null,
  porte: null,
  setor: null,
  genero: null,
  orientacao: null,
  raca: null,
  pcd: null,
  bonus: null
}

function toggleFilter(name) {
  const dropdown = document.getElementById('dropdown-' + name)
  const isOpen = dropdown.classList.contains('open')
  document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('open'))
  document.querySelectorAll('.filter-dropdown select').forEach(s => s.size = 1)
  if (!isOpen) {
    dropdown.classList.add('open')
    const select = dropdown.querySelector('select')
    if (select && name !== 'mais') {
      setTimeout(() => select.focus(), 50)
      select.size = select.options.length
      dropdown.style.minWidth = '200px'
    }
  }
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.filter-group')) {
    document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('open'))
    document.querySelectorAll('.filter-dropdown select').forEach(s => s.size = 1)
  }
})

function applySelectFilter(name, value) {
  filtros[name] = value || null
  updateChip(name, value)
  document.querySelectorAll('.filter-dropdown select').forEach(s => s.size = 1)
  document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('open'))
  buscar()
}

function updateChip(name, value) {
  const chip = document.getElementById('chip-' + name)
  const label = document.getElementById('chip-' + name + '-label')
  if (!chip) { updateChipMais(); return }

  const labels = {
    cargo: 'Cargo',
    area: 'Área',
    nivel: 'Nível',
    posicao: 'Posição',
    regime: 'Regime',
    modelo: 'Modelo',
    estado: 'Estado',
    cidade: 'Cidade',
    porte: 'Porte',
    mais: '+ mais filtros'
  }

  let removeBtn = chip.querySelector('.chip-remove')

  if (value) {
    chip.classList.add('active')
    if (label) label.textContent = value
    if (!removeBtn) {
      removeBtn = document.createElement('span')
      removeBtn.className = 'chip-remove'
      removeBtn.textContent = '×'
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        removeFilter(name)
      })
      chip.appendChild(removeBtn)
    }
  } else {
    chip.classList.remove('active')
    if (label) label.textContent = labels[name] || name
    if (removeBtn) removeBtn.remove()
  }

  const temFiltros = Object.values(filtros).some(v => v !== null)
  document.getElementById('btn-limpar').style.display = temFiltros ? 'inline-block' : 'none'
}

const FILTROS_MAIS = ['porte', 'setor', 'genero', 'orientacao', 'raca', 'pcd', 'bonus']

function updateChipMais() {
  const chipMais = document.getElementById('chip-mais')
  if (!chipMais) return
  const temAtivo = FILTROS_MAIS.some(k => filtros[k] !== null)
  chipMais.classList.toggle('active', temAtivo)
}

function removeFilter(name) {
  filtros[name] = null
  updateChip(name, null)

  const inputEl = document.getElementById('filtro-' + name)
  if (inputEl) inputEl.value = ''

  const selectEl = document.getElementById('filtro-' + name)
  if (selectEl && selectEl.tagName === 'SELECT') selectEl.value = ''

  buscar()
}

function limparFiltros() {
  Object.keys(filtros).forEach(k => filtros[k] = null)

  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.remove('active')
    const removeBtn = c.querySelector('.chip-remove')
    if (removeBtn) removeBtn.remove()
  })

  document.getElementById('chip-cargo-label').textContent = 'Cargo'
  document.getElementById('chip-area-label').textContent = 'Área'
  document.getElementById('chip-nivel-label').textContent = 'Nível'
  document.getElementById('chip-posicao-label').textContent = 'Posição'
  document.getElementById('chip-regime-label').textContent = 'Regime'
  document.getElementById('chip-modelo-label').textContent = 'Modelo'
  document.getElementById('chip-estado-label').textContent = 'Estado'
  document.getElementById('chip-cidade-label').textContent = 'Cidade'

  document.getElementById('filtro-cargo').value = ''
  document.getElementById('filtro-area').value = ''
  document.getElementById('filtro-estado').value = ''
  document.getElementById('filtro-cidade').value = ''
  document.getElementById('filtro-setor').value = ''
  document.querySelectorAll('select[id^="filtro-"]').forEach(s => { s.value = ''; s.size = 1 })
  document.getElementById('btn-limpar').style.display = 'none'
  buscar()
}

async function buscar() {
  document.getElementById('stat-mediana').textContent = '...'
  document.getElementById('stat-minimo').textContent = '...'
  document.getElementById('stat-maximo').textContent = '...'
  document.getElementById('stat-bonus').textContent = '...'

  let query = db.from('salaries').select('salario, bonus, beneficios')

  const janela = new Date()
  janela.setMonth(janela.getMonth() - 36)
  query = query.gte('created_at', janela.toISOString())

  if (filtros.cargo) query = query.ilike('cargo', `%${filtros.cargo}%`)
  if (filtros.area) {
    const { data: areasList } = await db.from('areas').select('id, nome')
    if (areasList) {
      const encontrado = areasList.find(a => a.nome === filtros.area)
      if (encontrado) {
        query = query.eq('area_id', encontrado.id)
      } else {
        query = query.ilike('area_raw', `%${filtros.area}%`)
      }
    }
  }
  if (filtros.nivel) query = query.eq('nivel', filtros.nivel)
  if (filtros.posicao) query = query.eq('posicao', filtros.posicao)
  if (filtros.regime) query = query.eq('regime', filtros.regime)
  if (filtros.modelo) query = query.eq('modelo', filtros.modelo)
  if (filtros.estado) query = query.eq('estado', filtros.estado.split(' — ')[0])
  if (filtros.cidade) query = query.ilike('cidade', `%${filtros.cidade}%`)
  if (filtros.porte) query = query.eq('porte_empresa', filtros.porte)
  if (filtros.setor) {
    const { data: setoresList } = await db.from('setores').select('id, nome')
    if (setoresList) {
      const encontrado = setoresList.find(s => s.nome === filtros.setor)
      if (encontrado) {
        query = query.eq('setor_id', encontrado.id)
      } else {
        query = query.ilike('setor_raw', `%${filtros.setor}%`)
      }
    }
  }
  if (filtros.genero) query = query.eq('genero', filtros.genero)
  if (filtros.orientacao) query = query.eq('orientacao_sexual', filtros.orientacao)
  if (filtros.raca) query = query.eq('raca_etnia', filtros.raca)
  if (filtros.pcd) query = query.eq('pcd', filtros.pcd)
  if (filtros.bonus !== null) query = query.eq('bonus', filtros.bonus === 'true')

  const { data, error } = await query

  if (error || !data || data.length < 10) {
    document.getElementById('stat-mediana').textContent = '—'
    document.getElementById('stat-minimo').textContent = '—'
    document.getElementById('stat-maximo').textContent = '—'
    document.getElementById('stat-bonus').textContent = '—'
    document.getElementById('beneficios-list').innerHTML = ''
    document.getElementById('results-header').style.display = 'none'
    document.getElementById('empty-state').style.display = 'flex'

    const temFiltros = Object.values(filtros).some(v => v !== null)
    const count = data ? data.length : 0

    document.getElementById('empty-state').innerHTML = error || !data
      ? `<p>Não foi possível carregar os dados. Tente novamente.</p>`
      : count === 0 && temFiltros
      ? `<p>Nenhum resultado para essa combinação de filtros. Tente ampliar a busca.</p>
        <button class="btn btn-ghost" onclick="limparFiltros()">Limpar filtros</button>`
      : count === 0
      ? `<p>Nossa base ainda está crescendo. Seja um dos primeiros a contribuir!</p>
        <a href="/cadastro/" class="btn btn-primary">Ajude nossa base a crescer</a>`
      : `<p>Por enquanto ainda encontramos <strong>poucas respostas</strong> para essa consulta. Precisamos de <strong>mais cadastros</strong> para exibir os dados com segurança e proteger a privacidade dos usuários.</p>
        <a href="/cadastro/" class="btn btn-primary">Ajude nossa base a crescer</a>`

    document.querySelector('.consulta-results').classList.add('loaded')
    return
  }

  document.getElementById('empty-state').style.display = 'none'

  const salarios = data.map(d => d.salario).sort((a, b) => a - b)
  const mediana = calcMediana(salarios)
  const minimo = salarios[0]
  const maximo = salarios[salarios.length - 1]
  const comBonus = data.filter(d => d.bonus === true).length
  const pctBonus = Math.round((comBonus / data.length) * 100)

  document.getElementById('stat-mediana').textContent = formatarMoeda(mediana)
  document.getElementById('stat-minimo').textContent = formatarMoeda(minimo)
  document.getElementById('stat-maximo').textContent = formatarMoeda(maximo)
  document.getElementById('stat-bonus').textContent = pctBonus + '%'

  const resultsHeader = document.getElementById('results-header')
  resultsHeader.style.display = 'block'
  const temFiltros = Object.values(filtros).some(v => v !== null)
  document.getElementById('results-count').innerHTML = temFiltros
    ? `<strong>${data.length} respostas</strong> para os filtros selecionados`
    : `<strong>${data.length} respostas</strong> no total`

  const beneficiosCount = {}
  BENEFICIOS_LABELS.forEach(b => beneficiosCount[b] = 0)
  data.forEach(d => {
    if (d.beneficios && Array.isArray(d.beneficios)) {
      d.beneficios.forEach(b => {
        if (beneficiosCount[b] !== undefined) beneficiosCount[b]++
      })
    }
  })

  const beneficiosList = document.getElementById('beneficios-list')
  beneficiosList.innerHTML = ''
  Object.entries(beneficiosCount)
    .map(([label, count]) => ({ label, pct: Math.round((count / data.length) * 100) }))
    .filter(b => b.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .forEach(({ label, pct }) => {
      const tag = document.createElement('div')
      tag.className = 'beneficio-tag'
      tag.innerHTML = `<span class="beneficio-pct">${pct}%</span> ${label}`
      beneficiosList.appendChild(tag)
    })

  document.querySelector('.consulta-results').classList.add('loaded')
}

function calcMediana(arr) {
  const mid = Math.floor(arr.length / 2)
  return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2
}

function mostrarSugestoes(listId, itens, onSelect) {
  const list = document.getElementById(listId)
  if (!list) return
  list.innerHTML = ''
  if (!itens.length) { list.classList.remove('visible'); return }

  const input = list.parentElement.querySelector('input')
  if (input) {
    const rect = input.getBoundingClientRect()
    const parentRect = input.parentElement.getBoundingClientRect()
    list.style.top = (rect.bottom - parentRect.top + 2) + 'px'
  }

  itens.forEach(item => {
    const div = document.createElement('div')
    div.className = 'autocomplete-item'
    div.textContent = item
    div.addEventListener('mousedown', () => {
      const inputEl = list.parentElement.querySelector('input')
      if (inputEl) inputEl.value = item
      list.classList.remove('visible')
      if (onSelect) onSelect(item)
    })
    list.appendChild(div)
  })
  list.classList.add('visible')
}

async function setupConsultaAutocompletes() {
  // Busca dados para top sugestões usando nomes canônicos
  const { data: allSalaries } = await db.from('salaries')
    .select('cargo, area_id, setor_id, areas(nome), setores(nome)')
    .limit(500)

  const cargoCount = {}
  const areaCount = {}
  const setorCount = {}

  if (allSalaries) {
    allSalaries.forEach(d => {
      if (d.cargo) cargoCount[d.cargo] = (cargoCount[d.cargo] || 0) + 1
      if (d.areas?.nome) areaCount[d.areas.nome] = (areaCount[d.areas.nome] || 0) + 1
      if (d.setores?.nome) setorCount[d.setores.nome] = (setorCount[d.setores.nome] || 0) + 1
    })
  }

  const topCargos = Object.entries(cargoCount).filter(([, n]) => n >= 5).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c]) => c)
  const topAreas = Object.entries(areaCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([a]) => a)
  const topSetores = Object.entries(setorCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s]) => s)

  // CARGO
  const cargoInput = document.getElementById('filtro-cargo')
  const cargoList = document.getElementById('filtro-cargo-suggestions')
  const cargoDropdown = document.getElementById('dropdown-cargo')

  if (cargoInput && cargoList && cargoDropdown) {
    const cargoObserver = new MutationObserver(() => {
      if (cargoDropdown.classList.contains('open') && !cargoInput.value.trim()) {
        mostrarSugestoes('filtro-cargo-suggestions', topCargos, (cargo) => {
          cargoInput.value = cargo
          filtros.cargo = cargo
          updateChip('cargo', cargo)
          cargoDropdown.classList.remove('open')
          buscar()
        })
      }
      if (!cargoDropdown.classList.contains('open')) {
        cargoList.classList.remove('visible')
      }
    })
    cargoObserver.observe(cargoDropdown, { attributes: true, attributeFilter: ['class'] })

    cargoInput.addEventListener('input', async () => {
      const termo = cargoInput.value.trim()
      if (!termo) {
        mostrarSugestoes('filtro-cargo-suggestions', topCargos, (cargo) => {
          cargoInput.value = cargo
          filtros.cargo = cargo
          updateChip('cargo', cargo)
          cargoDropdown.classList.remove('open')
          buscar()
        })
        return
      }
      if (termo.length < 3) { cargoList.classList.remove('visible'); return }

      cargoInput.classList.add('input-loading')
      const { data } = await db.from('salaries').select('cargo').ilike('cargo', `%${termo}%`).limit(20)
      cargoInput.classList.remove('input-loading')

      if (!data || !data.length) { cargoList.classList.remove('visible'); return }

      const contagem = {}
      data.forEach(d => { if (d.cargo) contagem[d.cargo] = (contagem[d.cargo] || 0) + 1 })
      const unicos = Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c]) => c)
      mostrarSugestoes('filtro-cargo-suggestions', unicos, (cargo) => {
        cargoInput.value = cargo
        filtros.cargo = cargo
        updateChip('cargo', cargo)
        cargoDropdown.classList.remove('open')
        buscar()
      })
    })

    cargoInput.addEventListener('blur', () => setTimeout(() => cargoList.classList.remove('visible'), 150))
  }

  // ÁREA
  const { data: areasData } = await db.from('areas').select('nome').order('nome')
  const areaNomes = areasData ? areasData.map(a => a.nome) : []
  const areaDropdown = document.getElementById('dropdown-area')
  const areaInput = document.getElementById('filtro-area')
  const areaList = document.getElementById('filtro-area-suggestions')

  if (areaInput && areaList && areaDropdown) {
    const areaObserver = new MutationObserver(() => {
      if (areaDropdown.classList.contains('open') && !areaInput.value.trim()) {
        mostrarSugestoes('filtro-area-suggestions', topAreas, (area) => {
          areaInput.value = area
          filtros.area = area
          updateChip('area', area)
          areaDropdown.classList.remove('open')
          buscar()
        })
      }
      if (!areaDropdown.classList.contains('open')) {
        areaList.classList.remove('visible')
      }
    })
    areaObserver.observe(areaDropdown, { attributes: true, attributeFilter: ['class'] })

    criarAutocomplete('filtro-area', 'filtro-area-suggestions', areaNomes, (valor) => {
      filtros.area = valor
      updateChip('area', valor)
      areaDropdown.classList.remove('open')
      buscar()
    })
  }

  // SETOR
  const { data: setoresData } = await db.from('setores').select('nome').order('nome')
  const setorNomes = setoresData ? setoresData.map(s => s.nome) : []
  const setorInput = document.getElementById('filtro-setor')
  const setorList = document.getElementById('filtro-setor-suggestions')

  if (setorInput && setorList) {
    setorInput.addEventListener('focus', () => {
      if (filtros.setor) return
      mostrarSugestoes('filtro-setor-suggestions', topSetores, (setor) => {
        setorInput.value = setor
        filtros.setor = setor
        updateChipMais()
        buscar()
      })
    })

    setorInput.addEventListener('blur', () => setTimeout(() => setorList.classList.remove('visible'), 150))
    setorInput.addEventListener('input', () => {
      if (!setorInput.value.trim()) {
        filtros.setor = null
        updateChipMais()
        buscar()
      }
    })

    criarAutocomplete('filtro-setor', 'filtro-setor-suggestions', setorNomes, (valor) => {
      filtros.setor = valor
      updateChip('mais', valor)
      buscar()
    })
  }

  // ESTADO / CIDADE
  const estadoItems = ESTADOS.map(e => `${e.sigla} — ${e.nome}`)
  criarAutocomplete('filtro-estado', 'filtro-estado-suggestions', estadoItems, async (valor) => {
    filtros.estado = valor
    updateChip('estado', valor.split(' — ')[1] || valor)
    document.getElementById('dropdown-estado')?.classList.remove('open')
    const sigla = valor.split(' — ')[0]
    const cidadeInput = document.getElementById('filtro-cidade')
    if (cidadeInput) {
      cidadeInput.disabled = true
      cidadeInput.placeholder = 'Carregando...'
      const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios?orderBy=nome`)
      const cidades = await res.json()
      cidadeInput.disabled = false
      cidadeInput.placeholder = 'Digite sua cidade...'
      criarAutocomplete('filtro-cidade', 'filtro-cidade-suggestions', cidades.map(c => c.nome), (cidade) => {
        filtros.cidade = cidade
        updateChip('cidade', cidade)
        document.getElementById('dropdown-cidade')?.classList.remove('open')
        buscar()
      })
    }
    buscar()
  })
}

document.addEventListener('DOMContentLoaded', () => {
  setupConsultaAutocompletes()
  buscar()
})