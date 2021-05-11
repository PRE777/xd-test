var Cesium = require('cesium/Cesium');
import { CesiumTooltip } from "./CesiumTooltip";
import {
    DynamicDrawTool
} from "./DynamicDraw";

let mouseHandlerDraw;
let poly;
let tempEntities = [];

let PolylinePrimitive;
let PolygonPrimitive;

export let DrawPolygonEntity = (function() {
    let _ = DynamicDrawTool;
    _.startDrawingPolyshape = startDrawingPolyshape;
    _.startDrawingClear = startDrawingClear;
    _.startDrawingClearTwo = startDrawingClearTwo;
    _.startDrawingMarker = startDrawingMarker;
    _.startDrawingRect = startDrawingRect;
    PolylinePrimitive = _.prototype.polylinePrimitive;
    PolygonPrimitive = _.prototype.polygonPrimitive;
    return _;
})();

/**
 * 
 * @param { cesium viewer } viewer 
 * @param { Bool } isPolygon  true: polyon ,false: polyonline 
 * @param { objc } PolyOption  {width: 3, geodesic: true}
 * @param { function } clearBack  用于删除网格数据回调
 * @param { function } callback  用于结束绘制多边形回调
 */
function startDrawingPolyshape(viewer, isPolygon, PolyOption, clearBack, callback = null) {
    var scene = viewer.scene;
    if (mouseHandlerDraw) {
        mouseHandlerDraw.destroy();
        mouseHandlerDraw = null;
    } else {
        mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    }
    CesiumTooltip.initTool(viewer);
    var minPoints = isPolygon ? 3 : 2;
    var primitives = scene.primitives;
    let ellipsoid = Cesium.Ellipsoid.WGS84;
    var positions = [];
    mouseHandlerDraw.setInputAction(function(movement) {
        if (movement.position != null) {
            var cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
            if (cartesian) {
                if (positions.length == 0) {
                    if (typeof clearBack == 'function') {
                        clearBack(); // 用于清除 网格数据
                    }
                    positions.push(cartesian.clone());
                    // clear_polygrids_Entity();
                    primitives.remove(poly)
                    if (isPolygon) {
                        poly = new PolygonPrimitive(PolyOption);
                    } else {
                        for (const entity of tempEntities) {
                            viewer.entities.remove(entity);
                        }
                        tempEntities = [];
                        poly = new PolylinePrimitive(PolyOption);
                        // let floatingPoint = drawfloatingPoint(viewer, cartesian.clone(), "0.0m");
                        // tempEntities.push(floatingPoint);
                    }
                    poly.asynchronous = false;
                    primitives.add(poly);
                }
                if (positions.length >= minPoints) {
                    poly.positions = positions;
                    poly._createPrimitive = true;
                }
                positions.push(cartesian);

            }
            // if (!isPolygon && positions.length >= 3) {
            //     const text = getSpaceDistance([positions[positions.length - 3], positions[positions.length - 1]]);
            //     let floatingPoint = drawfloatingPoint(viewer, positions[positions.length - 1], text);
            //     tempEntities.push(floatingPoint);
            // }

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    mouseHandlerDraw.setInputAction(function(movement) {
        var position = movement.endPosition;
        if (position != null) {
            if (positions.length == 0) {
                CesiumTooltip.showAt(position, "单击左键添加第一个点");
            } else {
                var cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
                if (cartesian) {
                    positions.pop();
                    // make sure it is slightly different
                    cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                    if (positions.length >= minPoints) {
                        poly.positions = positions;
                        poly._createPrimitive = true;
                    }

                    if (positions.length === 2) {
                        CesiumTooltip.showAt(position, "单击左键添加第二个点");
                    } else {
                        CesiumTooltip.showAt(position, "单击右键绘制结束");
                    }
                    // 画线
                    // CesiumTooltip.showAt(position, getSpaceDistance([positions[positions.length - 2], cartesian]));

                }
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    mouseHandlerDraw.setInputAction(function(movement) {
        var position = movement.position;
        if (position != null) {
            if (positions.length < minPoints) {
                return;
            } else {

                var cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
                if (cartesian) {
                    if (mouseHandlerDraw) {
                        if (!isPolygon) {
                            if (positions.length < 3) {
                                return
                            } else {
                                mouseHandlerDraw.destroy();
                                mouseHandlerDraw = null;
                            }
                        } else {
                            mouseHandlerDraw.destroy();
                            mouseHandlerDraw = null;
                        }
                    }
                    if (CesiumTooltip) {
                        CesiumTooltip.setVisible(false);
                    }
                    if (poly) {
                        // 触发重新画多边形
                        DynamicDrawTool.startDrawingPolyshape(viewer, isPolygon, PolyOption, clearBack, callback);
                        if (!isPolygon) {
                            // 画线 需要做闭合处理， 画面不需要
                            if (positions.length < 3) {
                                return
                            }
                            // 画线
                            // const text = getSpaceDistance([positions[positions.length - 3], positions[positions.length - 1]]);
                            // let floatingPoint = drawfloatingPoint(viewer, positions[positions.length - 1], text);
                            // tempEntities.push(floatingPoint);
                            // 触发重新画多边形
                            // 做闭合处理
                            let firstCartesian = positions[0];
                            positions.push(firstCartesian);
                            poly.setPositions(positions);

                        }
                        if (typeof callback == 'function') {
                            callback(positions);
                        }
                    }
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
/**
 * 清除所画多边形
 * @param {*} viewer 
 * @param {*} isDestroy 
 */
function startDrawingClear(viewer, isDestroy = true) {
    CesiumTooltip.setVisible(!isDestroy);
    viewer.scene.primitives.remove(poly)
    if (isDestroy && mouseHandlerDraw) {
        mouseHandlerDraw.destroy();
        mouseHandlerDraw = null;
    }
    for (const entity of tempEntities) {
        viewer.entities.remove(entity);
    }
    tempEntities = [];
};

function startDrawingClearTwo() {
    CesiumTooltip.setVisible(false);
    if (mouseHandlerDraw) {
        mouseHandlerDraw.destroy();
        mouseHandlerDraw = null;
    }
};

function startDrawingMarker(viewer, msg) {
    var ellipsoid = Cesium.Ellipsoid.WGS84;
    //var _self = this;
    var scene = viewer.scene;
    if (mouseHandlerDraw) {
        mouseHandlerDraw.destroy();
        mouseHandlerDraw = null;
    } else {
        mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    }

    CesiumTooltip.initTool(viewer);

    // Now wait for start
    mouseHandlerDraw.setInputAction(function(movement) {
        if (movement.position != null) {
            var cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
            if (cartesian) {
                // if (typeof callback == 'function') {
                //     callback(cartesian);
                // }
            }
            if (mouseHandlerDraw) {
                mouseHandlerDraw.destroy();
                mouseHandlerDraw = null;
            }
            if (CesiumTooltip) {
                CesiumTooltip.setVisible(false);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    mouseHandlerDraw.setInputAction(function(movement) {
        var position = movement.endPosition;
        if (position != null) {
            var cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
            if (cartesian) {
                CesiumTooltip.showAt(position, msg + "\n位置:" + getDisplayLatLngString(ellipsoid.cartesianToCartographic(cartesian)));
            } else {
                CesiumTooltip.showAt(position, msg);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

};

function getDisplayLatLngString(cartographic, precision) {
    return Cesium.Math.toDegrees(cartographic.longitude).toFixed(precision || 3) + ", " + Cesium.Math.toDegrees(cartographic.latitude).toFixed(precision || 3);
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
    var textDisance = distance > 1000 ? (distance / 1000).toFixed(2) + 'km' : distance.toFixed(2) + 'm';;

    return textDisance;
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




// 画矩形
function startDrawingRect(viewer, isPolygon, PolyOption, clearBack, callback = null) {
    var scene = viewer.scene;
    if (mouseHandlerDraw) {
        mouseHandlerDraw.destroy();
        mouseHandlerDraw = null;
    } else {
        mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    }
    CesiumTooltip.initTool(viewer);
    var minPoints = isPolygon ? 3 : 2;
    var primitives = scene.primitives;
    let ellipsoid = Cesium.Ellipsoid.WGS84;
    var positions = [];
    mouseHandlerDraw.setInputAction(function(movement) {
        if (movement.position != null) {
            var cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
            if (cartesian) {
                if (positions.length == 0) {
                    if (typeof clearBack == 'function') {
                        clearBack(); // 用于清除 网格数据
                    }
                    positions.push(cartesian.clone());
                    primitives.remove(poly)
                    if (isPolygon) {
                        poly = new PolygonPrimitive(PolyOption);
                    } else {
                        for (const entity of tempEntities) {
                            viewer.entities.remove(entity);
                        }
                        tempEntities = [];
                        poly = new PolylinePrimitive(PolyOption);
                        // let floatingPoint = drawfloatingPoint(viewer, cartesian.clone(), "0.0m");
                        // tempEntities.push(floatingPoint);
                    }
                    poly.asynchronous = false;
                    primitives.add(poly);
                }
                if (positions.length >= minPoints) {
                    poly.positions = positions;
                    poly._createPrimitive = true;
                }
                positions.push(cartesian);

            }
            // if (!isPolygon && positions.length >= 3) {
            //     const text = getSpaceDistance([positions[positions.length - 3], positions[positions.length - 1]]);
            //     let floatingPoint = drawfloatingPoint(viewer, positions[positions.length - 1], text);
            //     tempEntities.push(floatingPoint);
            // }

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    mouseHandlerDraw.setInputAction(function(movement) {
        var position = movement.endPosition;
        if (position != null) {
            if (positions.length == 0) {
                CesiumTooltip.showAt(position, "单击左键添加第一个点");
            } else {
                var cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
                if (cartesian) {
                    positions.pop();
                    // make sure it is slightly different
                    cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                    if (positions.length >= minPoints) {
                        poly.positions = positions;
                        poly._createPrimitive = true;
                    }

                    if (positions.length === 2) {
                        CesiumTooltip.showAt(position, "单击左键添加第二个点");
                    } else {
                        CesiumTooltip.showAt(position, "单击右键绘制结束");
                    }
                    // 画线
                    // CesiumTooltip.showAt(position, getSpaceDistance([positions[positions.length - 2], cartesian]));

                }
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    mouseHandlerDraw.setInputAction(function(movement) {
        var position = movement.position;
        if (position != null) {
            if (positions.length < minPoints) {
                return;
            } else {

                var cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
                if (cartesian) {
                    if (mouseHandlerDraw) {
                        if (!isPolygon) {
                            if (positions.length < 3) {
                                return
                            } else {
                                mouseHandlerDraw.destroy();
                                mouseHandlerDraw = null;
                            }
                        } else {
                            mouseHandlerDraw.destroy();
                            mouseHandlerDraw = null;
                        }
                    }
                    if (CesiumTooltip) {
                        CesiumTooltip.setVisible(false);
                    }
                    if (poly) {
                        // 触发重新画多边形
                        DynamicDrawTool.startDrawingPolyshape(viewer, isPolygon, PolyOption, clearBack, callback);
                        if (!isPolygon) {
                            // 画线 需要做闭合处理， 画面不需要
                            if (positions.length < 3) {
                                return
                            }
                            // 画线
                            // const text = getSpaceDistance([positions[positions.length - 3], positions[positions.length - 1]]);
                            // let floatingPoint = drawfloatingPoint(viewer, positions[positions.length - 1], text);
                            // tempEntities.push(floatingPoint);
                            // 触发重新画多边形
                            // 做闭合处理
                            let firstCartesian = positions[0];
                            positions.push(firstCartesian);
                            poly.setPositions(positions);

                        }
                        if (typeof callback == 'function') {
                            callback(positions);
                        }
                    }
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}