// Composables
import { useAuthStore } from "@/common/store/auth";
import { createRouter, createWebHistory } from "vue-router";
import DefaultView from "@/layouts/default/Default.vue";
import LandingView from "@/views/index.vue";
import LoginView from "@/views/login.vue";
import CallbackView from "@/views/auth/index.vue";
import RecruitingView from "@/views/recruiting/index.vue";
import FBTIView from "@/views/recruiting/fbti/index.vue";

const routes = [
  {
    path: "/",
    component: DefaultView,
    children: [
      {
        path: "/",
        name: "landingPage",
        component: LandingView,
      },
      {
        path: "/login",
        name: "loginPage",
        component: LoginView,
      },
      {
        path: "/login/callback",
        name: "callbackPage",
        component: CallbackView,
      },
      {
        path: "/recruiting",
        name: "recruitingPage",
        component: RecruitingView,
      },
      {
        path: "/recruiting/fbti",
        name: "FBTIPage",
        component: FBTIView,
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
      },
      {
        path: "register",
        name: "people-register",
        component: () => import("@/views/people/register/index.vue"),
      },
      {
        path: "delete",
        name: "people-delete",
        component: () => import("@/views/people/delete/index.vue"),
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
      },
      {
        path: "check",
        name: "attendance-check",
        component: () => import("@/views/attendance/check/index.vue"),
      },
      {
        path: "register",
        name: "attendance-register",
        component: () => import("@/views/attendance/register/index.vue"),
      },
      {
        path: "delete",
        name: "attendance-delete",
        component: () => import("@/views/attendance/delete/index.vue"),
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
      },
      {
        path: "register",
        name: "game-register",
        component: () => import("@/views/game/register/index.vue"),
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
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const publicPages = [
    "/",
    "/login",
    "/login/callback",
    "/recruiting",
    "/recruiting/fbti",
  ];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.isLoggedIn) {
    return "/";
  }
});

export default router;
