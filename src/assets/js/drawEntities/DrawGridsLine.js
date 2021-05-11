// import Cesium from 'cesium/Cesium'
var Cesium = require('cesium/Cesium');
import { getVisibleRegion, calculateMapLevel, getLevelForHeight } from "../tool/Public";
import { Message } from 'element-ui';
import { server } from "../../../network/api";
var maxLng = 0.0;
var minLng = 0.0;
var maxLat = 0.0;
var minLat = 0.0;

var global_grid_primitives; // 网格

let gridLineColor = new Cesium.ColorGeometryInstanceAttribute(150 / 255, 150 / 255, 150 / 255, 0.2); // 网格线颜色

var mapViewer;

//画网格线，用长条矩形拼接起来的网格线背景。
//为什么不直接用PolylineGeometry画线呢，因为纬度跨度大的时候不是直线，是弧形的。
export function drawGrid(val) {
    if (val) {
        mapViewer = val;
    }
    let viewer = mapViewer;
    if (global_grid_primitives) {
        global_grid_primitives.removeAll();
        global_grid_primitives = null;
    }

    if (!global_grid_primitives) {
        global_grid_primitives = new Cesium.PrimitiveCollection()
        viewer.scene.primitives.add(global_grid_primitives)
    }
    var extent = getVisibleRegion(viewer);
    if (extent.xmin == undefined || extent.xmin == -180) {
        extent.xmin = -179;
    }
    if (extent.xmax == undefined || extent.xmax == 180) {
        extent.xmax = 179;
    }
    if (extent.ymin == undefined || extent.ymin == -90) {
        extent.ymin = -89;
    }
    if (extent.ymax == undefined || extent.ymax == 90) {
        extent.ymax = 89;
    }
    minLng = extent.xmin;
    maxLng = extent.xmax;
    minLat = extent.ymin;
    maxLat = extent.ymax;
    let height = extent.height;
    let geoLevel = getLevelForHeight(height);
    var data = { "geoLevel": geoLevel, "lbLng": extent.xmin, "lbLat": extent.ymin, "rtLng": extent.xmax, "rtLat": extent.ymax };

    server.getGridInfoOnMap(data).then(response => {
        if (response.server_status == 200) {
            let lons = response.geo_num_list.lons;
            let lats = response.geo_num_list.lats;
            drawLngLatLines(viewer, lons, lats);
        } else {
            Message.error('获取网格经纬度失败');
        }
    });
}

//不显示网格（移除网格）
export function cancelDrawGrid(viewer) {
    // 移除对屏幕范围的监听
    viewer.scene.camera.moveEnd.removeEventListener(drawGrid);
    // 移除创建的网格对象
    global_grid_primitives.removeAll();
}

// 监听屏幕是否移动（监听屏幕范围）
export function observeSceen(viewer) {
    drawGrid(viewer);
    // 屏幕移动触发 drawGrid 方法
    viewer.scene.camera.moveEnd.addEventListener(drawGrid);
}

function drawLngLatLines(viewer, lngs, lats) {
    // 移除创建的网格对象
    global_grid_primitives.removeAll();
    if (lngs == undefined || lats == undefined) {
        return;
    }
    var instanceOutLines = []; //画网格线

    if (viewer.scene.mode == Cesium.SceneMode.SCENE3D) {
        // console.log("begin draw " + new Date().getTime())
        for (let i = 0; i < lngs.length - 1; i = i + 1) {
            for (let j = 0; j < lats.length - 1; j = j + 1) {

                var outlineGeometry = Cesium.PolygonOutlineGeometry.fromPositions({
                    positions: Cesium.Cartesian3.fromDegreesArray([
                        lngs[i], lats[j],
                        lngs[i], lats[j + 1],
                        lngs[i + 1], lats[j + 1],
                        lngs[i + 1], lats[j]
                    ]),
                    height: 0,
                    extrudedHeight: 0
                });

                var instanceOutLine = new Cesium.GeometryInstance({
                    geometry: outlineGeometry,
                    attributes: {
                        color: gridLineColor
                    }
                });
                instanceOutLines.push(instanceOutLine);
            }
        }

        global_grid_primitives.add(new Cesium.Primitive({
            geometryInstances: Object.freeze(instanceOutLines),
            appearance: new Cesium.PerInstanceColorAppearance({
                flat: true
            }),
            asynchronous: false
        }));
    } else {
        // 经度线
        for (let i = 0; i < lngs.length; i = i + 1) {
            let pArray = [];
            for (let j = 0; j < lats.length; j = j + 2) {
                pArray.push(lngs[i]);
                pArray.push(lats[j]);
            }
            var positions = Cesium.Cartesian3.fromDegreesArray(pArray)
            var polyline = new Cesium.PolylineGeometry({
                positions: positions,
                width: 0.5,
            });

            var instanceOutLine = new Cesium.GeometryInstance({
                geometry: polyline,
                attributes: {
                    color: gridLineColor
                }
            });

            instanceOutLines.push(instanceOutLine);
        }
        // 纬度线
        for (let i = 0; i < lats.length; i = i + 1) {
            let pArray = [];
            for (let j = 0; j < lngs.length; j = j + 2) {
                pArray.push(lngs[j]);
                pArray.push(lats[i]);
            }
            var polyline = new Cesium.PolylineGeometry({
                positions: Cesium.Cartesian3.fromDegreesArray(pArray),
                width: 0.5,
            });

            var instanceOutLine = new Cesium.GeometryInstance({
                geometry: polyline,
                attributes: {
                    color: gridLineColor
                }
            });
            instanceOutLines.push(instanceOutLine);
        }

        // console.log("instanceOutLines = " + instanceOutLines.length);
        global_grid_primitives.add(new Cesium.Primitive({
            geometryInstances: instanceOutLines,
            appearance: new Cesium.PolylineColorAppearance({
                // flat: true
            }),
            zIndex: 100000,
        }));
    }
}