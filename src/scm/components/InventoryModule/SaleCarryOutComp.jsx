import React,{Component} from "react";
import { Form, Input, Button ,Select,Tabs , Spin} from '../../../base/components/AntdComp';
import SaleCarryOutOrderInfoComp from "./SaleCarryOutOrderInfoComp"
import SaleCarryOutDistributeInfoComp from "./SaleCarryOutDistributeInfoComp"
import {formatNullStr} from '../../../base/consts/Utils'
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class SaleCarryOutComp extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            sendLoading:false,
            text:"收起",
            putAway:"展开更多隐藏信息",
            infoClassName:"sale-carryout-info sale-carryout-info-show",
            putAwayClassName:"sale-carryout-info-down sale-carryout-info-down-hide",
            count:0,
            index:0,
        }
        this.DistributePagePm = {page:1,pageSize:10,outCode:props.outCode,isPage:0,status:1}
        this.OrderPagePm = {page:1,pageSize:10,outCode:props.outCode}
    }
    sendSubmit=(e)=>{
        e.preventDefault();
        if(!this.state.sendLoading){
            this.props.form.validateFields((err, data) => {
                if (!err) {
                    this.setState({
                        sendLoading:true
                    })
                    setTimeout(()=>{
                        this.setState({
                            sendLoading:false
                        })
                    data = {orderCode:this.props.dataSource.orderCode,remarks:data.remarks}
                    this.props.ShippingSend(data);
                    },1000) 
                }
            });
        }
        
    }
    handleChange=(key)=>{
        if(key==1){
            this.props.carryOutOrderInfoList(this.OrderPagePm={...this.OrderPagePm,outCode:this.props.outCode});
        }else if(key==2){
            this.props.DistributeInfoList(this.DistributePagePm={...this.DistributePagePm,outCode:this.props.outCode});
        }
    }
    getCatCodeClassName(catCode){
        switch(catCode){
            case "1":
                return "sale-carryout-title-save";
            case "2":
                return "sale-carryout-title-sectionDistribute";
            case "3":
                return "sale-carryout-title-Distribute";
            case "4":
                return "sale-carryout-title-sectionShip";
            case "5":
                return "sale-carryout-title-ship";
            case "6":
                return "sale-carryout-title-close";
            default:    
                return null;
        }
   }
   infoHandle = () =>{
       this.setState({
            count:this.state.count+1,
       })
       if(this.state.count%2==1){
           let putAway = this.state.putAway;
            this.setState({
                text:"收起",
                infoClassName:"sale-carryout-info sale-carryout-info-show",
            })
            if(putAway=="收起更多隐藏信息"){
                this.setState({
                    index:this.state.index+1,
                    putAway:"展开更多隐藏信息",
                    putAwayClassName:"sale-carryout-info-down sale-carryout-info-down-hide"                    
                })
            }
       }else{
        this.setState({
            text:"展开",
            infoClassName:"sale-carryout-info sale-carryout-info-hide",
        })
       }
   }
   putAwayHandle = () =>{
        this.setState({
            index:this.state.index+1,
    })
    if(this.state.index%2==0){
            this.setState({
                putAway:"收起更多隐藏信息",
                putAwayClassName:"sale-carryout-info-down sale-carryout-info-down-show"
            })
    }else{
        this.setState({
            putAway:"展开更多隐藏信息",
            putAwayClassName:"sale-carryout-info-down sale-carryout-info-down-hide"
        })
    }
   }
    render(){
        let {getFieldDecorator} = this.props.form;
        let {listLoading,dataSource} = this.props;
        return (
            <div className="sale-carryout-box">
                <Spin tip="Loading..." spinning={listLoading}>
                        <Form onSubmit={this.sendSubmit}>
                            <div className="sale-carryout-title">
                                <div className="sale-carryout-title-info">
                                    <p>销售出库单号：{formatNullStr(dataSource.orderCode)}</p>
                                        <span>
                                            {window.ENUM.getEnum("outDetailStatus").map(outDetailStatus => {
                                                if(outDetailStatus.catCode==dataSource.status){
                                                        return <span key={outDetailStatus.catCode}>状态：<span className={this.getCatCodeClassName(outDetailStatus.catCode)}>{outDetailStatus.catName}</span></span>
                                                }
                                            })}
                                            <span>发货站点：{formatNullStr(dataSource.shippingSiteName)}</span>
                                            <span>发货仓库：{dataSource.stockName || ""}</span>
                                        </span>
                                    </div>
                                <Button type="primary" htmlType="submit" loading={this.state.sendLoading}><span className="c2mfont c2m-fahuo sale-carryout-title-info-shipping"></span>发货</Button>
                            </div>
                            <div className="sale-carryout-doc-no" onClick={this.infoHandle}>{this.state.text}</div>
                            <div className={this.state.infoClassName}>
                                <div className="sale-carryout-info-up">
                                    <div className="sale-carryout-info-item">
                                        <h3>基本信息</h3>
                                        <p><span>源单据号：</span>{formatNullStr(dataSource.sourceOrderCode)}</p>
                                        {window.ENUM.getEnum("billType").map(billType => {
                                            if(billType.catCode==dataSource.sourceOrderType){
                                                return <p key="billType.catCode"><span>源单据类型：</span>{billType.catName}</p>
                                            }
                                        })}
                                    </div>
                                    <div className="sale-carryout-info-item-right">
                                        <h3>源单信息</h3>
                                        <div className="sale-carryout-info-item-right-item">
                                            <div className="sale-carryout-info-item-list">
                                                <p><span>客户：</span>{formatNullStr(dataSource.bpFull)}</p>
                                                <p><span>联系人：</span>{formatNullStr(dataSource.ownerName)}</p>
                                                <p><span>电话：</span>{formatNullStr(dataSource.ownerTel)}</p>
                                            </div>
                                            <div>
                                                <p><span>收货地址：</span>{formatNullStr(dataSource.deliveryAddressDetl)}</p>
                                                <p><span>交货日期：</span>{formatNullStr(dataSource.deliveryDate)}</p>
                                            </div>
                                        </div>
                                        <div className="sale-carryout-info-putaway-info">
                                            <a onClick={this.putAwayHandle}>{this.state.putAway}</a>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${this.state.putAwayClassName} sale-carryout-info-box`}>
                                    <div className="ant-row ant-form-item sale-carryout-row">
                                        <div className="sale-carryout-info-down-title">源单据备注：</div>
                                        <div className="sale-carryout-info-down-val">{formatNullStr(dataSource.sourceRemark)}</div>
                                    </div>
                                    <FormItem label="备注">
                                        {getFieldDecorator('remarks', {
                                            initialValue:dataSource.remarks,
                                            rules: [
                                                { max: 200, message: '备注内容要在200字以内',}
                                            ]
                                        })(
                                            <Input type="textarea" className="ant-input-textarea-second"/>
                                        )}
                                    </FormItem>
                                </div>    
                            </div>   
                        </Form>
                    <div className="sale-carryout-tabs">
                        <Tabs defaultActiveKey="1" animated={false} onChange={this.handleChange}>
                            <TabPane tab="明细信息" key="1">
                                <SaleCarryOutOrderInfoComp {...this.props}/>
                            </TabPane>
                            <TabPane tab="分配信息" key="2">
                                <SaleCarryOutDistributeInfoComp {...this.props}/>
                            </TabPane>
                        </Tabs>
                    </div>
                </Spin>
            </div>
        )
    }
}
export default Form.create()(SaleCarryOutComp)