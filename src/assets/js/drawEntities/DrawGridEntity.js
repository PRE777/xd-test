var Cesium = require('cesium/Cesium');
import Bus from "../tool/bus";
import { Message } from 'element-ui';
import { DynamicDrawTool, Cartesian3_to_WGS84 } from '../tool/drawTool'
import { getLevelForHeight, calculateMapLevel } from "../tool/Public";
import { CesiumTooltip } from "../tool/CesiumTooltip";
import { server } from "../../../network/api";

var handler;
var singleGrid;
var multiple_grids_entity = null; // 存储多个手选网格
var mouseHandlerDraw;

// 地图上选取单个点 
export function getPosition(val) {
    let viewer = val;
    clearSingleGrid(viewer);
    var scene = viewer.scene;
    //得到当前三维场景的椭球体
    var ellipsoid = scene.globe.ellipsoid;
    var entity = viewer.entities.add({
        label: {
            show: false
        }
    });
    var lng = null;
    var lat = null;
    var height = null;
    var cartesian = null;
    var level = null;
    if (!handler) {
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }
    handler.setInputAction(function(movement) {
        //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
        cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
        if (cartesian) {
            //将笛卡尔坐标转换为地理坐标
            var cartographic = ellipsoid.cartesianToCartographic(cartesian);
            //将弧度转为度的十进制度表示
            lng = Cesium.Math.toDegrees(cartographic.longitude);
            lat = Cesium.Math.toDegrees(cartographic.latitude);
            height = viewer.camera.positionCartographic.height;
            level = getLevelForHeight(height);
            let params = {
                lng: lng,
                lat: lat,
                video_height: height
            };

            // setLoaction(lng, lat, level);
            server.showSignalPointGrid(params).then(response => {
                if (response.server_status == 200) {
                    let data = response.geo_num_list[0];
                    let minlat = data.lbLat;
                    let minlng = data.lbLng;
                    let maxlat = data.rtLat;
                    let maxlng = data.rtLng;
                    let geonum = data.geo_num;
                    drawSingleGrid(viewer, minlng, minlat, maxlng, maxlat, geonum); // 绘制单网格
                    // 请求查询数据接口
                    let geo_json = {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [minlng, maxlat],
                                [minlng, minlat],
                                [maxlng, minlat],
                                [maxlng, maxlat],
                                [minlng, maxlat],
                            ]
                        ]
                    };
                    let geolevel = getLevelForHeight(height);
                    let param = {
                        geoLevel: geolevel,
                        geo_json: JSON.stringify(geo_json)
                    };
                    Bus.$emit("reloadTable", param);
                }
            });
        } else {
            entity.label.show = false;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
// 清除单个网格
export function clearSingleGrid(viewer) {
    if (!handler) {
        return;
    }
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler = null;
    viewer.entities.remove(singleGrid);
    Bus.$emit("singalPopBoxShow", false);
}

// 绘制单网格
function drawSingleGrid(viewer, minlng, minlat, maxlng, maxlat, geonum) {
    // console.log(minlng + '~' + maxlng + "  " + minlat + '~' + maxlat);
    viewer.entities.remove(singleGrid);
    singleGrid = viewer.entities.add({
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(minlng, minlat, maxlng, maxlat),
            material: Cesium.Color.RED.withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.RED.withAlpha(0.8),
            height: 0,
            zIndex: 20
        }
    });
}

// 在地图上选取多个点
export function getMultiplePosition(viewer) {
    let scene = viewer.scene;
    if (mouseHandlerDraw) {
        mouseHandlerDraw.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        mouseHandlerDraw.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        mouseHandlerDraw.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        mouseHandlerDraw.destroy();
        mouseHandlerDraw = null;
    }
    mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    CesiumTooltip.initTool(viewer);
    let positions = [];
    let ellipsoid = Cesium.Ellipsoid.WGS84;
    let wgs84_positions = [];
    mouseHandlerDraw.setInputAction(function(movement) {
        let pick = viewer.scene.pick(movement.position);
        if (Cesium.defined(pick) && pick.id != undefined && pick.id.id.indexOf("multiple_") != -1) {
            Message.warning("不可重复点击！");
            return;
        }
        if (wgs84_positions.length == 0) {
            claearMultipleGrids(viewer)
        }
        let height = null;
        if (movement.position != null) {
            let cartesian = scene.camera.pickEllipsoid(movement.position, ellipsoid);
            if (cartesian) {
                positions.push(cartesian);
                let cartesian33 = new Cesium.Cartesian3(cartesian.x, cartesian.y, cartesian.z);
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
                let lat = Cesium.Math.toDegrees(cartographic.latitude);
                let lng = Cesium.Math.toDegrees(cartographic.longitude);
                let alt = cartographic.height;
                height = Math.ceil(viewer.camera.positionCartographic.height);
                let params = {
                    lng: lng,
                    lat: lat,
                    video_height: height
                };
                server.showSignalPointGrid(params).then(response => {
                    if (response.server_status == 200) {
                        let data = response.geo_num_list[0];
                        let minlat = data.lbLat;
                        let minlng = data.lbLng;
                        let maxlat = data.rtLat;
                        let maxlng = data.rtLng;
                        let geonum = data.geo_num;
                        // drawSingleGrid(viewer, minlng, minlat, maxlng, maxlat, geonum); // 绘制单网格
                        drawMultipleGrids(viewer, minlng, minlat, maxlng, maxlat, geonum)
                            // 请求查询数据接口
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
                });
            }
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    mouseHandlerDraw.setInputAction(function(movement) {
        let position = movement.endPosition;
        if (position != null) {
            if (positions.length == 0) {
                CesiumTooltip.showAt(position, "点击添加第一个点");
            } else {
                CesiumTooltip.showAt(position, "右键单击结束");
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    mouseHandlerDraw.setInputAction(function(movement) {
        let position = movement.position;
        if (position != null) {
            let cartesian = scene.camera.pickEllipsoid(position, ellipsoid);
            if (cartesian) {
                // if (typeof callback == 'function') {
                //     callback(geonums);
                // }
                if (mouseHandlerDraw) {
                    mouseHandlerDraw.destroy();
                    mouseHandlerDraw = null;
                }
                if (CesiumTooltip) {
                    CesiumTooltip.setVisible(false);
                }
                getMultiplePosition(viewer);
                if (wgs84_positions.length == 0) {
                    return
                }
                // getPos();
                let geo_json = {
                    "type": "MultiPolygon",
                    "coordinates": wgs84_positions
                };
                let height = Math.ceil(viewer.camera.positionCartographic.height);
                let geolevel = getLevelForHeight(height);
                let param = {
                    geoLevel: geolevel,
                    geo_json: JSON.stringify(geo_json)
                };
                Bus.$emit("reloadTable", param);
            }

        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
// 绘制多个网格
function drawMultipleGrids(viewer, minlng, minlat, maxlng, maxlat, geonum) {
    if (!multiple_grids_entity) {
        multiple_grids_entity = viewer.entities.add(new Cesium.Entity());
    }
    viewer.entities.add({
        id: 'multiple_' + geonum, //single double
        parent: multiple_grids_entity,
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(minlng, minlat, maxlng, maxlat),
            material: Cesium.Color.RED.withAlpha(0.5),
            outline: true,
            outlineColor: Cesium.Color.WHITE.withAlpha(0),
            height: 0
        }
    });
}
// 清除所画的多网格
export function clearMultipleGrids(viewer) {
    if (CesiumTooltip) {
        CesiumTooltip.setVisible(false);
        // CesiumTooltip.cancal();
    }
    if (mouseHandlerDraw) {
        mouseHandlerDraw.destroy();
        mouseHandlerDraw = null;
    }
    claearMultipleGrids(viewer);

}

function claearMultipleGrids(viewer) {
    if (multiple_grids_entity) {
        $.each(multiple_grids_entity._children, function(i, obj) {
            viewer.entities.remove(obj);
        });
        multiple_grids_entity = null;

    }
}