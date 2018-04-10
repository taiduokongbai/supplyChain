//收货确认单
import { prefix, prefixScm, prefixPub } from '../../../base/consts/UrlsConfig';
import {ReqApi} from '../../../base/services/ReqApi';
const receive = 'receive';
const page = { page: 1, pageSize: 10 };

const ReceiptConfirmFetch = {
    //收货确认单列表
    receiptConfirmList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${receive}/getList`,
        pm: Object.assign({},page,pm)
    }),
    receiptConfirmDetail: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/${receive}/getDetail`,
        pm
    }),
    purchaserList: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/employees/list`,
        pm: Object.assign({},page,pm)
    }),
    //采购组织下拉列表
    purOrgList: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/dept/getOrgList`,
        pm: Object.assign({},page,pm)
    }),
    receivingAddressList: (pm = {}) => ReqApi.get({
        url: `${prefixPub}/basic/address/getSaleOrderAddress`,
        pm: Object.assign({},page,pm)
    }),
    // 执行收货
    receiptConfirmEdit: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/${receive}/executeRecive`,
        pm
    }),
   
}
export default ReceiptConfirmFetch;