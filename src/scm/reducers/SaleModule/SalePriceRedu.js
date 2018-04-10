import { fromJS } from 'immutable';
import { SALEPRICEREDU } from '../../consts/ActTypes';

let initState = fromJS({
    add_table_visiable: false,//表格
    edit_table_visiable: false,
    currencySource: [],
    editCurrencySource: [],
    isTax: '',
    priceloading: false,
    tabLoading: false,
    loading: false,
    edit_supplier_visiable: false,
    dataSource: [],
    dataSourceMaterial: [],
    add_supplier_visiable: false,
    materialLoading: false,
    componentMsg: false,
    Record: {},
    hiddenVisible: false,
    materialBaseSource: {
        orderCode: "",
        priceName: "",
        supplierCode: '',
        supplierName: "",
        currency: "",
        currencyName: "",
        startTime: "",
        endTime: "",
        orderStatus: 0,
        isTax: 0,
        taxRate: 2.9,
        remark: '',
    },
    supplierBaseLoading: false,
    editLoading: false,
    ContactData: [],
    dept_Name: {},
    businessPartner: [],
    empList: [],
    curList: {},
    orderCode: null,
    supplierLoading: false,
    saleReturn_visiable: false,
    sourceCodeDilog: false,
    sourceEditDilog: false,
    add_site_visiable: false,
    priceList: {},
    materialCodeRule: '',
    salePriceAddDetail: {
        list: [],
        detail:{}
    },
    salePriceEditDetail: {
        list: []
    },
//导入
import:{
        importViewLoading:false,
        importViewVisiable:false,
        progressVisible:false,
        percent:0,
        errorExcelUrl:"",
        alertVisible:false,
    }

});

const SalePriceRedu = (state = initState, action) => {
    switch (action.type) {
        case SALEPRICEREDU:
            return action.state;
        default:
            return state;
    }
}

export default SalePriceRedu;