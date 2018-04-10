import { prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import { ReqApi } from '../../base/services/ReqApi';

const supplier = 'supplierGoodsCatalogue';
const maindata='maindata';
const page = { page: 1, pageSize: 10 };

const SupplierGoodsUrls = {
    SUPPLIER_GOODS_LIST: `${prefixScm}/${maindata}/${supplier}/getList`,
    SUPPLIER_GOODS_DETAIL: `${prefixScm}/${maindata}/${supplier}/getDetail`,
    SUPPLIER_GOODS_DEL: `${prefixScm}/${maindata}/${supplier}/delete`,
    SUPPLIER_GOODS_ENABLE: `${prefixScm}/${maindata}/${supplier}/enableOrDisable`,
    SUPPLIER_GOODS_ADD_EDIT: `${prefixScm}/${maindata}/${supplier}/addOrUpdate`,
    
};

export default SupplierGoodsUrls ;

const SupplierGoodsFetch = {
    //列表
    supGoodsList: (pm = {}) => ReqApi.post({
        url: SupplierGoodsUrls.SUPPLIER_GOODS_LIST,
        pm: Object.assign({}, page, pm)
    }),
    //删除
    supGoodsDelete: (pm = {}) => ReqApi.post({
        url: SupplierGoodsUrls.SUPPLIER_GOODS_DEL,
        pm
    }),
    //详情
    supGoodsDetail: (pm = {}) => ReqApi.get({
        url: SupplierGoodsUrls.SUPPLIER_GOODS_DETAIL,
        pm
    }),
    //启用禁用
    supGoodsEnable: (pm = {}) => ReqApi.post({
        url: SupplierGoodsUrls.SUPPLIER_GOODS_ENABLE,
        pm
    }),
    //新增编辑
    supGoodsAddEdit: (pm = {}) => ReqApi.post({
        url: SupplierGoodsUrls.SUPPLIER_GOODS_ADD_EDIT,
        pm
    }),
}
export { SupplierGoodsFetch }