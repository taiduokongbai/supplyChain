import { prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import { ReqApi } from '../../base/services/ReqApi';

const purchasereceive = 'purchasereceive';
const basic = 'basic';
const page = { page: 1, pageSize: 10 };

const PurRecUrls = {
    PUR_REC_NOTICE_LIST: `${prefixScm}/${purchasereceive}/findList`,
    PUR_REC_NOTICE_DETAIL: `${prefixScm}/${purchasereceive}/get`,
    PUR_REC_NOTICE_ADD: `${prefixScm}/${purchasereceive}/add`,
    PUR_REC_NOTICE_EDIT: `${prefixScm}/${purchasereceive}/update`,
    PUR_REC_NOTICE_DEL: `${prefixScm}/${purchasereceive}/delete`,
    PUR_REC_NOTICE_PUSH: `${prefixScm}/${purchasereceive}/push`,
    PUR_REC_NOTICE_PURLIST: `${prefixScm}/${purchasereceive}/findPurchaseList`,
    ISAUTO: `${prefixPub}/codeRule/isAuto`,
};

export default PurRecUrls ;

const PurRecFetch = {
    //列表
    purRecNoticeList: (pm = {}) => ReqApi.get({
        url: PurRecUrls.PUR_REC_NOTICE_LIST,
        pm: Object.assign({}, { page: 1, pageSize: 15 }, pm)
    }),
    //删除
    purRecNoticeDelete: (pm = {}) => ReqApi.post({
        url: PurRecUrls.PUR_REC_NOTICE_DEL,
        pm
    }),
    //详情
    purRecNoticeDetail: (pm = {}) => ReqApi.get({
        url: PurRecUrls.PUR_REC_NOTICE_DETAIL,
        pm
    }),
    //新增
    purRecNoticeAdd: (pm = {}) => ReqApi.post({
        url: PurRecUrls.PUR_REC_NOTICE_ADD,
        pm
    }),
    //编辑
    purRecNoticeEdit: (pm = {}) => ReqApi.post({
        url: PurRecUrls.PUR_REC_NOTICE_EDIT,
        pm
    }),
    //下推
    purRecNoticePush: (pm = {}) => ReqApi.post({
        url: PurRecUrls.PUR_REC_NOTICE_PUSH,
        pm
    }),
    //来源订单
    purRecNoticePurList: (pm = {}) => ReqApi.get({
        url: PurRecUrls.PUR_REC_NOTICE_PURLIST,
        pm: Object.assign({}, page, pm)
    }),
    //编码规则
    codeRule: (pm = {}) => ReqApi.get({
        url: PurRecUrls.ISAUTO,
        pm
    }),
}
export { PurRecFetch }