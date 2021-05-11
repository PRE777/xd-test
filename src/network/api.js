import {
    post,
    get,
    fetch,
    downLoad
} from './http.js'

import {
    baseUrl
} from "./env.js";
let api = baseUrl

let ky = ''

if (api == "http://localhost:8080") {
    ky = '/api'
}

console.log(api)
    /** 
     * getSituationInfor
     * 参数：params
     * 方式：fetch/post
     */
export const server = {

    /**
     * 数据导入
     */
    importData(paramObj) {
        return post("data/datamanage/import/importData", paramObj)
    },
    /**
     * 数据展示
     */
    importDataShow(paramObj) {
        return post("data/datamanage/import/showData", paramObj)
    },
    /**
     * 
     * 根据屏幕范围画网格
     */
    getGridInfoOnMap(paramObj) {
        return fetch("grid/draw_grid_on_map", paramObj)
    },
    /**
     * 根据经纬度高获取网格信息
     */
    showSignalPointGrid(paramObj) {
        return fetch("grid/show_point", paramObj)
    },

    /**
     * 展示多边形网格
     */
    showPolygonGrid(paramObj) {
        return fetch("grid/show_polygon", paramObj)
    },

    /**
     * 展示圆的网格
     */
    //  
    showCircleGrids(paramObj) {
        return fetch("grid/point_buffer", paramObj)
    },

    /**
     * 根据所画区域查询相关数据
     */
    showDataByGrid(paramObj) {
        return post("data/datamanage/import/showDataByGrid", paramObj)
    },
    // 下载
    downloadFile(paramObj) {
        return downLoad("data/datamanage/import/downloadFile", paramObj);
    },
    /**
     * 分类统计
     * @param {*} paramObj 
     * @returns 
     */
    dataCountByClass(paramObj) {
        return post("data/datamanage/import/dataCountByClass", paramObj)
    },
    /**
     * 分时统计
     * @param {*} paramObj 
     * @returns 
     */
    dataCountByTime(paramObj) {
        return post("data/datamanage/import/dataCountByTime", paramObj)
    },
    /**
     * 数据资源分布
     * @param {*} paramObj 
     * @returns 
     */
    dresourceDistriBution(paramObj) {
        return post("data/datamanage/import/dresourceDistriBution", paramObj)
    },
    /**
     * 更新监视
     * @param {*} paramObj 
     * @returns 
     */
    updateMonitor(paramObj) {
        return post("data/datamanage/import/updateMonitor", paramObj)
    },
    /**
     * 关联整合
     * @param {*} paramObj 
     * @returns 
     */
    relevanceQuery(paramObj) {
        return post("data/datamanage/import/relevanceQuery", paramObj)
    },


}