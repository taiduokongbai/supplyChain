import { prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
const consumer = 'consumer';
const maindata = 'maindata';
const login = 'login';
const codeRule='codeRule';
const CustomerUrls = {
    CUSTOMER_LIST: `${prefixScm}/${maindata}/${consumer}/getConsumerList`,
    CUSTOMERDETAIL: `${prefixScm}/${maindata}/${consumer}/getConsumer`,
    CUSTOMERADD: `${prefixScm}/${maindata}/${consumer}/addConsumer`,
    CUSTOMEREDIT: `${prefixScm}/${maindata}/${consumer}/updateConsumer`,
    CUSTOMERDEL: `${prefixScm}/${maindata}/${consumer}/deleteConsumer`,
    CUSTOMERSETUP: `${prefixScm}/${maindata}/${consumer}/enableOrDisableConsumer`,
    DEFAULTUSER: `${prefixPub}/${login}/currentUserInfo`,
    SETTLELIST: `${prefixPub}/basic/settle/getList`,
    IMPORT_EXCEL: `${prefixScm}/${maindata}/${consumer}/importExcel`,//导入接口
    ISAUTO:`${prefixPub}/${codeRule}/isAuto`,//编码规则
};

export default CustomerUrls;