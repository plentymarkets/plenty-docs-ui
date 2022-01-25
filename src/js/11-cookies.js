const name = "plenty-cookies"

class Cookies {
  constructor () {
    this.addListeners()
    if (document.cookie.indexOf(name) > -1 ) {
      this.hideCookies();
    }
  }

  addListeners(){
    let acceptButton = document.getElementsByClassName("cookie-accept")
    let declineButton = document.getElementsByClassName("cookie-deny")
    acceptButton[0].addEventListener("click", this.setCookie.bind(this))
    declineButton[0].addEventListener("click", this.setCookie.bind(this))
  }

  hideCookies() {
    document.getElementsByClassName('cookie-bar')[0].style.visibility = 'hidden'
  }

  setCookie(e){
    let accept = e.path[0].className.indexOf('cookie-accept') !== -1
    document.cookie = name+"= {consent: "+accept+"}; Secure"
    this.hideCookies()
  }
}

(function () {
  window.addEventListener('DOMContentLoaded', (event) => {
    new Cookies()
  });
})()
