 let baseUrl = ""
     // wms底图
 let wmsUrl = 'http://geoserver.iwhere.com/geoserver/global/wms?service=WMS';

 // google离线
 let offlineUrl = "";

 console.log(process.env.NODE_ENV);
 if (process.env.NODE_ENV == 'production') {
     if (process.env.VUE_APP_FLAG == 'prod') {
         //正式环境走的地址
         //  baseUrl = "http://10.68.1.132:8080/bd-guide";
         baseUrl = "http://10.3.11.237:8080/bd-guide";

     } else if (process.env.VUE_APP_FLAG == 'qa') {
         //qa环境走的地址
         baseUrl = "http://10.68.1.58:30061/bd-guide";
     }
 } else {
     // 开发环境
     baseUrl = "http://10.3.11.237:8899/bd-guide";
     //  baseUrl = "http://bd-guide.elk.iwhere.com";
     offlineUrl = "http://10.3.11.237:8080/map/{z}/{x}/{y}.png"
 }
 export {
     baseUrl,
     wmsUrl,
     offlineUrl,
 }