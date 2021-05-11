var Cesium = require('cesium/Cesium');

let polygon_grids_entity = null;
let fik_primitives;
let interval;
// 画多网格
export function drawGrids(viewer, data, outline = true, color = null) {
    if (polygon_grids_entity == null) {
        polygon_grids_entity = viewer.entities.add(new Cesium.Entity())
    }
    for (var i = 0; i < data.length; i++) {
        let val = data[i]
        let minlat = val.lbLat;
        let minlng = val.lbLng;
        let maxlat = val.rtLat;
        let maxlng = val.rtLng;
        let geonum = val.geo_num;
        let material = Cesium.Color.RED.withAlpha(0.0);
        let outLineColor = new Cesium.Color(3 / 255, 195 / 255, 255 / 255, 0.8);
        if (color) {
            material = color;
        }
        if (!outline) {
            material = getColor(val.count);
        }
        viewer.entities.add({
            id: geonum,
            parent: polygon_grids_entity,
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(minlng, minlat, maxlng, maxlat),
                material: material,
                outline: outline,
                outlineColor: outLineColor,
                height: 0.0,
            },
        });
    }
}
// 清除所画的多个网格
export function clear_polygon_grids(viewer) {
    if (polygon_grids_entity != null) {
        polygon_grids_entity._children.forEach(element => {
            viewer.entities.remove(element);
        });
        polygon_grids_entity = null;
    }
}

export function observeGrid(viewer, data) {

    if (fik_primitives) {
        fik_primitives.removeAll();
        viewer.scene.primitives.remove(fik_primitives)
        fik_primitives = null;
    }
    if (!fik_primitives) {
        fik_primitives = new Cesium.PrimitiveCollection();
        viewer.scene.primitives.add(fik_primitives);
    }

    let instancesty = [];
    for (let i = 0; i < data.length; i++) {
        let val = data[i]
        let minlat = val.lbLat;
        let minlng = val.lbLng;
        let maxlat = val.rtLat;
        let maxlng = val.rtLng;
        let geonum = val.geo_num;
        let count = val.count;
        let material = getColor(count);

        var instancer = new Cesium.GeometryInstance({
            geometry: new Cesium.RectangleGeometry({
                rectangle: Cesium.Rectangle.fromDegrees(minlng, minlat, maxlng, maxlat),
                // vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL,
                height: 0,
                extrudedHeight: 0
            }),
            id: geonum,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(material)
            }
        });
        instancesty.push(instancer)
    }
    var primitive = new Cesium.Primitive({
        geometryInstances: instancesty,
        appearance: new Cesium.PerInstanceColorAppearance()
    });
    fik_primitives.add(primitive);
}

// 定时器控制显隐
export function clearTimer(close = false) {
    clearInterval(interval)
    if (!close) {
        interval = setInterval(function() {
            fik_primitives.show = !fik_primitives.show;
        }, 1000);
    }
}
// 关闭更新监视
export function disconnect() {
    if (!fik_primitives) {
        return;
    }
    fik_primitives.removeAll();
    clearTimer(true)
}


function getColor(count) {
    let alpha = 0.5;
    let material = new Cesium.Color(1, 0, 0, 1.0);
    if (0 < count && count <= 50) {
        material = new Cesium.Color(0.31, 0.44, 0.9, alpha);
    } else if (50 < count && count <= 100) {
        material = new Cesium.Color(0.32, 0.68, 0.9, alpha);
    } else if (100 < count && count <= 150) {
        material = new Cesium.Color(0.47, 0.95, 0.8, alpha);
    } else if (150 < count && count <= 250) {
        material = new Cesium.Color(0.96, 0.95, 0.6, alpha);
    } else if (250 < count && count <= 300) {
        material = new Cesium.Color(0.99, 0.94, 0.1, alpha);
    } else if (300 < count && count <= 350) {
        material = new Cesium.Color(0.86, 0.4, 0.1, alpha);
    } else if (350 < count) {
        material = new Cesium.Color(0.91, 0.09, 0.0, alpha);
    }
    return material;
}