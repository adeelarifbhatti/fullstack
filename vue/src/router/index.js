import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import NotFound from '../views/NotFound.vue'
import Courses from '../views/courses/courses.vue'
import CDetails from '../views/courses/cdetails.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About

  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses
  },
  {
    path: '/courses/:id',
    name: 'cdetails',
    component: CDetails,
    props: true
  },
  //redirect
  {
    path: '/all-courses',
    redirect: '/courses'
  },
  //catchall 404
  {
  path: '/:catchAll(.*)',
  name: 'NotFound',
  component: NotFound
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
