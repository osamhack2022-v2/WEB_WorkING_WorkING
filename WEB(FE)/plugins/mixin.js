import Vue from 'vue'
import Meiling from '~/plugins/meiling'

const methods = {
  getProductName () {
    return 'workING'
  },
  signOut () {
    location.href = '/'
  },
  async signIn (options) {
    location.href = Meiling.getSignInURI(options)
    await new Promise(() => {})
  },
  async signInCallback () {
    const redirected = await Meiling.signinCallback(this.$route.query)
    if (!redirected) { this.$router.push('/') }
  },
  async getAccessToken () {
    return await Meiling.getAccessToken()
  }

}

Vue.mixin({
  methods
})

export default methods
