import { fromJS } from 'immutable';
import { BUSINESSREDU }from '../../consts/ActTypes';

let initState = fromJS({
    businessTabLoading:false,
    businessPartnerTabLoading:false,
    contactTabLoading:false,
    addressTabLoading:false,
    dataSource:[],
    dataContactSource:[],
    dataAddressSource:[],
    record:{},
    businessId:'',
    record_contact:{},
    record_address:{},
    businessBase: {},
    contactPaging: {},
    addressPaging: {},
    paging: {},
    //编辑商业伙伴
    edit: {
        current: '',
        loading: false,
        detail: {},
        // tradeTypeList: [],
        businessTypeList: [],
        companyScaleList: [],
        companyTypeList: [],
    }

});

const BusinessRedu = (state = initState, action) => {
    switch (action.type) {
        case BUSINESSREDU:
            return action.state;
        default:
            return state;
    }
}

export default BusinessRedu;