//采购订单
import { fromJS } from 'immutable';
import { PURCHASEREDU } from '../../consts/ActTypes';

let initState = fromJS({
    tabLoading: false,
    dataSource: [],
    Record: {},
    hiddenVisible: false,
    purchaseBaseSource: { list: [] },
    purchaseViewLoading: false,
    PurchaseViewData: {},//概览表格数据
    purchaserId: '',
    defaultBuyer: {},
    purchaseDetail: {},
    sourceType: '',
    supplierCode: '',
    materialList: [],
    expenseTypeList: [],
    measureAll: [],
    view: {
        expenseDetailVisible:false,
    },
    add: {
        expenseShow: {
            add: { visible: false,  },
            edit: { visible: false, },
        },
        expenseVisible:false,
        supplierList: [],
        shippingAddressList: [],
        receiveAddressList:[],
        contactsList: [],
        buyerlist: [],
        siteList: [],
        purchaseOrgList: [],
        curList: [],
        costCenterList: [],
        settleList: [],
        measurelist: [],
        paymentList: [],
        invoiceTypeList:[],
        purchaseLoading: false,
        orgCode: '',
        dialog: {
            add: { visible: false, },
            edit: { visible: false, },
        }
    },
    edit: {
        expenseShow: {
            add: { visible: false, },
            edit: { visible: false, },
        },
        expenseDetailVisible:false,
        supplierList: [],
        shippingAddressList: [],
        receiveAddressList:[],
        contactsList: [],
        buyerlist: [],
        siteList: [],
        purchaseOrgList: [],
        curList: [],
        costCenterList: [],
        settleList: [],
        measurelist: [],
        paymentList: [],
        invoiceTypeList:[],
        purchaseLoading: false,
        orgCode: '',
        dialog: {
            add: { visible: false, },
            edit: { visible: false, },
        }
    }
});

const PurchaseRedu = (state = initState, action) => {
    switch (action.type) {
        case PURCHASEREDU:  
            return action.state;
        default:
            return state;
    }
}

export default PurchaseRedu;