"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
process.chdir(path_1.dirname(path_1.dirname(__dirname)));
require("../core/bootstrap");
const dependency_injection_1 = require("../core/dependency-injection");
const api = dependency_injection_1.getService('api');
const o = {
    "id": 16,
    "title": "生活里的快乐时光",
    "site": "699pic",
    "source": "http://699pic.com/tupian-400130776.html",
    "item_id": "400130776",
    "status": "done",
    "error_info": "",
    "fail_reason": "",
    "attachments": [
        {
            "source": "http://proxy-tx.699pic.com/00/cd9223c2990.zip?st=1_npvNz9t9fGAjKG7naxDA&e=1537109644",
            "path": "699pic/2018/09/16/68a1b5_215404_400130776.zip",
            "meta": {
                "app": "Photoshop CC",
                "pid": "400130776",
                "extra": {
                    "stat": {
                        "q": 0,
                        "pid": 400130776,
                        "uid": 20873682,
                        "is_vip": 0,
                        "is_limit": 0,
                        "pic_cate": "3",
                        "showTips": 0,
                        "file_type": 1,
                        "search_kw": "",
                        "author_uid": "17688377"
                    }
                }
            },
            "status": "done"
        }
    ]
};
api.notify(o).then((v) => {
    console.log(v);
});
//# sourceMappingURL=test.js.map