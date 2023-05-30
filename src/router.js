import Vue from "vue";
import Router from "vue-router";

import { checkRole, getRoles } from "./services/auth";

import AuthLayout from "@/layout/AuthLayout";
import PublicLayout from "@/layout/public/DashboardLayout";

Vue.use(Router);

const router = new Router({
  linkExactActiveClass: "active",
  mode: "history",
  routes: [
    /* base routes */
    {
      path: "/",
      redirect: "login",
      component: AuthLayout,
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("./views/Login.vue")
        },
        {
          path: "register",
          name: "register",
          component: () => import("./views/Register.vue")
        }
      ]
    },
    /* admin routes */
    {
      path: "/administrador",
      redirect: { name: "admin_template_list" },
      component: () => import("@/layout/admin/DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (!checkRole("admin")) next("/login");
        else next();
      },
      children: [
        {
          path: "/",
          alias: "admin_template_list",
          name: "admin_template_list",
          meta: { title: "Listagem de templates" },
          component: () => import("./views/Admin/Templates.vue")
        },
        {
          path: "templates/novo",
          alias: "admin_new_template",
          name: "admin_new_template",
          meta: { title: "cadastrar template" },
          component: () => import("./views/Admin/Template/TemplateForm.vue")
        },
        {
          path: "templates/:id/editar",
          alias: "admin_edit_template",
          name: "admin_edit_template",
          meta: { title: "editar template" },
          component: () => import("./views/Admin/Template/TemplateEdit.vue")
        }
      ]
    },
    {
      path: "/cliente",
      redirect: { name: "client_subscription_list" },
      component: () => import("@/layout/client/DashboardLayout"),
      beforeEnter: (to, from, next) => {
        if (!checkRole("client")) next("/login");
        else next();
      },
      children: [
        {
          path: "/",
          alias: "client_subscription_list",
          name: "client_subscription_list",
          meta: { title: "Listagem de inscrições" },
          component: () => import("./views/Client/Inscricoes.vue")
        },
        {
          path: "inscricoes/novo",
          alias: "client_new_subscription",
          name: "client_new_subscription",
          meta: { title: "cadastrar inscrição" },
          component: () => import("./views/Client/Inscricao/InscricaoForm.vue")
        },
        {
          path: "inscricoes/:id/editar",
          alias: "client_edit_subscription",
          name: "client_edit_subscription",
          meta: { title: "editar inscrição" },
          component: () => import("./views/Client/Inscricao/InscricaoEdit.vue")
        }
      ]
    },

    /* fallback route (404) */
    { path: "*", redirect: "/" }
  ]
});

router.beforeEach((to, from, next) => {
  const toBaseRoute = ["/", "/login"].includes(to.fullPath);

  const roles = getRoles();
  if (roles) {
    const rolesArray = JSON.parse(roles);
    // if (
    //   rolesArray.length > 1 &&
    //   (from.path !== "/" || !to.fullPath.includes("/avisos"))
    // ) {
    //   const map = {
    //     teacher: "/professor/avisos",
    //     volunteer: "/voluntario/avisos"
    //   };
    //   next(map[rolesArray[0]]);
    //   return;
    // }
  }

  // if user is trying to access the login/register page
  if (toBaseRoute) {
    // if user is authenticated redirect to his respective panel (based on user role)
    if (checkRole("admin")) next("/administrador");
    else if (checkRole("client")) next("/cliente");
    else next();
  }
  // go to next route (will check user role in beforeRoute)
  else next();
});

export default router;
