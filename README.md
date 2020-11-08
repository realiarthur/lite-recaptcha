# Lite Recaptcha [![](https://img.shields.io/npm/v/lite-recaptcha.svg?style=flat)](https://www.npmjs.com/package/lite-recaptcha) ![](https://img.shields.io/bundlephobia/minzip/lite-recaptcha.svg?style=flat)

Recaptcha Web Component. Also works with LitElement.

- [Usage](#usage)
- [API Reference](#api-reference)
- [Example](#example)

## Usage

Module export LiteCaptcha class, and also define `<lite-capthca>` element.

```js
import 'lite-captcha'
import { html } from 'lit-html'

class extends Whatever {
  //...

  render() {
    return html`
      <lite-captcha
        sitekey=${this.captchaSiteKey}
        hl=${this.lang}
        .onChange=${this.onChange}
        .onLoad=${this.onLoad}
      ></lite-captcha>
    `
  }
}
```

## Api Reference

### Props

- sitekey: `String`. Required!
- hl: `String`. By default recaptcha set by itself
- size: `normal || compact`. Default: 'normal'
- theme: `light || dark`. . Default: 'light'
- tabindex: `Number`. Default: 0

### Callbacks

- onChange: `(token: String)=>{...}`. Calls with `token` when captcha checked successfully. Calls with `''` when captcha expired, rerendered, error or reset
- onLoad: `(loaded: Boolean)=>{...}`. Calls with `loaded = true` after loading recaptcha script. Each time `hl` changes, the loading starts over (`loaded = false`).
- successCallback: `(token: String)=>{...}`.
- expiredCallback: `function`
- errorCallback: `function`

### Methods

- reset(). Reset captcha and value

### Events

- change: `e=>console.log(e.detail.value)`. Fire if `onChange` callback not provided. Works the same
- load: `e=>console.log(e.detail.value)`. Fire if `onLoad` callback not provided. Works the same

## Example

Here is `<captcha-input>` example based on LitElement for [lite-form](https://www.npmjs.com/package/lite-form)

```js
import { LitElement, html } from 'lit-element'
import compose from 'compose-function'
import { withField, withError } from 'lite-form'
import 'lite-captcha'

class CaptchaInput extends LitElement {
  createRenderRoot() {
    return this
  }

  static get properties() {
    return {
      name: { type: String },
      captchaSiteKey: { type: String },
      lang: { type: String },
      loaded: { type: Boolean },

      //touched and error comes from withError HOC
      touched: { type: Boolean },
      error: { type: String },
    }
  }

  constructor() {
    super()
    this.loaded = false
  }

  onLoad = value => {
    this.loaded = value
  }

  onChange = token => {
    // handleBlur and handleChange comes from withField HOC
    if (token) {
      this.handleBlur()
    }
    this.handleChange(token)
  }

  // Useful to reset from the outside
  reset() {
    const el = this.getElementsByTagName('lite-captcha')
    el[0] && el[0].reset()
  }

  render() {
    return html`<lite-captcha
        id="lite-captcha"
        sitekey=${this.captchaSiteKey}
        hl=${this.lang}
        .onChange=${this.onChange}
        .onLoad=${this.onLoad}
      ></lite-captcha>
      ${!this.loaded ? html`<p>loading...</p>` : null}
      ${html`<p>${this.error && this.touched ? this.error : null}</p> `}`
  }
}

const enhance = compose(withField, withError)

customElements.define('captcha-input', enhance(CaptchaInput))
```
