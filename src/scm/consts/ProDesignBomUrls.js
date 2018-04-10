import { prefixScm, prefixPub } from '../../base/consts/UrlsConfig';
import { ReqApi } from '../../base/services/ReqApi';

const page = { page: 1, pageSize: 15 };
const UploadUrl={COMMON_UPLOAD_FILE:`${prefixPub}/common/uploadFile`,}


const ProDesignBomFetch = {
    //新建产品设计BOM物料明细列表
    editProDesignBomTable: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/maindata/ProductDesignBom/getMaterialDetail`,
        pm
    }),

    //产品设计BOM列表
    getProductDesignBomList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/maindata/ProductDesignBom/getBomList`,
        pm
    }),

    //产品设计BOM列表删除
    delProductDesignBomList: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/removeProductDesignBom`,
        pm
    }),

    //获取设计类型
    getDesignType: (pm = {}) => ReqApi.post({
        url: `${prefixPub}/basic/subject/getAllSubject`,
        pm
    }),
    //产品设计bom详情
    getBomDetailList: (pm = {}) => ReqApi.post({
        url:`${prefixScm}/maindata/ProductDesignBom/getBomDetail`,
        pm
    }),
    //启用产品设计BOM
    enableProDesignBomData: (pm = {}) => ReqApi.post({
        url:`${prefixScm}/maindata/ProductDesignBom/enableExcelData`,
        pm
    }),
    //新建产品设计BOM
    addProDesignBomData: (pm = {}) => ReqApi.post({
        url:`${prefixScm}/maindata/ProductDesignBom/saveExcelData`,
        pm
    }),
    //编辑产品设计BOM
    // editProDesignBomData: (pm = {}) => ReqApi.post({
    //     url:`${prefixScm}/maindata/ProductDesignBom/modifyMaterialDetail`,
    //     pm
    // }),
    //产品分类 -- 导入类型
    getCombBoxList: (pm = {}) => ReqApi.get({
        url:`${prefixScm}/materialcategory/getComboBoxList`,
        pm
    }),
    //计量单位
    unitList: (pm = {}) => ReqApi.get({
        url:`${prefixPub}/basic/measure/getList`,
        pm
    }),

    //获取产品设计BOM导入列表
    getImportBomList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/maindata/ProductDesignBom/getImportsList`,
        pm
    }),
    //获取产品设计BOM导入列表删除
    delImportBomList: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/importRemove`,
        pm
    }),

    //详情页面禁用
    ableProDesignBom: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/disableBom`,
        pm
    }),

    //导入
    importExcel: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/importExcel`,
        pm,
        callBack: true
    }),
    //清空
    clearImportExcel: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/clearProductDesignBom`,
        pm
    }),
    //pub上传图片
    uploadPic:`${prefixPub}/common/uploadFileByCondition`,
    //产品图片查看
    getBomPicture: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/maindata/ProductDesignBom/getBomPictureList`,
        pm
    }),
    //产品图片保存
    saveBomPicture: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/saveBomPicture`,
        pm
    }),
    //产品图片删除
    removeBomPicture: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/removeBomPicture`,
        pm
    }),
    //产品物料明细图片查看
    getBomDetailPictureList: (pm = {}) => ReqApi.get({
        url: `${prefixScm}/maindata/ProductDesignBom/getBomDetailPictureList`,
        pm
    }),
     //产品物料明细图片保存
    saveBomDetailPicture: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/saveBomDetailPicture`,
        pm
    }),
    //产品物料明细图片删除
    removeBomDetailPicture: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/removeBomDetailPicture`,
        pm
    }),
    //详情里面编辑物料时的保存
    modifyMaterialDetail: (pm = {}) => ReqApi.post({
        url: `${prefixScm}/maindata/ProductDesignBom/modifyMaterialDetail`,
        pm
    }),
}
export { ProDesignBomFetch ,UploadUrl}