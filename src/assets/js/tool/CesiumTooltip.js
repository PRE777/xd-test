 /*
  *提示框工具
  *entity方式
  */
 var Cesium = require('cesium/Cesium');

 export let CesiumTooltip = (function() {
     var isInit = false;
     var viewer;
     var labelEntity;

     function _() {};

     _.initTool = function(_viewer) {
         this.cancal();
         if (isInit) {
             return;
         }
         viewer = _viewer;
         labelEntity = viewer.entities.add({
             position: Cesium.Cartesian3.fromDegrees(0, 0),
             label: {
                 text: '提示',
                 font: '15px sans-serif',
                 pixelOffset: new Cesium.Cartesian2(8, 8), //y大小根据行数和字体大小改变
                 horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                 showBackground: true,
                 backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 1.0)
             }
         });
         labelEntity.show = false;
         isInit = true;
     }

     _.setVisible = function(visible) {
         if (!isInit) {
             return;
         }
         labelEntity.show = visible ? true : false;
     };

     _.showAt = function(position, message) {
         if (!isInit) {
             return;
         }
         if (position && message) {
             labelEntity.show = true;
             var cartesian = viewer.camera.pickEllipsoid(position, viewer.scene.globe.ellipsoid); //
             if (cartesian) {
                 labelEntity.position = cartesian;
                 labelEntity.show = true;
                 labelEntity.label.text = message;
             } else {
                 labelEntity.show = false;
             }
         }
     };

     _.cancal = function() {
         isInit = false;
         if (viewer && labelEntity) {
             viewer.entities.remove(labelEntity);
             labelEntity = null;
             viewer = null;
         }
     };


     return _;
 })();