let bonusValue = null
let currentStep = 1

function goToStep(n) {
  document.getElementById('panel-' + currentStep).classList.remove('active')
  document.getElementById('step-' + currentStep).classList.remove('active')

  for (let i = 1; i < n; i++) {
    const step = document.getElementById('step-' + i)
    step.classList.remove('active')
    step.classList.add('done')
    step.querySelector('.step-number').textContent = '✓'
  }

  currentStep = n
  document.getElementById('panel-' + n).classList.add('active')
  document.getElementById('step-' + n).classList.add('active')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function mostrarErro(inputId, mensagem) {
  const input = document.getElementById(inputId)
  if (!input) return
  input.classList.add('input-error')
  let hint = input.parentElement.querySelector('.error-message')
  if (!hint) {
    hint = document.createElement('span')
    hint.className = 'error-message'
    input.parentElement.appendChild(hint)
  }
  hint.textContent = mensagem
}

function limparErros() {
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'))
  document.querySelectorAll('.error-message').forEach(el => el.remove())
}

function validarEtapa1() {
  limparErros()
  let valido = true

  const email = document.getElementById('email').value.trim()
  const cargo = document.getElementById('cargo').value.trim()
  const area = document.getElementById('area').value.trim()
  const posicao = document.getElementById('posicao').value
  const nivel = document.getElementById('nivel').value
  const regime = document.getElementById('regime').value
  const modelo = document.getElementById('modelo').value

  if (!email) { mostrarErro('email', 'Informe seu email'); valido = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mostrarErro('email', 'Email inválido'); valido = false }
  if (!cargo) { mostrarErro('cargo', 'Informe seu cargo'); valido = false }
  if (!area) { mostrarErro('area', 'Informe sua área'); valido = false }
  if (!posicao) { mostrarErro('posicao', 'Selecione sua posição'); valido = false }
  if (!nivel) { mostrarErro('nivel', 'Selecione seu nível'); valido = false }
  if (!regime) { mostrarErro('regime', 'Selecione o regime'); valido = false }
  if (!modelo) { mostrarErro('modelo', 'Selecione o modelo'); valido = false }

  return valido
}

function validarEtapa2() {
  limparErros()
  let valido = true

  const salario = document.getElementById('salario').value.trim()
  if (!salario) { mostrarErro('salario', 'Informe seu salário'); valido = false }

  if (bonusValue === null) {
    const bonusGroup = document.getElementById('bonus-sim').parentElement
    let hint = bonusGroup.querySelector('.error-message')
    if (!hint) {
      hint = document.createElement('span')
      hint.className = 'error-message'
      bonusGroup.appendChild(hint)
    }
    hint.textContent = 'Selecione se recebe bônus'
    valido = false
  }

  return valido
}

function validarEtapa3() {
  limparErros()
  let valido = true

  const estado = document.getElementById('estado').value.trim()
  const cidade = document.getElementById('cidade').value.trim()
  const porte = document.getElementById('porte').value
  const setor = document.getElementById('setor').value.trim()

  if (!estado) { mostrarErro('estado', 'Informe o estado'); valido = false }
  if (!cidade) { mostrarErro('cidade', 'Informe a cidade'); valido = false }
  if (!porte) { mostrarErro('porte', 'Selecione o porte da empresa'); valido = false }
  if (!setor) { mostrarErro('setor', 'Informe o setor da empresa'); valido = false }

  return valido
}

function validarEAvancar(etapa) {
  let valido = false
  if (etapa === 1) valido = validarEtapa1()
  if (etapa === 2) valido = validarEtapa2()
  if (etapa === 3) valido = validarEtapa3()
  if (valido) goToStep(etapa + 1)
}

function selectBonus(value) {
  bonusValue = value
  document.getElementById('bonus-sim').classList.toggle('checked', value === true)
  document.getElementById('bonus-nao').classList.toggle('checked', value === false)
  document.querySelectorAll('.bonus-options .error-message').forEach(el => el.remove())
}

function toggleBeneficio(el) {
  el.classList.toggle('checked')
}

function getBeneficios() {
  return Array.from(document.querySelectorAll('#beneficios .check-item.checked'))
    .map(el => el.dataset.value)
}

function checkRateLimit() {
  const LIMITE_MS = 24 * 60 * 60 * 1000
  const ultimoEnvio = localStorage.getItem('ultimo_cadastro')
  if (ultimoEnvio && Date.now() - parseInt(ultimoEnvio) < LIMITE_MS) {
    const horas = Math.ceil((LIMITE_MS - (Date.now() - parseInt(ultimoEnvio))) / 3600000)
    mostrarErro('email', `Você já cadastrou um salário recentemente. Tente novamente em ${horas}h.`)
    goToStep(1)
    return false
  }
  return true
}

async function getRecaptchaToken() {
  return new Promise((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha.execute('6Ld0QsMsAAAAAFzRqvyWkbJnFhmv_vhIVVqCUKEd', { action: 'cadastro' })
        .then(token => resolve(token))
    })
  })
}

