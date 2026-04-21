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