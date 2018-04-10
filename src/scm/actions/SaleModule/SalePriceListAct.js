import { ReqApi } from '../../../base/services/ReqApi'
import { Urls, MemberManage, BasicUrls } from '../../../base/consts/urls';
import BusinessUrls from '../../../base/consts/BusinessUrls';
import SaleOrderUrls from '../../../base/consts/SaleOrderUrls';
import { SALEPRICEREDU } from '../../consts/ActTypes';
import { message } from '../../../base/components/AntdComp'
import TabsAct from '../../actions/TabsAct';
import { store } from '../../data/StoreConfig';
const actions = {
    SalePriceList: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.TabLoading(true));
        return ReqApi.get({
            url: BusinessUrls.SALEPRICE_GETLIST,
            pm
        }).then((json) => {
            if (json.status == 2000) {
                dispatch(actions.GetSalePriceList(json.data));
            }
            dispatch(actions.TabLoading(false));
            return json;
        });
    },
    salePriceLoading: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('loading', value);
        dispatch({ type: SALEPRICEREDU, state })
    },
    //获取币种列表 currency/getlist currencyList
    CurrencyList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.get({
            url: SaleOrderUrls.GET_CURRENCY_LIST,
            pm
        }).then((json) => {
            if (json.status === 2000) {
                dispatch(actions.GetCurrencyList(json.data, type));
            }
            return json;
        });
    },
    CheckIsTax: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('isTax', value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    GetCurrencyList: (data, type) => (dispatch, getState) => {
        let { list } = data;
        if (type == "edit") {
            let state = getState()[SALEPRICEREDU].set('editCurrencySource', list)
            dispatch({ type: SALEPRICEREDU, state });
        } else {
            let state = getState()[SALEPRICEREDU].set('currencySource', list)
            dispatch({ type: SALEPRICEREDU, state });
        }
    },
    GetSalePriceList: (data) => (dispatch, getState) => {
        let { list, total, page, pageSize } = data;
        let state = getState()[SALEPRICEREDU].set('dataSource', list)
            .set("paging", { total, current: page, pageSize });
        dispatch({ type: SALEPRICEREDU, state });
    },

    MaterialList: (pm = {}) => (dispatch, getState) => {
        pm.allowSell = 0;
        pm.status = 1;
        return ReqApi.get({
            url: BusinessUrls.MATERIAL_GETLIST,
            pm
        }).then((json) => {
            return json;
        });
    },
    GetMaterialList: (data) => (dispatch, getState) => {
        let { list, total, page, pageSize } = data;
        let state = getState()[SALEPRICEREDU].set('dataSourceMaterial', list)
            .set("paging", { total, current: page, pageSize });
        dispatch({ type: SALEPRICEREDU, state });
    },

    TabLoading: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('tabLoading', value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    EidtLoading: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('editLoading', value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    materialLoading: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('materialLoading', value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    supplierLoading: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('priceloading', value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    supplierBaseLoading: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('supplierBaseLoading', value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    //详情
    getSupplierData: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.supplierBaseLoading(true));
        return ReqApi.get({
            url: BusinessUrls.SALEPRICE_GETDETAIL,
            pm,
            callBack:true
        }).then((json) => {
            if (json.status == 2000) {
                dispatch(actions.supplierDetail(json.data));
            }
            if (json.status == 6000) {
                message.error(`操作记录不存在`);
                store.dispatch(TabsAct.TabRemove("salePriceEdit", "salePriceList"));
                store.dispatch(TabsAct.TabRemove("salePriceDetail", "salePriceList"));
                dispatch(actions.SalePriceList({ page: 1, pageSize: 15 }));
                store.dispatch(TabsAct.TabInsert("salePriceList"));
            }
            dispatch(actions.supplierBaseLoading(false));
            return json;
        });
    },
    supplierDetail: (data) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('materialBaseSource', data)
            .set('isTax', data.isTax)
            .set('salePriceEditDetail', data);
        dispatch({ type: SALEPRICEREDU, state });
    },
    // supplierEditData: (data) => (dispatch, getState) => {
    //     let state = getState()[SALEPRICEREDU].set('Record', data)
    //     dispatch({ type: SALEPRICEREDU, state });
    // },
    detailPriceList: (data) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('priceList', data)
        dispatch({ type: SALEPRICEREDU, state });
    },
    //新建销售价格清单
    AddSalePrice: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.supplierLoading(true));
        return ReqApi.post({
            url: BusinessUrls.SALEPRICE_ADD,
            pm
        }).then(json => {
            if (json.status === 2000) {
                message.success("新增成功");
            }
            dispatch(actions.supplierLoading(false));

            return json;
        })
    },
    //主列表-新建
    SalePriceAdd: () => (dispatch, getState) => {
        let detail = {
            orderCode: "",
            startTime: "",
            endTime: "",
            currencyCode: "",
            priceName: "",
            orderStatus: 0,
            includeTaxFlag: 1,
            taxRate: "17",
            remark: "",
            list: [],
            isTax: 1
        };
        let state = getState()[SALEPRICEREDU].setIn(["salePriceAddDetail", 'detail'], detail);
        dispatch({ type: SALEPRICEREDU, state });
    },

    checkOrderStatus: (pm = {}) => (dispatch, getState) => {
        return ReqApi.post({
            url: BusinessUrls.CHECKORDERSTATUS,
            pm,
            callBack: true
        }).then(json => {
            return json;
        })
    },

    SalePriceAddDataSource: (data) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('salePriceAddDataSource', data)
        dispatch({ type: SALEPRICEREDU, state });
    },

    EditSalePrice: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.supplierLoading(true));
        return ReqApi.post({
            url: BusinessUrls.SALEPRICE_UPDATE,
            pm
        }).then(json => {
            dispatch(actions.supplierLoading(false));
            return json;
        })
    },
    delMaterial: (pm = {}) => (dispatch, getState) => {
        return ReqApi.post({
            url: BusinessUrls.SALEPRICE_DELETE,
            pm
        }).then(json => {
            return json;
        })
    },

    //改变状态接口
    SalePriceStatus: (status, pm = {}) => (dispatch, getState) => {
        dispatch(actions.supplierBaseLoading(true));
        return ReqApi.post({
            url: BusinessUrls.SALEPRICE_STATUS(status),
            pm
        }).then((json) => {
            if (json.status == 2000) {
                dispatch(actions.getSupplierData({ orderCode: pm.orderCode }));
                return json;
            }
            dispatch(actions.supplierBaseLoading(false));

        });
    },

    //提交
    SalePriceSubmit: (pm = {}) => (dispatch, getState) => {
        return ReqApi.post({
            url: BusinessUrls.SALEPRICE_SUBMIT,
            pm,
            callBack: true
        }).then(json => {
            return json;
        })
    },
    // //撤回
    SalePriceRepeal: (pm = {}) => (dispatch, getState) => {
        return ReqApi.post({
            url: BusinessUrls.SALEPRICE_REPEAL,
            pm
        }).then(json => {
            if (json.status === 2000) {
                message.success("撤回成功");
                // dispatch(actions.SalePriceList());
            }
            return json;
        })
    },
    //  //驳回
    // SalePriceReject:(pm={})=>(dispatch, getState)=>{
    //     return ReqApi.post({
    //         url: BusinessUrls.SALEPRICE_REJECT,
    //         pm
    //     }).then(json => {
    //         if (json.status === 2000) {
    //             message.success("驳回成功");
    //             dispatch(actions.SalePriceList());
    //         }
    //         return json;
    //     })
    // },
    //编码规则
    GetCodeRule: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: Urls.GET_CODERULE,
            pm
        }).then(json => {
            // if (json.status === 2000) {
            //     let state = getState()[SALEPRICEREDU].set('materialCodeRule', json.data.ruleType)
            //         .set('materialBaseSource', {})
            //     dispatch({ type: SALEPRICEREDU, state });
            // }
            return json;
        })
    },
    SourceCodeDilog: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('sourceCodeDilog', value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    SaleOrderAddTableVisiable: (value, type) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set(`${type}_table_visiable`, value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    SourceEditDilog: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].set('sourceEditDilog', value);
        dispatch({ type: SALEPRICEREDU, state });
    },

    SalePriceTableList: (pm = {}) => (dispatch, getState) => {
        return ReqApi.post({
            url: BusinessUrls.SALEPRICE_GETDETAIL,
            pm
        }).then(json => {
            if (json.status == 2000) {
                let { list, total, page, pageSize } = json.data;
                let state = getState()[SALEPRICEREDU].set('dataPriceList', list)
                    .set("paging", { total, current: page, pageSize });
            }

        })
    },
    //详情-复制
    SalePriceCopy: (detail) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].setIn(["salePriceAddDetail", 'detail'], detail);
        dispatch({ type: SALEPRICEREDU, state });
    },
    //导入
    ImportViewLoading: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].setIn(['import', 'importViewLoading'], value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    Percent: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].setIn(['import', 'percent'], value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    AlertVisible: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].setIn(['import', 'alertVisible'], value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    ProgressVisible: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].setIn(['import', 'progressVisible'], value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    ImportViewVisiable: (value) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].setIn(['import', 'importViewVisiable'], value);
        dispatch({ type: SALEPRICEREDU, state });
    },
    GetUpLoadFile: (data) => (dispatch, getState) => {
        let state = getState()[SALEPRICEREDU].setIn(['import', 'errorExcelUrl'], data.errorExcel);
        dispatch({ type: SALEPRICEREDU, state });
    },
    UpLoadFile: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.ImportViewLoading(true));
        return ReqApi.post({
            url: BusinessUrls.IMPORT_EXCEL,
            pm,
            callBack: true
        }).then((json) => {
            if (json.status === 2000) {
                dispatch(actions.ProgressVisible(true));
                message.success("导入成功");
            } else if (json.status === 4303) {
                message.error(json.data.errorMessage);
            } else if (json.status === 4304) {
                dispatch(actions.AlertVisible(true));
                dispatch(actions.GetUpLoadFile(json.data));
            } else {
                message.error(json.message[1].msg);
            }
            dispatch(actions.ImportViewLoading(false));
            return json;
        }).catch((e) => {
            dispatch(actions.ImportViewLoading(false));
        });
    },




}
export default actions;