async function enviarCadastro() {
  const honeypot = document.getElementById('website').value
  if (honeypot) { console.warn('Bot detectado'); return }
  if (!checkRateLimit()) return

  const btn = document.getElementById('btn-enviar')
  btn.textContent = 'Enviando...'
  btn.disabled = true

  const recaptchaToken = await getRecaptchaToken()
  if (!recaptchaToken) {
    alert('Erro na verificação de segurança. Tente novamente.')
    btn.textContent = 'Enviar cadastro ✓'
    btn.disabled = false
    return
  }

  const email = document.getElementById('email').value.trim()
  const cargo = document.getElementById('cargo').value.trim()
  const area = document.getElementById('area').value.trim()
  const nivel = document.getElementById('nivel').value
  const posicao = document.getElementById('posicao').value
  const regime = document.getElementById('regime').value
  const modelo = document.getElementById('modelo').value
  const salario = parseFloat(
    document.getElementById('salario').value
      .replace('R$ ', '')
      .replace(/\./g, '')
      .replace(',', '.')
  )
  const estado = document.getElementById('estado').value.trim().split(' — ')[0]
  const cidade = document.getElementById('cidade').value.trim()
  const porte = document.getElementById('porte').value
  const setor = document.getElementById('setor').value.trim()
  const genero = document.getElementById('genero').value || null
  const orientacao = document.getElementById('orientacao').value || null
  const raca = document.getElementById('raca').value || null
  const pcd = document.getElementById('pcd').value || null

  try {
    if (email) {
      const emailHash = await hashEmail(email)
      const { error: emailError } = await db.from('email_submissions').insert({ email_hash: emailHash })
      if (emailError && emailError.code === '23505') {
        mostrarErro('email', 'Este email já foi usado para cadastrar um salário.')
        goToStep(1)
        btn.textContent = 'Enviar cadastro ✓'
        btn.disabled = false
        return
      }
    }

    const areaMatch = await db.from('areas').select('id').ilike('nome', area).maybeSingle()
    const area_id = areaMatch.data ? areaMatch.data.id : null

    const setorMatch = await db.from('setores').select('id').ilike('nome', setor).maybeSingle()
    const setor_id = setorMatch.data ? setorMatch.data.id : null

    const { error } = await db.from('salaries').insert({
      cargo,
      area_id,
      area_raw: area,
      nivel: nivel || null,
      posicao: posicao || null,
      regime,
      modelo: modelo || null,
      salario,
      bonus: bonusValue,
      beneficios: getBeneficios(),
      estado,
      cidade: cidade || null,
      porte_empresa: porte || null,
      setor_id,
      setor_raw: setor,
      genero,
      orientacao_sexual: orientacao,
      raca_etnia: raca,
      pcd
    })

    if (error) throw error

    document.getElementById('panel-4').classList.remove('active')
    document.getElementById('panel-sucesso').classList.add('active')
    localStorage.setItem('ultimo_cadastro', Date.now().toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (err) {
    console.error(err)
    mostrarErro('btn-enviar', 'Erro ao enviar. Tente novamente.')
    btn.textContent = 'Enviar cadastro ✓'
    btn.disabled = false
  }
}

async function hashEmail(email) {
  const normalized = email.toLowerCase().trim()
  const msgBuffer = new TextEncoder().encode(normalized)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}