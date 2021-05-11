import { Message } from 'element-ui';

import { server } from "../../../network/api";

export function downLoad(id, fileName) {
    let param = {
        id: id,
    };
    server.downloadFile(param).then((response) => {
        if (response.data) {
            saveFile(response.data, fileName)
                .then(() => {
                    Message.success("下载成功");
                })
                .catch(() => {
                    Message.error("下载失败，请稍后重试！");
                });
        }
    });
}

function saveFile(data, name) {
    return new Promise((resolve, reject) => {
        try {
            const blobUrl = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.style.display = "none";
            a.download = name;
            a.href = blobUrl;
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            resolve();
        } catch (error) {
            reject(error);
        }
    });

}