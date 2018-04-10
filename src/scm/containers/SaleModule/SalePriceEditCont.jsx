import React,{Component} from "react";
import { connect } from 'react-redux';
import SalePriceListAct from '../../actions/SaleModule/SalePriceListAct';
import SalePriceEditComp from '../../components/SaleModule/SalePriceEditComp';
import TabsAct from '../../actions/TabsAct';

class SalePriceEditCont extends Component{
    constructor(props, context) {
        super(props, context);
        
    }
    
    handleSubmit = (data) => {
        const { loading, handleSubmit, handleCancel,salePriceEditDetail, getEditData, materialBaseSource,tabAdd, tabRemove,supplierloading,showComponentMsg } = this.props;
        handleSubmit(data).then(json => {
            if (json.status == "2000") {
                getEditData(salePriceEditDetail.orderCode);
                this.props.tabAdd();
                this.props.tabRemove();
            }
        }); 
    }

    render() {
         const { visible, supplierloading } = this.props;
        return (
                <SalePriceEditComp
                    {...this.props}
                    onOk={this.handleSubmit}
                    loading={supplierloading}
                    salePriceInfo={this.props.salePriceEditDetail}
                   // initData={this.initData}
                />
        );
    }
}

SalePriceEditCont.defaultProps = {
    title: "编辑销售价格清单",
    width: 800,
    typePage:'edit'
}

const mapStateToProps = (state) => {
    return state.SalePriceRedu.toJS();
}
const mapDispatchToProps = (dispatch, ownProps) => ({
        supplierloading: (pm)=>{dispatch(SalePriceListAct.supplierLoading(pm))},
        SourceCodeDilog:(value) => dispatch(SalePriceListAct.SourceCodeDilog(value)),   
        SourceEditDilog:(value) => dispatch(SalePriceListAct.SourceEditDilog(value)),
        detailPriceList:(data)=> dispatch(SalePriceListAct.detailPriceList(data)),
        CheckIsTax:(value)=>dispatch(SalePriceListAct.CheckIsTax(value)),
        SalePriceAddDataSource:(data)=> dispatch(SalePriceListAct.SalePriceAddDataSource(data)),
        getEditData:(orderCode)=>dispatch(SalePriceListAct.getSupplierData({orderCode})),
        handleSubmit: (data) => { return dispatch(SalePriceListAct.EditSalePrice(data)) },
        tabAdd: () => {
            dispatch(TabsAct.TabAdd({
                title:"销售价格清单详情",
                key:"salePriceDetail"
            }));
        },
        tabRemove: () =>{
            dispatch(TabsAct.TabRemove("salePriceEdit","salePriceDetail"));
        },
        SaleOrderAddTableVisiable: (value, type) => dispatch(SalePriceListAct.SaleOrderAddTableVisiable(value, type)),
        checkOrderStatus:()=>{ return dispatch(SalePriceListAct.checkOrderStatus()) },
        ImportViewVisiable:(value)=>{dispatch(SalePriceListAct.ImportViewVisiable(value))}, 
})


export default connect(mapStateToProps,mapDispatchToProps)(SalePriceEditCont);