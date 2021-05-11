var Cesium = require('cesium/Cesium');
import { CesiumTooltip } from "../tool/CesiumTooltip";
import { server } from "../../../network/api";
import { drawGrids, clear_polygon_grids } from "./DrawGrids";
import { getLevelForHeight } from "../tool/Public";
import Bus from "../tool/bus";
let mouseHandlerDraw;
let rect_entity;

// 两点画矩形
export function drawRect(val) {

    let viewer = val;

    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var cartesian = null;
    var timer = null;
    var doubleClickPoints = [];
    if (!mouseHandlerDraw) {
        mouseHandlerDraw = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }
    if (rect_entity == null) {
        rect_entity = viewer.entities.add(new Cesium.Entity());
    }
    CesiumTooltip.initTool(viewer);
    // 鼠标左键双击
    mouseHandlerDraw.setInputAction(function(movement) {
        // 移除移除 左键单击手势
        //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
        cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);
        if (cartesian) {
            //将笛卡尔坐标转换为地理坐标
            const cartographic = ellipsoid.cartesianToCartographic(cartesian);
            doubleClickPoints.push(cartographic);
            if (doubleClickPoints.length == 2) {
                // 达到两个点之后 去画矩形
                drawRectShape(viewer, doubleClickPoints);
                if (CesiumTooltip) {
                    CesiumTooltip.setVisible(false);
                }
                CesiumTooltip.initTool(viewer);
                // 然后清空 doubleClickPoints
                doubleClickPoints = [];
            }
        } else {

        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    mouseHandlerDraw.setInputAction(function(movement) {
        var position = movement.endPosition;
        if (position != null) {
            if (doubleClickPoints.length == 0) {
                CesiumTooltip.showAt(position, "双击左键添加第一个点");
            } else if (doubleClickPoints.length == 1) {
                CesiumTooltip.showAt(position, "双击左键添加第二个点");
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function drawRectShape(viewer, points) {
    clearRectShape(viewer);
    let rect = viewer.entities.add({
        parent: rect_entity,
        rectangle: {
            coordinates: Cesium.Rectangle.fromCartographicArray(points),
            material: new Cesium.Color(1, 0, 0, 0),
            outline: true,
            outlineWidth: 5,
            outlineColor: new Cesium.Color(1, 0, 0, 1),
            height: 0, // 必须有否则边框不显示
        }
    });
    let height = viewer.camera.positionCartographic.height;
    let rectangle = rect.rectangle.coordinates._value;
    let minlng = Cesium.Math.toDegrees(rectangle.west);
    let minlat = Cesium.Math.toDegrees(rectangle.south);
    let maxlng = Cesium.Math.toDegrees(rectangle.east);
    let maxlat = Cesium.Math.toDegrees(rectangle.north);
    let lngStr = `${minlng},${minlng},${maxlng},${maxlng}`;
    let latStr = `${maxlat},${minlat},${minlat},${maxlat}`;
    let params = {
        lngs: lngStr,
        lats: latStr,
        video_height: height
    };

    let coordinates = [
        [
            [minlng, maxlat],
            [minlng, minlat],
            [maxlng, minlat],
            [maxlng, maxlat],
            [minlng, maxlat],
        ]
    ];

    let geo_json = {
        "type": "Polygon",
        "coordinates": coordinates
    };
    let geolevel = getLevelForHeight(height);
    let param = {
        geoLevel: geolevel,
        geo_json: JSON.stringify(geo_json)
    };
    Bus.$emit("reloadTable", param);
    // 请求网格
    server.showPolygonGrid(params).then(response => {
        if (response.server_status == 200) {
            let data = response.geo_num_list;
            drawGrids(viewer, data);
        }
    })

}
// 清除矩形
function clearRectShape(viewer) {
    if (rect_entity != null) {
        rect_entity._children.forEach(element => {
            viewer.entities.remove(element);
        });
    }
    clear_polygon_grids(viewer);
}

function distoryMouseHandler() {
    if (mouseHandlerDraw) {
        mouseHandlerDraw.destroy();
        mouseHandlerDraw = null;
    }
    CesiumTooltip.setVisible(false);
}

export function endTodrawRect(viewer) {
    clearRectShape(viewer);
    distoryMouseHandler();
}