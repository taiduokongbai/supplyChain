import React,{Component} from "react";
import { Modal, message } from '../../../base/components/AntdComp.js';
import { connect } from 'react-redux';
import ImportViewComp from '../../components/SaleModule/ImportViewComp';
import SalePriceListAct from '../../actions/SaleModule/SalePriceListAct';


class ImportViewCont extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            visible:false,
            percent:0
        } 
    }
    PercentFun = () => {
        let percent =  this.state.percent;      
        if (percent >= 100) {
            percent = 100;
            clearInterval(this.interval)
        }else{
            percent = this.state.percent + 20;
        }
        this.setState({percent})    
        this.props.Percent(percent)  
    }
    handleSubmit = (data) => {
        this.props.UpLoadFile(data).then(json=>{
            if(json.status==2000){
                this.interval = setInterval(this.PercentFun,100)
                this.props.importCallback(json.data)
                setTimeout(()=>{
                    this.props.ImportViewVisiable(false)
                    this.props.ProgressVisible(false)
                    this.props.Percent(0)
                    this.setState({percent:0})
                },1000)
            }
        })
    }
    render() {
        const { importViewVisiable,importViewLoading} = this.props.import;
        return (
            <div>
                {importViewVisiable ?
                <ImportViewComp
                    {...this.props}
                    onOk={this.handleSubmit}
                    visible={importViewVisiable}
                    loading={importViewLoading}
                /> : null}
            </div>
            
        );
    }
}

const mapStateToProps = (state) => state.SalePriceRedu.toJS()

const mapDispatchToProps = (dispatch) => ({
    ProgressVisible:(value)=>{dispatch(SalePriceListAct.ProgressVisible(value))},
    Percent:(number)=>{dispatch(SalePriceListAct.Percent(number))},
    AlertCancel:()=>{dispatch(SalePriceListAct.AlertVisible(false))},
    handleCancel:()=>{dispatch(SalePriceListAct.ImportViewVisiable(false))},
    ImportViewVisiable:(value)=>{dispatch(SalePriceListAct.ImportViewVisiable(value))},    
    UpLoadFile: (data) => { return dispatch(SalePriceListAct.UpLoadFile(data)) },

})


export default connect(mapStateToProps,mapDispatchToProps)(ImportViewCont);
