import { ReqApi } from '../../../base/services/ReqApi'
import BusinessUrls from '../../consts/BusinessUrls';
import { BasicUrls } from '../../../base/consts/urls';
import { BUSINESSREDU } from '../../consts/ActTypes';

const page = { page: 1, pageSize: 10 };
const actions = {
        BusinessTabLoading:(value)=>(dispatch,getState)=>{
            let state=getState()[BUSINESSREDU].set('businessTabLoading',value);
            dispatch({type:BUSINESSREDU,state});
        },
        BusinessEditLoading:(value)=>(dispatch,getState)=>{
            let state=getState()[BUSINESSREDU].setIn(['edit','loading'],value);
            dispatch({type:BUSINESSREDU,state});
        },
        BusinessPartnerLoading:(value)=>(dispatch,getState)=>{
            let state=getState()[BUSINESSREDU].set('businessPartnerTabLoading',value);
            dispatch({type:BUSINESSREDU,state});
        },
        ContactTabLoading:(value)=>(dispatch,getState)=>{
            let state=getState()[BUSINESSREDU].set('contactTabLoading',value);
            dispatch({type:BUSINESSREDU,state});
        },
        AddressTabLoading:(value)=>(dispatch,getState)=>{
            let state=getState()[BUSINESSREDU].set('addressTabLoading',value);
            dispatch({type:BUSINESSREDU,state});
        },
        BusinessList:(pm={})=>(dispatch,getState)=>{
            dispatch(actions.BusinessTabLoading(true));
            return ReqApi.post({
                url: BusinessUrls.BUSINESS_LIST,//商业伙伴列表
                pm
            }).then((json)=>{
                if(json.status===2000){
                    dispatch(actions.GetBusinessList(json.data));
                }
                dispatch(actions.BusinessTabLoading(false));
                return json;
            });
        },
        GetBusinessList:(data)=>(dispatch,getState)=>{
            let{list,total,page,pageSize}=data;
            let state=getState()[BUSINESSREDU].set('dataSource',list)
                .set("paging",{total,current:page,pageSize});
            dispatch({type:BUSINESSREDU,state});
        },
        BusinessDetailsId:(id,uscc)=>(dispatch,getState)=>{
            let state = getState()[BUSINESSREDU].set('uscc', uscc);
            dispatch({type:BUSINESSREDU,state});
            dispatch(actions.BusinessDetailsShow({id:id}));
            dispatch(actions.BusinessDetailsContact({uscc:uscc,page: 1,pageSize: 10}));
            dispatch(actions.BusinessDetailsAddress({uscc:uscc,page: 1,pageSize: 10}));
        },
        BusinessBase:(data)=>(dispatch,getState)=>{
             let state = getState()[BUSINESSREDU].set('businessBase', data);
             dispatch({ type: BUSINESSREDU, state });
        },
        BusinessDetailsShow:(pm={})=>(dispatch,getState)=>{
            dispatch(actions.BusinessPartnerLoading(true));
            return ReqApi.post({
                    url: BusinessUrls.BUSINESS_BASE,//除列表以外
                    pm
                }).then(json => {
                    if (json.status === 2000) {
                        if (json.data) {
                            dispatch(actions.BusinessBase(json.data));
                        }
                    }
                    dispatch(actions.BusinessPartnerLoading(false));
                    return json;
                })
        },
        GetBusinessContactList:(data)=>(dispatch,getState)=>{
            let { list, total, page, pageSize } = data;
            let state=getState()[BUSINESSREDU].set('dataContactSource',list)
                .set("contactPaging",{total,current:page,pageSize});
            dispatch({type:BUSINESSREDU,state});
        },
        BusinessDetailsContact:(pm={})=>(dispatch,getState)=>{
            dispatch(actions.ContactTabLoading(true));
            return ReqApi.post({
                url: BusinessUrls.BUSINESS_CONTACTLIST,//获取联系人列表
                pm
            }).then(json=>{
                if(json.status===2000){
                    dispatch(actions.GetBusinessContactList(json.data));
                }
                dispatch(actions.ContactTabLoading(false));
                return json;
            })
        },
        GetBusinessAddressList:(data)=>(dispatch,getState)=>{
            let{list,total,page,pageSize}=data;
            let state=getState()[BUSINESSREDU].set('dataAddressSource',list)
                .set("addressPaging",{total,current:page,pageSize});
            dispatch({type:BUSINESSREDU,state});
        },
        BusinessDetailsAddress:(pm={})=>(dispatch,getState)=>{
            dispatch(actions.AddressTabLoading(true));
            return ReqApi.post({
                url: BusinessUrls.BUSINESS_ADDRESSLIST,//获取地址列表
                pm
            }).then(json=>{
                if(json.status===2000){
                    dispatch(actions.GetBusinessAddressList(json.data));
                }
                dispatch(actions.AddressTabLoading(false));
                return json;
            })
        },

        //编辑商业伙伴
        Editbusiness: (pm = {}) => (dispatch, getState) => {
            dispatch(actions.BusinessEditLoading(true));
            let id = getState()[BUSINESSREDU].getIn(['edit','current']);
            return ReqApi.post({
                url: BusinessUrls.BUSINESS_UPDATE,
                pm: { ...pm, id }
            }).then(json => {
                dispatch(actions.BusinessEditLoading(false));
                return json;
    
            })
        },
        //当前商业伙伴id
        BusinessId: (value) => (dispatch, getState) => {
            let state = getState()[BUSINESSREDU].setIn(['edit', 'current'], value);
            dispatch({ type: BUSINESSREDU, state });
        },
        //商业伙伴编辑详情
        BusinessDetail:(pm={})=>(dispatch,getState)=>{
            dispatch(actions.BusinessEditLoading(true));
            return ReqApi.get({
                url: BusinessUrls.BUSINESS_BASE,//除列表以外
                pm
            }).then(json => {
                if (json.status === 2000) {
                    if (json.data) {
                        let data = json.data;
                        let { businessTypeCode, companyScaleCode, companyTypeCode } = data;
                        data.bpRole = [];
                        if (data.isSupplier == 1) 
                            data.bpRole.push("isSupplier");
                        if (data.isCustomer == 1) 
                            data.bpRole.push("isCustomer");
                        if (data.isBank == 1) 
                            data.bpRole.push("isBank");
                        let state=getState()[BUSINESSREDU].setIn(['edit','detail'],data)
                        dispatch({ type: BUSINESSREDU, state });
                        dispatch(actions.EditInitData({ subCode: 'C016', catCode: companyScaleCode }, 'companyScaleList'));
                        dispatch(actions.EditInitData({ subCode: 'C018', catCode: companyTypeCode }, 'companyTypeList'));
                        dispatch(actions.EditInitData({ subCode: 'C019', catCode: businessTypeCode }, 'businessTypeList'));
                        // dispatch(actions.EditInitData({ subCode: 'C015', catCode: tradeTypeCode }, 'tradeTypeList'));
                    }
                }
                dispatch(actions.BusinessEditLoading(false));
                return json;
            })
        },

        //获取公司规模，行业等下拉列表
        EditInitData:(pm={},list)=>(dispatch,getState)=>{
            return ReqApi.post({
                url: BasicUrls.SUBJECT_LIST,
                pm: {status:1,...page,...pm}
            }).then(json => {
                if (json.status === 2000) {
                    let state = getState()[BUSINESSREDU].setIn(['edit',list],json.data.catList)
                    dispatch({ type: BUSINESSREDU, state });
                }
            })
         },
}
export default actions;