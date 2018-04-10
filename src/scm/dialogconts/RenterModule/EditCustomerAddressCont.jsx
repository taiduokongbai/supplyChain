import React,{Component} from "react";
import { Modal, message, Tabs } from "../../../base/components/AntdComp";
import ModalComp from '../../../base/components/ModalComp';
import EditSupplierAddressComp from '../../components/RenterModule/EditSupplierAddressComp';
import CustomerAct from '../../actions/RenterModule/CustomerAct';
import { connect } from 'react-redux';
import LinkAgeStore from '../../../base/stores/LinkAgeStore';

class EditCustomerAddressCont extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.linkStore = new LinkAgeStore();
    }
    
    getFooter = () => { 
        return null;
    };
    initData = () =>{
        let {loading, AddressDetail, addressId, handleCancel } = this.props;
        let pm = {id:addressId};
        if (!loading && addressId) {
            AddressDetail(pm).then(json => {
                if (json.status === 2000) {
                    let data = json.data;
                } else if (json.status === 4352) {
                    message.warn('获取地址详情失败!');
                    handleCancel();
                };
            }).then(() => {
                this.linkStore.initData();
            });
        }
    } 
    handleSubmit = (data) => {
        let { handleSubmit, handleCancel, tablePaging } = this.props;
        handleSubmit(data).then(json => {
            if (json.status === 2000) {
                handleCancel();
                tablePaging();
            };
        });
    }
    getComp = () => {
        
        let { visible } = this.props;
        return (
            visible ?
                <div className="supplierAddress-content">
                    <EditSupplierAddressComp
                        {...this.props}
                        onOK={this.handleSubmit}
                        initData={this.initData}  
                        key='4353445345'
                        store={this.linkStore}
                    />
                </div>
                 : null 
        )
    }  
    
}

EditCustomerAddressCont.defaultProps={
    title: '编辑地址',
    okText: '保存',
    width: 800,
    className: 'chooseaddress',
    maskClosable: true,
}
const mapStateToProps = (state) => ({
    visible: state.CustomerAddressRedu.get('edit_address_visiable'),
    loading: state.CustomerAddressRedu.get('addressLoading'),
    detail: state.CustomerAddressRedu.get('detail'),
    addressId: state.CustomerAddressRedu.get('addressId'),
})

const mapDispatchToProps = (dispatch) => ({
    handleCancel: () => { dispatch(CustomerAct.EditAddressVisiable(false)) },
    handleSubmit: (data) =>  dispatch(CustomerAct.EditAddress(data)) ,
    AddressDetail: (pm) =>  dispatch(CustomerAct.AddressDetail(pm)) ,
})

export default connect(mapStateToProps,mapDispatchToProps)(EditCustomerAddressCont);