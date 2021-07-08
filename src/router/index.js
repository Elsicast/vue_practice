import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import exe from '../components/exe.vue'
import exp1 from '../components/exps/exp1.vue'
import exp2 from '../components/exps/exp2.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/exe',
    component: exe,
    children: [
      { path: '/exp1', component: exp1 },
      { path: '/exp2', component: exp2 }
    ]
  },
  { path: '/login', component: Login },
  { path: '/', redirect: '/exp1' },

  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: users }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  // console.log(to)
  window.sessionStorage.setItem('activePath', to.path)
  next()
})
export default router
