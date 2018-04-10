//采购订单
import { ReqApi } from '../../../base/services/ReqApi'
import { PURCHASEREDU } from '../../consts/ActTypes';
import { Urls, MemberManage, BasicUrls } from '../../../base/consts/urls';
import PurchaseUrls from '../../consts/PurchaseUrls';
import BusinessUrls from '../../consts/BusinessUrls';
import SupplierUrls from '../../consts/SupplierUrls';
import { message } from '../../../base/components/AntdComp'
const PurchaseActions = {
    PurchaseList: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.TabLoading(true));
        return ReqApi.get({
            url: PurchaseUrls.PURCHASE_LIST,
            pm
        }).then((json) => {
            if (json.status == 2000) {
                dispatch(actions.GetPurchaseList(json.data));
            }

            dispatch(actions.TabLoading(false));
            return json;
        });
    },
    TabLoading: (value) => (dispatch, getState) => {
        let state = getState()[PURCHASEREDU].set('tabLoading', value);
        dispatch({ type: PURCHASEREDU, state });
    },
    PurchaseLoading: (value, type) => (dispatch, getState) => {
        let state = getState()[PURCHASEREDU].setIn([type, 'purchaseLoading'], value);
        dispatch({ type: PURCHASEREDU, state });
    },
    PurchaseViewLoading: (value) => (dispatch, getState) => {
        let state = getState()[PURCHASEREDU].set('purchaseViewLoading', value);
        dispatch({ type: PURCHASEREDU, state });
    },
    //概览Act-----------------------------------------------------------------
    PurchaseCode: (orderCode) => (dispatch, getState) => {
        let state = getState()[PURCHASEREDU].set('purchaserId',orderCode);
        dispatch({ type: PURCHASEREDU, state });
        // dispatch(actions.PurchaseViewTable({ orderCode: orderCode }));
    },
    PurchaseViewTable: (pm = {}) => (dispatch, getState) => {
        let orderCode = pm.orderCode;
        dispatch(actions.PurchaseViewLoading(true));
        return ReqApi.get({
            url: PurchaseUrls.GETDETAILBYCODE,
            pm
        }).then((json) => {
            if (json.status == 2000) {
                if (json.data) {
                    dispatch(actions.GetPurViewTableList(json.data, orderCode));
                }
            }
            dispatch(actions.PurchaseViewLoading(false));
            return json;
        });
    },
    GetPurViewTableList: (data, orderCode) => (dispatch, getState) => {
        let { list, total, page, pageSize } = data;
        let state = getState()[PURCHASEREDU].set('PurchaseViewData', data);
        dispatch({ type: PURCHASEREDU, state });
    },

    //----------------------------------------------------------------------------------------------- 
    GetPurchaseList: (data) => (dispatch, getState) => {
        let { list, total, page, pageSize } = data;
        let statusO = { status: '启用' }
        let statusN = { status: '禁用' }
        // for (let x in list) {
        //     if (list[x].status == '1') {
        //         Object.assign(list[x], statusO);
        //     } else {
        //         Object.assign(list[x], statusN);
        //     }
        // }

        let state = getState()[PURCHASEREDU].set('dataSource', list)
            .set("paging", { total, current: page, pageSize });
        dispatch({ type: PURCHASEREDU, state });
    },
    PurchaseDel: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.TabLoading(true));
        ReqApi.post({
            url: PurchaseUrls.PURCHASE_DEL,
            pm
        }).then(json => {
            if(json.status===2000){
                message.success("删除成功");
                dispatch(actions.PurchaseList({ page: 1, pageSize: 15 }))
            }
            dispatch(actions.TabLoading(false));
        })
    },

    /* ----------------------wuqiong--------------------------------------------*/

    CurList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.post({
            url: BasicUrls.CURRENCYLIST,
            pm
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'curList'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });
            }
        })
    },

    SupplierList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.post({
            url: PurchaseUrls.GET_SUPPLIER_LIST,
            pm,
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'supplierList'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });
            }
            return json;
        })
    },
    ShippingAddressList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.post({
            url: PurchaseUrls.GET_SHIPPINGADDRESS_LIST,
            pm,
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'shippingAddressList'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });
            }
        })
    },
    ReceiveAddressList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.GET_RECEIVEADDRESS_LIST,
            pm,
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'receiveAddressList'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });
            }
            return json
        })
    },
    ContactsList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.get({
            url: MemberManage.POSITION_INFO_LIST,
            pm: {deptCode:'0',...pm}
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'contactsList'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });
            }
        })
    },
    PurchaseOrgList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.COSTCENTER_LIST,
            pm,
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'purchaseOrgList'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });
            }
        })
    },
    SiteList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.post({
            url: Urls.SITE_LIST,
            pm,
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'siteList'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });
            }
        })
    },
    Buyerlist: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.get({
            url: MemberManage.POSITION_INFO_LIST,
            pm: {deptCode:'0',...pm}
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'buyerlist'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });

            }
        })
    },

    CostCenterList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.COSTCENTER_LIST,
            pm: { status: 1, ...pm }
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'costCenterList'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });
            }
        })
    },

    SettleList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.SETTLELIST,
            pm,
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'settleList'], json.data.list)
                dispatch({ type: PURCHASEREDU, state });
            }
        })
    },

    Paymentlist: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.post({
            url: BasicUrls.SUBJECT_LIST,
            pm
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'paymentList'], json.data.catList)
                dispatch({ type: PURCHASEREDU, state });
            }
        })
    },

    InvoiceTypeList: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.post({
            url: BasicUrls.SUBJECT_LIST,
            pm: {subCode:'C021',...pm}
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].setIn([type, 'invoiceTypeList'], json.data.catList)
                dispatch({ type: PURCHASEREDU, state });
            }
        })
    },

    MeasureList: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.GET_MEASURELIST,
            pm: { page: 1, pageSize: 10 }
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].set('measureList', json.data.list)
                dispatch({ type: PURCHASEREDU, state });
                return json.data.list;
            } else { return [] }
        })
    },
    MaterialAllUnit: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.GET_MATERIALLUNIT,
            pm,
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].set('measureAll', json.data.list)
                dispatch({ type: PURCHASEREDU, state });
                return json.data.list;
            } else { return [] }
        })
    },
    ExpenseList: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.GET_EXPENSELIST,
            pm: {status:1,...pm}
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].set('expenseTypeList', json.data.list)
                dispatch({ type: PURCHASEREDU, state });
                return json.data.list;
            } else { return [] }
        })
    },
    MaterialList: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.GET_MATERIALLIST,
            pm: { status: 1, materialCode: pm, materialName: pm, page: 1, pageSize: 10 }
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].set('materialList', json.data.list)
                dispatch({ type: PURCHASEREDU, state });
                return json.data.list;
            } else { return [] }
        })
    },
    MaterialList2: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.GET_MATERIALLIST,
            pm: {status:1,allowPurchase:0,...pm}
        }).then(json => {
            if (json.status === 2000) {
                let state = getState()[PURCHASEREDU].set('materialList', json.data.list)
                dispatch({ type: PURCHASEREDU, state });
                // return json.data.list;
            } 
            return json;
        })
    },
    IsBuyer: (pm = {}) => (dispatch, getState) => {
        return ReqApi.post({
            url: PurchaseUrls.CURRENTUSERINFO,
            pm,
            callBack: true
        }).then(json => {
            if (json.status === 2000) {
                if (json.data) {
                   let { empCode, deptCode, empName, deptName, empPhone } = json.data;
                    let state = getState()[PURCHASEREDU].set('defaultBuyer', { empCode, deptCode, empName, deptName, empPhone})
                    .setIn(['add', 'orgCode'], deptCode);
                    dispatch(actions.Buyerlist({ deptCode: '0', status:1, page: 1, pageSize: 10 }, 'add'));
                    dispatch({ type: PURCHASEREDU, state });
                    return json;
                }
            }
        })
    },

    AddPurchase: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.PurchaseLoading(true, 'add'));
        return ReqApi.post({
            url: PurchaseUrls.ADD_PURCHASE,
            pm
        }).then(json => {
            dispatch(actions.PurchaseLoading(false, 'add'));
            return json;

        })
    },

    EditPurchase: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.PurchaseLoading(true, 'edit'));
        // let orderCode = getState()[PURCHASEREDU].get('purchaserId');
        return ReqApi.post({
            url: PurchaseUrls.UPDATE_PURCHASE,
            pm,
        }).then(json => {
            dispatch(actions.PurchaseLoading(false, 'edit'));
            return json;

        })
    },
    SiteDetail: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.SITE_DETAIL,
            pm,
        }).then(json => {
            if (json.status === 2000) {
                
            }
            return json;
        });
    },
    PurchaseDetail: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.PurchaseLoading(true, 'edit'));
        return ReqApi.get({
            url: PurchaseUrls.GETDETAILBYCODE,
            pm
        }).then((json) => {
            if (json.status == 2000) {
                let state = getState()[PURCHASEREDU].set('purchaserId', pm.orderCode);
                dispatch({ type: PURCHASEREDU, state });
                if (json.data) {
                    let { supplierCode, deptCode, deliveryAddressCode, empCode, receiveAddressCode, receiverCode, paymentTerm, siteCode, paymentMethod, invoiceType, currencyCode,orderType,purchaseType } = json.data;
                    if (orderType === null) {
                        json.data.orderType = 1;
                    }
                    if (purchaseType === null) {
                        json.data.purchaseType = 0;
                    }
                    let page = { page: 1, pageSize: 10 };
                    let state = getState()[PURCHASEREDU].set('purchaseDetail', json.data).set('supplierCode', supplierCode).setIn(['edit', 'orgCode'], deptCode);
                    dispatch(actions.SupplierList({ status: -1, supplierCode: supplierCode, ...page }, 'edit'));//供应商
                    if (deliveryAddressCode) {
                        dispatch(actions.ShippingAddressList({ bpCode: supplierCode, status:-1, addressCode: deliveryAddressCode, ...page }, 'edit'));//发货地址
                    } else {
                        dispatch(actions.ShippingAddressList({ bpCode: supplierCode, status:1, addressCode: deliveryAddressCode, ...page }, 'edit'));//发货地址
                    }
                    if (deptCode) {
                        dispatch(actions.PurchaseOrgList({ orgCode: deptCode, ...page }, 'edit'));//采购部门
                    } else {
                        dispatch(actions.PurchaseOrgList({ orgCode: deptCode, ...page, status:1 }, 'edit'));//采购部门
                    }
                    if (receiveAddressCode) {
                        dispatch(actions.ReceiveAddressList({ addressCode: receiveAddressCode, ...page }, 'edit'));//收货地址
                    } else {
                        dispatch(actions.ReceiveAddressList({ addressCode: receiveAddressCode, status:1, ...page }, 'edit'));//收货地址
                    }
                    if (paymentTerm) {
                        dispatch(actions.Paymentlist({ subCode: 'C013',  catCode: paymentTerm, catName:'', ...page }, 'edit'));//付款条件
                    } else {
                        dispatch(actions.Paymentlist({ subCode: 'C013', catCode: paymentTerm, status:1, ...page }, 'edit'));//付款条件
                    }
                    if (paymentMethod) {
                        dispatch(actions.SettleList({ settleCode:paymentMethod, ...page }, 'edit'));//结算方式
                    } else {
                        dispatch(actions.SettleList({ settleCode:paymentMethod,status:1, ...page }, 'edit'));//结算方式
                    }
                    if (invoiceType) {
                        dispatch(actions.InvoiceTypeList({ catCode: invoiceType,catName:'', ...page }, 'edit'));//发票类型
                    } else {
                        dispatch(actions.InvoiceTypeList({ catCode: invoiceType, status:1, ...page }, 'edit'));//发票类型
                    }
                    if (receiverCode) {
                        dispatch(actions.ContactsList({ employeeCode: receiverCode, ...page }, 'edit'));//收货人
                    } else {
                        dispatch(actions.ContactsList({ employeeCode: receiverCode, status:1, ...page }, 'edit'));//收货人
                    }
                    if (empCode) {
                        dispatch(actions.Buyerlist({ employeeCode: empCode, ...page }, 'edit'));//业务员
                    } else {
                        dispatch(actions.Buyerlist({ employeeCode: empCode, status:1, ...page }, 'edit'));//业务员
                    }
                    dispatch(actions.CurList({ curCode: currencyCode, ...page }, 'edit'));//币种
                    dispatch(actions.SiteList({ siteCode: siteCode,siteName:siteCode, ...page }, 'edit'));//收货站点
                    dispatch({ type: PURCHASEREDU, state });
                }

            }
            dispatch(actions.PurchaseLoading(false, 'edit'));
        })
    },

    CanPurchaseEdit: (pm = {}, type) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.CAN_PURCHASE_EDIT,
            pm
        }).then(json => {
            if (json.status === 2000) {
                if (type) {
                    let state = getState()[PURCHASEREDU].set('purchaserId', pm.orderCode).set('sourceType', type);
                    dispatch({ type: PURCHASEREDU, state });
                }
            }
            return json;
        })
    },

    DeleteData: (value, type) => (dispatch, getState) => {
        let state;
        if (value == 'siteCode') {
            // state = getState()[PURCHASEREDU].setIn([type, 'receiveAddressList'], []);
        } else {
            state = getState()[PURCHASEREDU].setIn([type, 'shippingAddressList'], []);
        }

        dispatch({ type: PURCHASEREDU, state });
    },

    GetSelectData: () => (dispatch, getState) => {
        dispatch(actions.PurchaseLoading(true, 'add'));
        let page = { page: 1, pageSize: 10 };
        let p1, p2, p3, p4, p5, p6, p7,p8,p9,p10;
        p1 = dispatch(actions.SupplierList({status:1,supplierType:1,...page}, 'add')),
        p2 = dispatch(actions.CurList({status:1,...page}, 'add')),
        p3 = dispatch(actions.SiteList({status:1,...page}, 'add')),//isSog:1
        p4 = dispatch(actions.SettleList({status:1,...page}, 'add')),
        p5 = dispatch(actions.PurchaseOrgList({status:1,...page}, 'add')),
        p6 = dispatch(actions.Paymentlist({ subCode: 'C013', status: 1, ...page }, 'add')),//结算方式
        p7 = dispatch(actions.IsBuyer());
        p8 = dispatch(actions.ContactsList({status:1,...page}, 'add')); 
        p9 = dispatch(actions.InvoiceTypeList({status:1,...page}, 'add'));
        p10 = dispatch(actions.ReceiveAddressList({status:1,...page}, 'add'));//收货地址    
        Promise.all([p1, p2, p3, p4, p5, p6, p7, p8,p9,p10]).then(function () {
            dispatch(actions.PurchaseLoading(false, 'add'));
        })

    },

    PurchaseStatus: (status, pm = {}) => (dispatch, getState) => {
        return ReqApi.post({
            url: PurchaseUrls.PURCHASE_STATUS(status),
            pm,
            callBack: true
        }).then((json) => {
            if (json.status == 2100 || json.status == 2200 || json.status == 2300 || json.status == 2400) {
                // dispatch(actions.PurchaseCode(pm.orderCode))
            }
            return json
        });
    },

    GetCodeRule: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: Urls.GET_CODERULE,
            pm
        }).then(json => {
            return json;
        })
    },   
    //明细行弹框
    DetailLineVisible: (type, dtype, value) => (dispatch, getState) => {
        let state = getState()[PURCHASEREDU].setIn([type,'dialog',dtype,'visible'], value);
        dispatch({ type: PURCHASEREDU, state });
    },
    //费用明细弹窗
    ExpenseVisible: (type,dtype,value) => (dispatch, getState) => {
        let state = getState()[PURCHASEREDU].setIn([type,'expenseShow',dtype,'visible'], value);
        dispatch({ type: PURCHASEREDU, state });
    },
    //电商下来编辑页面费用明细弹窗
    ExpenseDetailVisible: (type,value) => (dispatch, getState) => {
        let state = getState()[PURCHASEREDU].setIn([type,'expenseDetailVisible'], value);
        dispatch({ type: PURCHASEREDU, state });
    },

    AddressDetail: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: PurchaseUrls.GET_ADDRESSDETAIL,
            pm
        }).then(json => {
            return json;
        })
    },   
}
const actions = {
    ...PurchaseActions,
}
export default actions;