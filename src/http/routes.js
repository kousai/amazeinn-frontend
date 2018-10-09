/**
 * Every route becomes a chunk, loaded only when used.
 * Reduces size of initial App load.
 */
const routes = [
  {
    name: 'entrance',
    path: '/entrance',
    component: () => import(/* webpackChunkName: "entrance" */ '@/features/entrance/main.vue'),
    title: 'Entrance',
    layout: 'PublicLayout',
    isPublic: true
  },
  {
    name: 'account',
    path: '/account',
    component: () => import(/* webpackChunkName: "account" */ '@/features/account/main.vue'),
    title: 'Account',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    name: 'home',
    path: '/',
    component: () => import(/* webpackChunkName: "porch" */ '@/features/porch/main.vue'),
    title: 'Porch',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    name: 'porch',
    path: '/porch',
    component: () => import(/* webpackChunkName: "porch" */ '@/features/porch/main.vue'),
    title: 'Porch',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    name: 'lounge',
    path: '/lounge',
    component: () => import(/* webpackChunkName: "lounge" */ '@/features/lounge/main.vue'),
    title: 'Lounge',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    name: 'profile',
    path: '/profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/features/profile/main.vue'),
    title: 'Profile',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    name: 'contacts',
    path: '/contacts',
    component: () => import(/* webpackChunkName: "contacts" */ '@/features/contacts/main.vue'),
    title: 'Contacts',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    name: 'messages',
    path: '/messages',
    component: () => import(/* webpackChunkName: "messages" */ '@/features/messages/main.vue'),
    title: 'Messages',
    layout: 'DefaultLayout',
    isPublic: false
  },
  {
    name: 'support',
    path: '/support',
    component: () => import(/* webpackChunkName: "support" */ '@/features/support/main.vue'),
    title: 'Support',
    layout: 'DefaultLayout',
    isPublic: false
  }
]

export default routes
