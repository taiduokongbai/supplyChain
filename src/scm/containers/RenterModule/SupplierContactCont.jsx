import React, { Component } from "react";
import { connect } from 'react-redux';
import { message } from '../../../base/components/AntdComp';
import SupplierAct from '../../actions/RenterModule/SupplierAct';
import SupplierContactComp from '../../components/RenterModule/SupplierContactComp';


class SupplierContactCont extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            searchPm: {
                page: 1, pageSize: 10
            }
        };
        
    }
    tablePaging = (page,uscc) => {
        const { contactTabLoading, ContactList } = this.props;
        if (!contactTabLoading) {
            if (typeof page === "number") {
                this.state.searchPm.page = page;
            } else {
                this.state.searchPm = { ...this.state.searchPm, ...page };
            };
            this.state.searchPm.uscc=this.props.uscc||uscc
            ContactList(this.state.searchPm);
        }
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.supplierId != this.props.supplierId) {
            this.state.searchPm = { bpCode: nextProps.supplierId, page: 1, pageSize: 10 };
            this.tablePaging(1);
        }
    }
    render() {
        return (
            <div className="address-content">
                <SupplierContactComp
                    {...this.props}
                    tablePaging={this.tablePaging}
                    isDefault={true}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => state.SupplierRedu.toJS();
const mapDispatchToProps = (dispatch) => ({
    ContactList: (pm) => dispatch(SupplierAct.ContactList(pm)),
    ContactAddEdit: (pm) => dispatch(SupplierAct.ContactAddEdit(pm)),
    ContactStatus: (pm) => dispatch(SupplierAct.ContactStatus(pm)),
    ContactDelete:(pm)=>dispatch(SupplierAct.ContactDelete(pm)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SupplierContactCont);
