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
        if (e.key === 'ArrowDown') { e.preventDefault(); if (itens[index + 1]) itens[index + 1].focus() }
        if (e.key === 'ArrowUp') { e.preventDefault(); if (itens[index - 1]) itens[index - 1].focus(); else input.focus() }
        if (e.key === 'Enter') { input.value = item; list.classList.remove('visible'); if (onSelect) onSelect(item); input.focus() }
      })

      div.addEventListener('blur', (e) => {
        if (!list.contains(e.relatedTarget) && e.relatedTarget !== input) list.classList.remove('visible')
      })

      list.appendChild(div)
    })

    list.classList.add('visible')
  })

  input.addEventListener('keydown', (e) => {
    const itens = list.querySelectorAll('.autocomplete-item')
    if (!itens.length || !list.classList.contains('visible')) return
    if (e.key === 'Tab') { e.preventDefault(); input.value = itens[0].textContent; list.classList.remove('visible'); if (onSelect) onSelect(itens[0].textContent) }
    if (e.key === 'ArrowDown') { e.preventDefault(); itens[0].focus() }
  })

  input.addEventListener('blur', (e) => {
    if (!list.contains(e.relatedTarget)) setTimeout(() => list.classList.remove('visible'), 150)
  })

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) input.dispatchEvent(new Event('input'))
  })
}

async function setupAreaAutocomplete() {
  const { data } = await db.from('areas').select('nome').order('nome')
  if (!data) return
  criarAutocomplete('area', 'area-suggestions', data.map(a => a.nome), null)
}

async function setupSetorAutocomplete() {
  const { data } = await db.from('setores').select('nome').order('nome')
  if (!data) return
  criarAutocomplete('setor', 'setor-suggestions', data.map(s => s.nome), null)
}

async function setupCargoAutocomplete() {
  const input = document.getElementById('cargo')
  const list = document.getElementById('cargo-suggestions')
  if (!input || !list) return

  input.addEventListener('input', async () => {
    const termo = input.value.toLowerCase().trim()
    if (termo.length < 3) {
      list.classList.remove('visible')
      input.classList.remove('input-loading')
      return
    }

    input.classList.add('input-loading')

    const { data } = await db.from('salaries')
      .select('cargo')
      .ilike('cargo', `%${termo}%`)
      .limit(20)

    input.classList.remove('input-loading')

    if (!data || !data.length) { list.classList.remove('visible'); return }

    const unicos = [...new Set(data.map(d => d.cargo))].slice(0, 8)
    list.innerHTML = ''

    const rect = input.getBoundingClientRect()
    const parentRect = input.parentElement.getBoundingClientRect()
    list.style.top = (rect.bottom - parentRect.top + 8) + 'px'

    unicos.forEach((cargo, index) => {
      const div = document.createElement('div')
      div.className = 'autocomplete-item'
      div.setAttribute('tabindex', '-1')
      div.textContent = cargo

      div.addEventListener('mousedown', () => { input.value = cargo; list.classList.remove('visible') })
      div.addEventListener('keydown', (e) => {
        const itens = list.querySelectorAll('.autocomplete-item')
        if (e.key === 'ArrowDown') { e.preventDefault(); if (itens[index + 1]) itens[index + 1].focus() }
        if (e.key === 'ArrowUp') { e.preventDefault(); if (itens[index - 1]) itens[index - 1].focus(); else input.focus() }
        if (e.key === 'Enter') { input.value = cargo; list.classList.remove('visible'); input.focus() }
      })
      div.addEventListener('blur', (e) => {
        if (!list.contains(e.relatedTarget) && e.relatedTarget !== input) list.classList.remove('visible')
      })

      list.appendChild(div)
    })

    list.classList.add('visible')
  })

  input.addEventListener('keydown', (e) => {
    const itens = list.querySelectorAll('.autocomplete-item')
    if (!itens.length || !list.classList.contains('visible')) return
    if (e.key === 'Tab') { e.preventDefault(); input.value = itens[0].textContent; list.classList.remove('visible') }
    if (e.key === 'ArrowDown') { e.preventDefault(); itens[0].focus() }
  })

  input.addEventListener('blur', (e) => {
    if (!list.contains(e.relatedTarget)) setTimeout(() => list.classList.remove('visible'), 150)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  setupEstadoAutocomplete()
  setupAreaAutocomplete()
  setupSetorAutocomplete()
  setupCargoAutocomplete()
})