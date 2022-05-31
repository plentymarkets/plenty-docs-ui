function setTheme (themeName) {
  window.localStorage.setItem('theme', themeName)
  document.documentElement.className = themeName
}

document.addEventListener('DOMContentLoaded', () => {
  const host = window.location.host
  const defaultTheme = (host === 'developers.plentymarkets.com') ? 'theme-grey' : 'theme-red'
  const storedTheme = window.localStorage.getItem('theme')

  storedTheme ? setTheme(storedTheme) : setTheme(defaultTheme)
})
