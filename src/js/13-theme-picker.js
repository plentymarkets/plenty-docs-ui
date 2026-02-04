function getLogoName (themeName) {
  const theme = window.localStorage.getItem('theme')

  if (theme === 'theme-onyx') {
    return 'PlentyONE_Logo_White_RGB.svg'
  }

  return 'PlentyONE_Logo_PlentyBlue_RGB.svg'
}

function setTheme (themeName) {
  window.localStorage.setItem('theme', themeName)
  document.documentElement.className = themeName

  const logoImg = document.getElementById('logo-img')
  const locale = window.location.pathname.split('/')[1] ? `/${window.location.pathname.split('/')[1]}/` : '/'
  const logoName = getLogoName(themeName)
  logoImg.src = `${window.location.origin}${locale}_/img/${logoName}`
}

function getTheme () {
  return window.localStorage.getItem('theme')
}

function isCompliantTheme (themeName) {
  const allowedThemes = ['theme-ivory', 'theme-onyx']
  return allowedThemes.includes(themeName)
}

document.addEventListener('DOMContentLoaded', () => {
  const host = window.location.host
  const defaultTheme = (host === 'developers.plentymarkets.com') ? 'theme-onyx' : 'theme-ivory'
  const storedTheme = getTheme()
  const isCompliant = isCompliantTheme(storedTheme)

  storedTheme && isCompliant ? setTheme(storedTheme) : setTheme(defaultTheme)
})
