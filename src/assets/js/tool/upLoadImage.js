var Cesium = require("cesium/Cesium");

var singleLayer = undefined;
var redRactangle = null;

/**
 * 116.3,
    39.8,
    116.4,
    39.99
 */
export function addImage(mapViewer, param) {
    if (singleLayer) {
        removeLayer(mapViewer);
    }
    let fly = param.fly;
    let minLng = param.minLng;
    let maxLng = param.maxLng;
    let minLat = param.minLat;
    let maxLat = param.maxLat;
    let url = param.url;
    singleLayer = mapViewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
        rectangle: new Cesium.Rectangle.fromDegrees(
            minLng,
            minLat,
            maxLng,
            maxLat
        ),
        url: url
    }));

    if (fly) {
        // 飞到指定位置
        let color = Cesium.Color.RED.withAlpha(0.0)
        redRactangle = mapViewer.entities.add({
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(minLng, minLat, maxLng, maxLat),
                material: color,
                outline: true,
                outlineColor: new Cesium.Color(255 / 255, 0 / 255, 0 / 255, 1),
                height: 0.0,
            },
        });
        mapViewer.zoomTo(redRactangle);
    }
}

export function removeLayer(mapViewer) {
    if (singleLayer) {
        mapViewer.imageryLayers.remove(singleLayer);
        singleLayer = null;
    }
    if (redRactangle) {
        mapViewer.entities.remove(redRactangle);
        redRactangle = null;
    }
}