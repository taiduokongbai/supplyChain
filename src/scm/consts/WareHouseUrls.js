import { prefix, prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import { ReqApi } from '../../base/services/ReqApi';

const basic = 'basic';
const site = 'site';
const address = 'address';
const inventory = 'inventory';
const stock = 'stock';
const page = { page: 1, pageSize: 10 };

const WarehouseUrls = {
    GET_All: `${prefixPub}/${basic}/${site}/getAll`,
    PRINCIPAL_LIST: `${prefixPub}/employees/getEmps`,
    GET_ADDR: `${prefixPub}/${basic}/${address}/getAll`,
    ADD: `${prefixPub}/${basic}/${address}/add`,
    ADD_STOCK: `${prefixScm}/${inventory}/${stock}/add`,
    EDIT_STOCK: `${prefixScm}/${inventory}/${stock}/edit`,
    INFO_STOCK: `${prefixScm}/${inventory}/${stock}/info`,
}

const WarehouseFetch = {
    getAll: (pm = {}) => ReqApi.post({   // 获取所属站点列表(不分页)   -- 以后要改的 
        url: WarehouseUrls.GET_All,
        pm
    }),
    getPrincipalList: (pm = {}) => ReqApi.get({   // 获取负责人 
        url: WarehouseUrls.PRINCIPAL_LIST,
        pm
    }),
    getAddrList: (pm = {}) => ReqApi.post({   // 获取地址
        url: WarehouseUrls.GET_ADDR,
        pm
    }),
    addNewAddr: (pm = {}) => ReqApi.post({   // 新建地址
        url: WarehouseUrls.ADD,
        pm
    }),
    addStock: (pm = {}) => ReqApi.post({   // 新建地址
        url: WarehouseUrls.ADD_STOCK,
        pm
    }),
    editStock: (pm={}) =>  ReqApi.post({   // 编辑地址
        url: WarehouseUrls.EDIT_STOCK,
        pm
    }),
    getStockInfo: (pm={}) =>  ReqApi.get({   // 获取仓库信息
        url: WarehouseUrls.INFO_STOCK,
        pm
    }),
}

export default WarehouseUrls;
export { WarehouseFetch };  