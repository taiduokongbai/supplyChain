import { prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import { ReqApi } from '../../base/services/ReqApi';

const saledelivery = 'saledelivery';
const basic = 'basic';
const page = { page: 1, pageSize: 10 };

const SaleDeliveryUrls = {
    SALE_DELIVERY_NOTICE_LIST: `${prefixScm}/${saledelivery}/findList`,
    SALE_DELIVERY_NOTICE_DETAIL: `${prefixScm}/${saledelivery}/get`,
    SALE_DELIVERY_NOTICE_ADD: `${prefixScm}/${saledelivery}/add`,
    SALE_DELIVERY_NOTICE_EDIT: `${prefixScm}/${saledelivery}/update`,
    SALE_DELIVERY_NOTICE_DEL: `${prefixScm}/${saledelivery}/delete`,
    SALE_DELIVERY_NOTICE_PUSH: `${prefixScm}/${saledelivery}/push`,
    SALE_DELIVERY_NOTICE_SALELIST: `${prefixScm}/${saledelivery}/findSaleList`,
    WAREHOUSE_LIST: `${prefixScm}/${basic}/getWarehouseList`,
    GET_SITE_LIST: `${prefixPub}/${basic}/site/getList`,
    GET_CONTACTS_LIST: `${prefixScm}/${basic}/getContactsList`,
    RECEIVE_SITE_LIST: `${prefixScm}/${basic}/getAddressList`,
    ISAUTO: `${prefixPub}/codeRule/isAuto`,
};

export default SaleDeliveryUrls ;

const SaleDeliveryFetch = {
    //列表
    saleDeliveryNoticeList: (pm = {}) => ReqApi.get({
        url: SaleDeliveryUrls.SALE_DELIVERY_NOTICE_LIST,
        pm: Object.assign({}, page, pm)
    }),
    //删除
    saleDeliveryNoticeDelete: (pm = {}) => ReqApi.post({
        url: SaleDeliveryUrls.SALE_DELIVERY_NOTICE_DEL,
        pm
    }),
    //详情
    saleDeliveryNoticeDetail: (pm = {}) => ReqApi.get({
        url: SaleDeliveryUrls.SALE_DELIVERY_NOTICE_DETAIL,
        pm
    }),
    //新增
    saleDeliveryNoticeAdd: (pm = {}) => ReqApi.post({
        url: SaleDeliveryUrls.SALE_DELIVERY_NOTICE_ADD,
        pm
    }),
    //编辑
    saleDeliveryNoticeEdit: (pm = {}) => ReqApi.post({
        url: SaleDeliveryUrls.SALE_DELIVERY_NOTICE_EDIT,
        pm
    }),
    //下推
    saleDeliveryNoticePush: (pm = {}) => ReqApi.post({
        url: SaleDeliveryUrls.SALE_DELIVERY_NOTICE_PUSH,
        pm
    }),
    //来源订单
    saleDeliveryNoticeSaleList: (pm = {}) => ReqApi.get({
        url: SaleDeliveryUrls.SALE_DELIVERY_NOTICE_SALELIST,
        pm: Object.assign({}, page, pm)
    }),
    //发货站点下拉
    siteList: (pm = {}) => ReqApi.get({
        url: SaleDeliveryUrls.GET_SITE_LIST,
        pm: Object.assign({}, {isSog:1}, page, pm)
    }),
    //仓库下拉
    wareHouseList: (pm = {}) => ReqApi.get({
        url: SaleDeliveryUrls.WAREHOUSE_LIST,
        pm: Object.assign({}, {status:1}, page, pm)
    }),
    //收货人下拉,
    contactsList: (pm = {}) => ReqApi.get({
        url: SaleDeliveryUrls.GET_CONTACTS_LIST,
        pm: Object.assign({}, page, pm)
    }),
    //收货站点下拉
    receiveSiteList: (pm = {}) => ReqApi.get({
        url: SaleDeliveryUrls.RECEIVE_SITE_LIST,
        pm: Object.assign({}, {isRep:1},page, pm)
    }),
    //编码规则
    codeRule: (pm = {}) => ReqApi.get({
        url: SaleDeliveryUrls.ISAUTO,
        pm
    }),
}
export { SaleDeliveryFetch }