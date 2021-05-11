let Cesium = require('cesium/Cesium');

import { CesiumTooltip } from "../tool/CesiumTooltip";
import { getLevelForHeight } from "../tool/Public";
import { drawGrids, clear_polygon_grids } from "./DrawGrids";
import { server } from "../../../network/api";
import Bus from "../tool/bus";
let mouseHandlerDraw;
let centerPosition; // 圆心位置
let circle; // 所画的圆形
let centerPointer; // 圆心
let isFinished = false;
export function drawCircle(val) {
    let viewer = val;
    let cartesian = null;
    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;

    if (!mouseHandlerDraw) {
        mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }
    mouseHandlerDraw.setInputAction(function(movement) {
        cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
        if (cartesian) {
            isFinished = false;
            if (CesiumTooltip) {
                CesiumTooltip.setVisible(false);
                // CesiumTooltip.cancal();
            }
            removeCircle(viewer);
            centerPosition = cartesian;
            if (!centerPointer) {
                centerPointer = drawfloatingPoint(viewer, centerPosition);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    let updateCircle = throttle(updateCircleProperty, 100);
    mouseHandlerDraw.setInputAction(function(movement) {
        if (isFinished) {
            // 已经结束绘制
            return;
        }
        if (!centerPosition) {
            return;
        }

        CesiumTooltip.initTool(viewer);
        var position = movement.endPosition;
        if (position != null) {

            var cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
            if (cartesian) {
                cartesian.y += (1 + Math.random());
                let distance = getSpaceDistance([centerPosition, cartesian]);
                CesiumTooltip.showAt(position, `${distance.textDistance}\n点击右键结束`);
                if (circle) {
                    updateCircle(distance.numDistance);
                } else {
                    createCircleEntity(viewer, 200000);
                }
            }
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    mouseHandlerDraw.setInputAction(function(movement) {
        var position = movement.position;
        if (position != null) {
            let cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
            if (cartesian) {
                isFinished = true;
                if (mouseHandlerDraw) {
                    mouseHandlerDraw.destroy();
                    mouseHandlerDraw = null;
                }
                drawCircle(viewer);
                // 请求圆所在的网格数据
                requestCircleGrids(viewer);
            }
        }

    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
// 创建圆形
function createCircleEntity(viewer, radius) {
    circle = viewer.entities.add({
        position: centerPosition,
        name: "Green circle at height with outline",
        ellipse: {
            semiMinorAxis: radius,
            semiMajorAxis: radius,
            height: 0,
            material: Cesium.Color.GREEN.withAlpha(0),
            outline: true, // height must be set for outline to display
            outlineColor: Cesium.Color.RED,
            outlineWidth: 5,
        },
    });
}

// 修改圆形的参数
function updateCircleProperty(radius) {
    circle.ellipse.semiMajorAxis.setValue(radius);
    circle.ellipse.semiMinorAxis.setValue(radius);
}

//空间两点距离计算函数
function getSpaceDistance(positions) {
    var distance = 0;
    for (var i = 0; i < positions.length - 1; i++) {

        var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
        var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        distance = distance + s;
    }
    var textDistance = distance > 1000 ? (distance / 1000).toFixed(2) + 'km' : distance.toFixed(2) + 'm';;

    return { textDistance: textDistance, numDistance: distance };
}
// 画点并标注距离
function drawfloatingPoint(viewer, position, text) {
    let floatingPoint = viewer.entities.add({
        name: '空间两点间直线距离',
        position: position,
        point: {
            pixelSize: 5,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.NONE
        },
        // label: {
        //     text: text,
        //     font: '18px sans-serif',
        //     fillColor: Cesium.Color.GOLD,
        //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //     outlineWidth: 2,
        //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //     pixelOffset: new Cesium.Cartesian2(20, -20),
        //     heightReference: Cesium.HeightReference.NONE
        // }
    });
    return floatingPoint;
}
// 销毁所画的圆以及网格、手势
export function clearCircle(viewer) {
    removeCircle(viewer);
    if (CesiumTooltip) {
        CesiumTooltip.setVisible(false);
        // CesiumTooltip.cancal();
    }
    if (mouseHandlerDraw) {
        mouseHandlerDraw.destroy();
        mouseHandlerDraw = null;
    }

}
// 移除所画圆圆及其圆心
function removeCircle(viewer) {
    if (centerPointer) {
        viewer.entities.remove(centerPointer);
        centerPointer = null;
    }
    if (circle) {
        viewer.entities.remove(circle);
        circle = null;
    }
    clear_polygon_grids(viewer);
}

//  节流装饰者
function throttle(f, ms) {
    let isThrottled = false, // 冷却状态
        savedArgs,
        savedThis;
    return function wrapper() {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }
        f.apply(this, arguments);
        isThrottled = true;
        setTimeout(function() {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }
}

// 请求圆所在的网格
function requestCircleGrids(viewer) {
    let geolevel = getLevelForHeight(viewer.camera.positionCartographic.height);
    let radius = circle.ellipse.semiMajorAxis._value;
    let position = centerPointer.position._value;
    //将弧度转为度的十进制度表示
    var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(position);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let param = {
        lng: lng,
        lat: lat,
        scope: radius,
        geo_level: geolevel
    }
    server.showCircleGrids(param).then(response => {
        if (response.server_status == 200) {
            let data = response.geo_num_list;
            createGeojson(data, geolevel);
            drawGrids(viewer, data);
        }
    });
}

function createGeojson(data, geolevel) {
    let wgs84_positions = [];

    for (const point of data) {
        let minlng = point.lbLng;
        let minlat = point.lbLat
        let maxlng = point.rtLng;
        let maxlat = point.rtLat;
        let coordinate = [
            [
                [minlng, maxlat],
                [minlng, minlat],
                [maxlng, minlat],
                [maxlng, maxlat],
                [minlng, maxlat],
            ]
        ];
        wgs84_positions.push(coordinate);
    }
    let geo_json = {
        "type": "MultiPolygon",
        "coordinates": wgs84_positions
    };
    let param = {
        geoLevel: geolevel,
        geo_json: JSON.stringify(geo_json)
    };
    Bus.$emit("reloadTable", param);
}