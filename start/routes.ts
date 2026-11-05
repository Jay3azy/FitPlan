/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')

router
  .group(() => {
    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.on('/dashboard').render('pages/dashboard').as('dashboard')
    router.post('logout', [controllers.Session, 'destroy'])

    router
      .group(() => {
        router
          .resource('usuarios', () => import('#controllers/admin/users_controller'))
          .as('admin.users', false)
          .except(['show'])

        router
          .resource('categorias-alimentos', () => import('#controllers/admin/food_categories_controller'))
          .as('admin.food_categories', false)
          .except(['show'])

        router
          .resource('objetivos', () => import('#controllers/admin/objectives_controller'))
          .as('admin.objectives', false)
          .except(['show'])

        router
          .resource('condiciones', () => import('#controllers/admin/conditions_controller'))
          .as('admin.conditions', false)
          .except(['show'])

        router
          .resource('alergias', () => import('#controllers/admin/allergies_controller'))
          .as('admin.allergies', false)
          .except(['show'])

        router
          .resource('alimentos', () => import('#controllers/admin/foods_controller'))
          .as('admin.foods', false)
          .except(['show'])
      })
      .prefix('/admin')
      .use(middleware.adminOnly())
  })
  .use(middleware.auth())
