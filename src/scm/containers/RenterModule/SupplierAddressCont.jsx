import React, { Component } from "react";
import { connect } from 'react-redux';
import { message } from '../../../base/components/AntdComp';
import SupplierAct from '../../actions/RenterModule/SupplierAct';
import SupplierAddressComp from '../../components/RenterModule/SupplierAddressComp';
import AddSupplierAddressCont from '../../dialogconts/RenterModule/AddSupplierAddressCont';
import EditSupplierAddressCont from '../../dialogconts/RenterModule/EditSupplierAddressCont';

class SupplierAddressCont extends Component {
    constructor(props) {
        super(props);
        this.searchPm = { uscc: props.supplierBaseSource.uscc, page: 1, pageSize: 10 };
    }
    
    tablePaging = (page) => {
        let { addressTabLoading, AddressList } = this.props;
        if (!addressTabLoading){
            if (typeof page === "number") {
                this.searchPm.page = page;
            } else {
                this.searchPm = { ...this.searchPm, ...page};
            } 
            AddressList(this.searchPm)
                
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.supplierBaseSource.supplierCode != this.props.supplierBaseSource.supplierCode) {
            this.searchPm = { uscc: nextProps.supplierBaseSource.uscc, page: 1, pageSize: 10 };
            this.tablePaging();
        }
    }
    
    onClear = () => {
        this.searchPm = { ...this.searchPm, page: 1, pageSize: 10 };
        this.tablePaging();
    }
    render() {
        let bpCode = this.props.supplierBaseSource.supplierCode,
            companyUscc = this.props.supplierBaseSource.scmBp.uscc;
        return(
            <div className="supplierAddress-content" style={{marginTop:10}}>
                <SupplierAddressComp {...this.props}
                    tablePaging={this.tablePaging}
                    onClear={this.onClear}
                />   
                <AddSupplierAddressCont
                    tablePaging={this.onClear}
                    bpCode={bpCode}
                    companyUscc={companyUscc}
                />
                <EditSupplierAddressCont
                    tablePaging={this.onClear}
                    bpCode={bpCode}
                    companyUscc={companyUscc}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => state.SupplierAddressRedu.toJS();

const mapDispatchToProps = (dispatch) => ({
    AddAddressVisiable: () => { dispatch(SupplierAct.AddAddressVisiable(true)); },
    EditAddressVisiable: (id) => { dispatch(SupplierAct.EditAddressVisiable(true, id)); },
    AddressList: (pm) => dispatch(SupplierAct.AddressList(pm)),
    AddressDisable: (id, status) => dispatch(SupplierAct.AddressDisable({ id, status })),
    AddressDelete: (id) => dispatch(SupplierAct.AddressDelete({ id }))
})

export default connect(mapStateToProps, mapDispatchToProps)(SupplierAddressCont);