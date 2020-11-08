export class LiteCaptcha extends HTMLElement {
  static get observedAttributes() {
    return ['sitekey', 'hl', 'theme', 'size', 'tabindex']
  }

  constructor() {
    super()
    this.value = ''
    this.size = 'normal'
    this.theme = 'light'
    this.tabindex = 0

    this._successCallback = this._successCallback.bind(this)
    this._expiredCallback = this._expiredCallback.bind(this)
    this._errorCallback = this._errorCallback.bind(this)
    this._sendEvent = this._sendEvent.bind(this)
    this._sendOnLoad = this._sendOnLoad.bind(this)
  }

  connectedCallback() {
    if (!this.getAttribute('sitekey')) {
      console.error('[lite-captcha]: sitekey not provided')
      return
    }

    if (!window.grecaptcha) {
      this.getScript()
    } else {
      this.renderCaptcha()

      // Use timeout to not affect render of parent component
      setTimeout(this._sendOnLoad, 0)
    }
  }

  attributeChangedCallback(name) {
    if (this.isConnected) {
      this.clearCapthcha()
      if (name === 'hl') {
        this._sendOnLoad(false)
        delete window.grecaptcha
        this.getScript()
      } else {
        this.renderCaptcha()
      }
    }
  }

  clearCapthcha() {
    this.value = ''
    this._sendEvent('')
    this.innerHTML = ''
  }

  getScript() {
    let script = document.createElement('script')
    script.src = `https://www.recaptcha.net/recaptcha/api.js?render=explicit&hl=${this.getAttribute(
      'hl'
    )}`
    script.async = true
    script.defer = true
    script.onload = () => {
      grecaptcha.ready(() => {
        this.renderCaptcha()
        this._sendOnLoad()
      })
    }

    document.head.append(script)
  }

  async renderCaptcha() {
    const container = document.createElement('div')
    this.widgetID = await window.grecaptcha.render(container, {
      sitekey: this.getAttribute('sitekey'),
      theme: this.getAttribute('theme'),
      size: this.getAttribute('size'),
      tabindex: this.getAttribute('tabindex'),
      callback: this._successCallback,
      'expired-callback': this._expiredCallback,
      'error-callback': this._errorCallback,
    })
    this.append(container)
  }

  _successCallback(token) {
    this.value = token
    this._sendEvent(token)
    this.successCallback && this.successCallback(token)
  }

  _expiredCallback() {
    this.value = ''
    this._sendEvent('')
    this.expiredCallback && this.expiredCallback()
  }

  _errorCallback(err) {
    this.value = ''
    this._sendEvent('')
    this.errorCallback && this.errorCallback(err)
  }

  _sendEvent(value) {
    if (this.onChange) {
      this.onChange(value)
    } else {
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value },
        })
      )
    }
  }

  _sendOnLoad(value = true) {
    if (this.onLoad) {
      this.onLoad(value)
    } else {
      this.dispatchEvent(
        new CustomEvent('load', {
          detail: { value },
        })
      )
    }
  }

  reset() {
    this.value = ''
    this._sendEvent('')
    window.grecaptcha && grecaptcha.reset(this.widgetID)
  }
}

customElements.define('lite-captcha', LiteCaptcha)
