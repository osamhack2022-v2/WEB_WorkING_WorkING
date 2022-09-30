import crypto from 'crypto-browserify'
import axios from 'axios'
import dayjs from 'dayjs'

// meiliNG oAuth2 integration code.
// proudly taken from @Stella-IT

export default {
  getClientId () {
    return '084760e3-d31e-422c-86af-b398e142c923'
  },
  getMeilingHost () {
    return 'https://meiling.dev.alex4386.me'
  },
  getScopes () {
    return [
      'openid'
    ]
  },
  getSignInURI ({ selectAccount = false, queryString = {}, origin }) {
    const clientId = this.getClientId()

    const codeVerifier = this.makeRandom(10)
    const codeChallenge = this.sha256(codeVerifier)
    localStorage.setItem('oAuth2.codeVerifier', codeVerifier)

    const state = { verifier: this.makeRandom(10), query: queryString }
    localStorage.setItem('oAuth2.stateVerifier', state.verifier)

    const getData = {
      client_id: clientId,
      response_type: 'code',
      redirect_uri: (origin || location.origin) + '/auth/callback',
      scope: this.getScopes().join(' '),
      state: JSON.stringify(state),
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      prompt: selectAccount ? 'select_account' : ''
    }

    return `${this.getMeilingHost()}/v1/oauth2/auth${this.generateGetVariables(getData)}`
  },
  signOut () {
    localStorage.removeItem('oAuth2.accessToken')
    localStorage.removeItem('oAuth2.refreshToken')
  },
  signinCleanup () {
    localStorage.removeItem('oAuth2.codeVerifier')
    localStorage.removeItem('oAuth2.stateVerifier')
  },
  async signinCallback (query) {
    const { code, state } = query
    const codeVerifier = localStorage.getItem('oAuth2.codeVerifier')
    const stateVerifier = localStorage.getItem('oAuth2.stateVerifier')

    try {
      const stateParsed = JSON.parse(state)

      if (stateVerifier !== stateParsed.verifier) {
        throw new Error('STATE_VERIFIER_MISMATCH')
      }

      if (!code || !codeVerifier) {
        throw new Error('CODE_MISSING')
      }

      const queryData = {
        client_id: this.getClientId(),
        grant_type: 'authorization_code',
        code,
        code_verifier: codeVerifier
      }

      const data = (await axios.post(`${this.getMeilingHost()}/v1/oauth2/token`, queryData)).data

      localStorage.setItem('oAuth2.idToken', data.id_token)
      localStorage.setItem('oAuth2.accessToken', data.access_token)
      localStorage.setItem('oAuth2.refreshToken', data.refresh_token)
      localStorage.setItem('oAuth2.accessToken.lastUpdate', dayjs())

      // 토큰 정상 여부 체크 하는 법.
      await axios.post(this.getMeilingHost() + '/v1/oauth2/tokeninfo',
        {
          access_token: data.access_token
        }
      )

      this.signinCleanup()

      if (state.query && state.query.redirect_uri) {
        location.href = state.query.redirect_uri
        return true
      }

      return false
    } catch (e) {
      console.error(e)
      alert('meiliNG login error:\n' + e)

      throw e
    }
  },
  generateGetVariables (data) {
    let str = ''
    for (const name in data) {
      str += `&${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`
    }
    str = str.replace(/^&/g, '?')
    return str
  },
  makeRandom (i) {
    return Math.random().toString(8)
  },
  sha256 (s) {
    return crypto.createHash('sha256').update(s).digest('base64')
  },
  async getAccessToken () {
    const clientId = this.getClientId()
    let localToken = localStorage.getItem('oAuth2.accessToken')
    if (localToken) {
      try {
        const lastUpdate = localStorage.getItem('oAuth2.accessToken.lastUpdate')
        if (!lastUpdate || dayjs().diff(dayjs(lastUpdate), 'minute') > 3) {
          const result = await axios.post(this.getMeilingHost() + '/v1/oauth2/tokeninfo', { access_token: localToken })

          localStorage.setItem('oAuth2.accessToken.lastUpdate', dayjs())
          console.debug('Token status:', result.data)

          if (!result.data.scope.split(' ').includes('name')) {
            console.log('required parameters were not found. requesting auth again.')
            await this.signIn({ queryString: { redirect_uri: location.href } })
            return false
          }
        }
        return localToken
      } catch (err) {
        console.log(err)
        let localRefreshToken = localStorage.getItem('oAuth2.refreshToken')
        if (localRefreshToken !== null) {
          console.warn('Token expired. Reissuing with refreshToken')
          try {
            const data = await axios.post(this.getMeilingHost() + '/v1/oauth2/token', {
              client_id: clientId,
              grant_type: 'refresh_token',
              refresh_token: localRefreshToken
            })

            localToken = data.data.access_token
            localRefreshToken = (data.data.refresh_token) ? data.data.refresh_token : localRefreshToken

            console.log('New Token Issued.')
            console.log('accessToken:', localToken)
            console.log('refreshToken:', localRefreshToken)

            localStorage.setItem('oAuth2.accessToken', localToken)
            localStorage.setItem('oAuth2.refreshToken', localRefreshToken)

            return localToken
          } catch (e) {
            console.error('토큰 갱신에 실패했습니다. 리프레시 토큰 또한 만료된 것 같습니다.', e, e.response.data)
          }
        } else {
          console.error('리프레시 토큰을 찾을 수 없었습니다!')
        }
      }
    }
    await this.signIn({ queryString: { redirect_uri: location.href } })
    return undefined
  }
}
