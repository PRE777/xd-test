var Cesium = require('cesium/Cesium');
import { Message } from 'element-ui';
import { server } from "../../../network/api";
import { getLevelForHeight } from "../tool/Public";
import { Cartesian3_to_WGS84 } from '../tool/CoordinateTransform'

import { DrawPolygonEntity } from "../tool/DrawPolyonEntity";
import { drawGrids, clear_polygon_grids } from "./DrawGrids";
import Bus from "../tool/bus";


//手画多边形框
export function drawPolygonArea(viewer) {
    var gonOption = {
        width: 3,
        geodesic: true
    };
    DrawPolygonEntity.startDrawingPolyshape(viewer, false, gonOption, function() {
        clear_polygon_grids(viewer);
    }, function(cartesians) {

        let lngs = [];
        let lats = [];
        let height = viewer.camera.positionCartographic.height;
        let level = getLevelForHeight(height);
        let wgs84_positions = [];
        for (var i = 0; i < cartesians.length; i++) {
            let wgs84_point = Cartesian3_to_WGS84(cartesians[i]);
            let point = [wgs84_point.lng, wgs84_point.lat];
            wgs84_positions.push(point);
            lats.push(wgs84_point.lat)
            lngs.push(wgs84_point.lng)
        }
        let lngStr = lngs.join(",");
        let latStr = lats.join(",");
        let params = {
            lngs: lngStr,
            lats: latStr,
            video_height: height
        };
        let coordinates = [wgs84_positions];
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
        server.showPolygonGrid(params).then(response => {
            if (response.server_status == 200) {
                let data = response.geo_num_list;
                drawGrids(viewer, data);
            }
        })
    });
}
// 清除多边形框
export function cancelPolygonArea(viewer) {
    DrawPolygonEntity.startDrawingClear(viewer);
    clear_polygon_grids(viewer); 
}