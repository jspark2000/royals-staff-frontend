// Composables
import { useAuthStore } from "@/common/store/auth";
import { createRouter, createWebHistory } from "vue-router";
import DefaultView from "@/layouts/default/Default.vue";
import LandingView from "@/views/index.vue";
import LoginView from "@/views/login.vue";
import CallbackView from "@/views/auth/index.vue";
import RecruitingView from "@/views/recruiting/index.vue";
import FBTIView from "@/views/recruiting/fbti/index.vue";
import Swal from "sweetalert2";

const routes = [
  {
    path: "/",
    component: DefaultView,
    children: [
      {
        path: "/",
        name: "landingPage",
        component: LandingView,
        meta: {
          roles: ["Public", "Newbie", "Normal", "Admin", "SuperAdmin"],
        },
      },
      {
        path: "/login",
        name: "loginPage",
        component: LoginView,
        meta: {
          roles: ["Public", "Newbie", "Normal", "Admin", "SuperAdmin"],
        },
      },
      {
        path: "/login/callback",
        name: "callbackPage",
        component: CallbackView,
        meta: {
          roles: ["Public", "Newbie", "Normal", "Admin", "SuperAdmin"],
        },
      },
      {
        path: "/recruiting",
        name: "recruitingPage",
        component: RecruitingView,
        meta: {
          roles: ["Public", "Newbie", "Normal", "Admin", "SuperAdmin"],
        },
      },
      {
        path: "/recruiting/fbti",
        name: "FBTIPage",
        component: FBTIView,
        meta: {
          roles: ["Public", "Newbie", "Normal", "Admin", "SuperAdmin"],
        },
      },
    ],
  },
  {
    path: "/home",
    component: () => import("@/layouts/console/Default.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          roles: ["Newbie", "Normal", "Admin", "SuperAdmin"],
        },
      },
    ],
  },
  {
    path: "/people",
    component: () => import("@/layouts/console/Default.vue"),
    children: [
      {
        path: "list",
        name: "people-list",
        component: () => import("@/views/people/list/index.vue"),
        meta: {
          roles: ["Newbie", "Normal", "Admin", "SuperAdmin"],
        },
      },
      {
        path: "register",
        name: "people-register",
        component: () => import("@/views/people/register/index.vue"),
        meta: {
          roles: ["Admin", "SuperAdmin"],
        },
      },
      {
        path: "delete",
        name: "people-delete",
        component: () => import("@/views/people/delete/index.vue"),
        meta: {
          roles: ["Admin", "SuperAdmin"],
        },
      },
      {
        path: "update",
        name: "attendance-update",
        component: () => import("@/views/people/update/index.vue"),
        meta: {
          roles: ["Admin", "SuperAdmin"],
        },
      },
    ],
  },
  {
    path: "/attendance",
    component: () => import("@/layouts/console/Default.vue"),
    children: [
      {
        path: "list",
        name: "attendance-list",
        component: () => import("@/views/attendance/list/index.vue"),
        meta: {
          roles: ["Newbie", "Normal", "Admin", "SuperAdmin"],
        },
      },
      {
        path: "check",
        name: "attendance-check",
        component: () => import("@/views/attendance/check/index.vue"),
        meta: {
          roles: ["Normal", "Admin", "SuperAdmin"],
        },
      },
      {
        path: "register",
        name: "attendance-register",
        component: () => import("@/views/attendance/register/index.vue"),
        meta: {
          roles: ["Admin", "SuperAdmin"],
        },
      },
      {
        path: "delete",
        name: "attendance-delete",
        component: () => import("@/views/attendance/delete/index.vue"),
        meta: {
          roles: ["Admin", "SuperAdmin"],
        },
      },
    ],
  },
  {
    path: "/game",
    component: () => import("@/layouts/console/Default.vue"),
    children: [
      {
        path: "list",
        name: "game-list",
        component: () => import("@/views/game/list/index.vue"),
        meta: {
          roles: ["Newbie", "Normal", "Admin", "SuperAdmin"],
        },
      },
      {
        path: "register",
        name: "game-register",
        component: () => import("@/views/game/register/index.vue"),
        meta: {
          roles: ["Admin", "SuperAdmin"],
        },
      },
    ],
  },
  {
    path: "/role",
    component: () => import("@/layouts/console/Default.vue"),
    children: [
      {
        path: "update",
        name: "role-update",
        component: () => import("@/views/role/index.vue"),
        meta: {
          roles: ["Admin", "SuperAdmin"],
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const roleStatus = await useAuthStore().getRole();
  // @ts-ignore
  if (to.meta.roles && !to.meta.roles.includes(roleStatus)) {
    if (!useAuthStore().isLoggedIn) {
      Swal.fire({
        title: "ERROR",
        text: "로그인 정보가 만료되었습니다.",
        icon: "error",
      });
      next("/");
    } else {
      Swal.fire({
        title: "FORBIDDEN",
        text: "접근 권한이 없습니다.",
        icon: "warning",
      });
      next(from);
    }
  } else {
    next();
  }
});

export default router;
