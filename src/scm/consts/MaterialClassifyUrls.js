//生产退料申请单
import { prefix, prefixScm, prefixPub } from '../../base/consts/UrlsConfig';

const materialcategory="materialcategory";

const MaterialClassifyUrls = {
    GET_LIST: `${prefixScm}/${materialcategory}/findList`, // 获取列表
    UPDATA_ORDER_STATUS: `${prefixScm}/${materialcategory}/updateOrderStatus`, // 启用/禁用 
    DELETE: `${prefixScm}/${materialcategory}/delete`, // 删除
    GET_DETAILS: `${prefixScm}/${materialcategory}/get`, // 获取详情
    CHECK_CHILDREN: `${prefixScm}/${materialcategory}/checkIsChildren`, // 启用-- 是否有子节点 
    GET_COMBOBOX_LIST: `${prefixScm}/${materialcategory}/getComboBoxList`, // 树形下拉框
    CHECK_ISUSE: `${prefixScm}/${materialcategory}/checkIsUse`, //是否允许物料使用
    ADD: `${prefixScm}/${materialcategory}/add`, // 新增
    UPDATE:  `${prefixScm}/${materialcategory}/update`, // 修改
};

export default MaterialClassifyUrls;