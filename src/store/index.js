import Vue from 'vue'
import Vuex from "vuex";
Vue.use(Vuex);
const dataType = {
    namespaced: true, // 避免存在相同属性
    state: {
        data: [],
    },
    getters: {
        getData(state) {
            return state.data;
        }
    },
    mutations: {
        setData(state, newVal) {
            state.data = newVal;
        }
    },
    actions: {
        /**
         * 
         * @param {*} context 
         * @param {*} newVal 新值
         * @param {string} funName mutations中的函数名，例如:setData
         * 用法 this.$store.dispatch("dataType/changeStateFun",{newVal:data,funName:"setData"});
         */
        changeStateFun(context, { newVal, funName }) {
            context.commit(funName, newVal);
        }
    }
    // this.$store.getters['dataType/getData']
};



export default new Vuex.Store({
    modules: {
        dataType
    },
    // state,
    // getters,
    // mutations,
    // actions
});
/**
 * 用法
 * this.$store.getters['login/getLoginState']; // 取值
 * this.$store.getters['getLoginState']; // 取值
 * this.$store.dispatch('login/changeStateFun',true);// 赋值 
 * this.$store.dispatch("displayMode/changeStateFun",{newVal:year,funName:"setYear"});
 */