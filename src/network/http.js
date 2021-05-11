import Qs from 'qs'
import axios from 'axios'
import { baseUrl } from "./env.js";
import {
    Message,
    Loading
} from 'element-ui';
let loading;
export var cancelArr = [];
// 用于取消请求
const CANCEL_TOKEN = axios.CancelToken;

//填写域名
axios.defaults.baseURL = baseUrl;

axios.defaults.timeout = 300000;

// axios.cancelToken = new axios.CancelToken(cancel => {
//     debugger
//     cancelArr.push({ cancel })
// });
// 允许携带cookie
// axios.defaults.withCredentials = true;

//http request 请求拦截器
axios.interceptors.request.use(
    config => {
        // startLoading();
        config.headers["Content-Type"] = 'application/x-www-form-urlencoded;multipart/form-data';
        config.data = Qs.stringify(config.data);
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器即异常处理  
axios.interceptors.response.use(response => {
    // endLoading();
    let status = response.data.server_status;

    if (status && status != 200) {
        Message({
            message: response.data.server_error,
            type: 'error',
            duration: 3 * 1000
        })
    }
    return response
}, err => {
    // 利用loading的单例属性关闭loading
    // endLoading();
    console.log("请求错误=====", err);
    if (!err) {
        Message({
            message: "连接错误",
            type: 'error',
            duration: 3 * 1000
        })
        return
    }

    if (err.hasOwnProperty('response') && typeof err.response != 'undefined') {
        Message({
            message: `错误码${err.response.status}， ${err.response.data.message}`,
            type: 'error',
            duration: 3 * 1000
        })
    } else {
        Message({
            message: err,
            type: 'error',
            duration: 3 * 1000
        })
    }
    return Promise.reject(err.response)
})


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            })
            .then(response => {
                if (response != undefined && response.data != undefined) {
                    resolve(response.data);
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

export function get(url, params = {}, ) {
    return new Promise((resolve, reject) => {
        axios(url, {
                params
            })
            .then(response => {
                console.log("response=", response)
                resolve(response.data);
            })
            .catch(err => {
                reject(err)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data, {
            // cancelToken: new CANCEL_TOKEN(function(c) {
            //     let cancel = c;
            //     cancelArr.push({ cancel });
            // })
        }).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function deleteMethod(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {response}
 */

export function downLoad(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios({
                method: 'post',
                url: url, // 请求地址
                data: data, // 参数
                responseType: 'blob' // 表明返回服务器返回的数据类型
            })
            .then(response => {
                resolve(response);
            }, err => {
                reject(err)
            })
    })
}

function startLoading() {
    loading = Loading.service({
        background: "rgba(0, 0, 0, 0.4)",
        fullscreen: true,
        lock: true,
    });
}

function endLoading() {
    loading.close()
}