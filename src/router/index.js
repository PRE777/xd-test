import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import { cancelArr } from "../network/http";

Vue.use(Router);

const routes = [{
        path: "/",
        name: "Home",
        component: Home,
        redirect: '/importData',
        children: [{
                path: "/importData",
                name: "ImportData",
                component: () =>
                    import ("../components/ImportData.vue")
            },
            {
                path: "/dataQuery",
                name: "DataQuery",
                component: () =>
                    import ("../components/DataQuery.vue")
            },
            {
                path: "/resouceDistribute",
                name: "ResouceDistribute",
                component: () =>
                    import ("../components/ResouceDistribute.vue")
            },
            {
                path: "/resouceStatistics",
                name: "ResouceStatistics",
                component: () =>
                    import ("../components/ResouceStatistics.vue")
            },
            {
                path: "/dataRelevance",
                name: "DataRelevance",
                component: () =>
                    import ("../components/DataRelevance.vue")
            }

        ]
    },
    {
        path: "/about",
        name: "About",
        component: () =>
            import ("../views/About.vue")
    }
];

const router = new Router({
    mode: "hash",
    base: process.env.BASE_URL,
    routes
});
router.beforeEach((to, from, next) => {
    // if (cancelArr.length > 0) {
    //     cancelArr.forEach((ele, index) => {
    //         ele.cancel()
    //         cancelArr.splice(index, 1)
    //     });
    // }

    next()
});
export default router;