var Cesium = require('cesium/Cesium');

//笛卡尔坐标系转WGS84坐标系
export function Cartesian3_to_WGS84(point) {
    var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var alt = cartographic.height;
    return { lat: lat, lng: lng, alt: alt };
};

//WGS84坐标系转笛卡尔坐标系
export function WGS84_to_Cartesian3(point) {
    var car33 = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt);
    var x = car33.x;
    var y = car33.y;
    var z = car33.z;
    return { x: x, y: y, z: z };
}