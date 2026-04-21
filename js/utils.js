async function loadVersion() {
  try {
    const res = await fetch('/pretensaosalarial/package.json')
    const pkg = await res.json()
    const badges = document.querySelectorAll('.version-tag')
    badges.forEach(el => el.textContent = `beta v${pkg.version}`)
  } catch (e) {
    console.warn('Versão não encontrada')
  }
}

loadVersion()