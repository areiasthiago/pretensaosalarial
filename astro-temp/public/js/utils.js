async function loadVersion() {
  try {
    const paths = ['package.json', '../package.json']
    let pkg = null
    for (const path of paths) {
      try {
        const res = await fetch(path)
        if (res.ok) { pkg = await res.json(); break }
      } catch {}
    }
    if (pkg) {
      const badges = document.querySelectorAll('.version-tag')
      badges.forEach(el => el.textContent = `beta v${pkg.version}`)
    }
  } catch (e) {
    console.warn('Versão não encontrada')
  }
}

function aplicarMascaraMoeda(input) {
  input.addEventListener('input', () => {
    let valor = input.value.replace(/\D/g, '')
    if (!valor) { input.value = ''; return }
    valor = (parseInt(valor) / 100).toFixed(2)
    const [inteiro, decimal] = valor.split('.')
    const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    input.value = `R$ ${inteiroFormatado},${decimal}`
  })
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

document.addEventListener('DOMContentLoaded', () => {
  loadVersion()
  const salarioInput = document.getElementById('salario')
  if (salarioInput) {
    salarioInput.type = 'text'
    salarioInput.placeholder = 'Ex: R$ 8.500,00'
    aplicarMascaraMoeda(salarioInput)
  }
})