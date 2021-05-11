let Cesium = require('cesium/Cesium');
import { getLevelForHeight } from "../tool/Public";
import { Cartesian3_to_WGS84 } from '../tool/drawTool'
import Bus from "../tool/bus";
import axios from 'axios'

// import {  } from "../../../../public/resources/china.geojson";
let handler;
let lastEntity;
let adminitrativeArea_dataSources;
// 绘制行政区域
export function drawAdminstrativeArea(viewer) {
    // let path = "/resources/china.geojson";
    $.getJSON("./resources/china.geojson", data => {
        let promise = Cesium.GeoJsonDataSource.load(data, {
            stroke: Cesium.Color(1, 1, 0, 99 / 255.0),
            strokeWidth: 2,
        });
        promise.then(function(dataSource) {
            adminitrativeArea_dataSources = dataSource;
            viewer.dataSources.add(dataSource);
            let entities = dataSource.entities.values;
            let color = new Cesium.Color(1, 1, 0, 0.3);
            let outlineColor = new Cesium.Color(220 / 255.0, 20 / 255.0, 60 / 255.0, 255 / 255.0);
            for (let o = 0; o < entities.length; o++) {
                let entity = entities[o];
                entity.polygon.material = color;
                entity.polygon.outline = true;
                entity.polygon.outlineColor = outlineColor;
                entity.polygon.extrudedHeight = 0;
            }
        });
        viewer.flyTo(promise);
        let colors = new Cesium.Color(123 / 255.0, 104 / 255.0, 139 / 255.0, 238 / 255.0);
        let colorvs = new Cesium.Color(1, 1, 0, 99 / 255.0);
        if (!handler) {
            handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        }
        handler.setInputAction(function(movement) {
            // $.each(duo_draws_entity._children, function(i, obj) {
            //     viewer.entities.remove(obj);
            // });
            // $.each(entity_sky._children, function(i, obj) {
            //     viewer.entities.remove(obj);
            // });
            //let pickedFeature = viewer.scene.pick(movement.position);
            let pickedObjects = viewer.scene.drillPick(movement.position, 2);
            if (pickedObjects.length == 0) {
                return
            } else {
                // let tvalue = pickedObjects[0].id._polygon.hierarchy._value;

                // 调用数据列表接口
                /**
                 * 声明：修改为双击事件
                 * */
                let coordinateArr = [];
                let entity = pickedObjects[0].id;
                if (entity._polygon != undefined) {
                    var lngt = entity._polygon.hierarchy._value.positions;
                } else {
                    entity = pickedObjects[1].id;
                    var lngt = entity._polygon.hierarchy._value.positions;
                }
                // lastEntity
                if (lastEntity) {
                    lastEntity.polygon.material = new Cesium.Color(1, 1, 0, 0.3);
                }
                entity.polygon.material = new Cesium.Color(1, 0, 0, 0.3);
                lastEntity = entity;
                let posarrs = [];
                for (let i = 0; i < lngt.length; i++) {
                    let obj = Cartesian3_to_WGS84(lngt[i]);
                    let point = [obj.lng, obj.lat];
                    posarrs.push(point);
                }

                let arr = [posarrs];
                coordinateArr.push(arr);
                let geo_json = {
                    "type": "MultiPolygon",
                    "coordinates": coordinateArr
                };
                let height = Math.ceil(viewer.camera.positionCartographic.height);
                let geolevel = getLevelForHeight(height);
                let param = {
                    geoLevel: geolevel,
                    geo_json: JSON.stringify(geo_json)
                };
                Bus.$emit("reloadTable", param);

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });
}
// 清除行政区域
export function clearAdminitrativeArea(viewer) {
    if (adminitrativeArea_dataSources != null) {
        viewer.dataSources.remove(adminitrativeArea_dataSources);
        adminitrativeArea_dataSources = null;
        lastEntity = null;
    }
    if (handler) {
        handler.destroy();
        handler = null;
    }
}