import React, { Component } from "react";
import { Form, Input, Spin,Select, Button, Modal ,Col,Row,message,Icon,DatePicker} from '../../base/components/AntdComp';
import FormModalComp from '../../base/components/FormModalComp';
import AutoSelectComp from '../../base/components/AutoSelectComp';
import { formatNullStr } from '../../base/consts/Utils';
import { requirementsConfrimStore,unitStore } from './RequirementsConfrimStore';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
let dateFormat = 'YYYY-MM-DD';
let { observer } = mobxReact;
@observer
class RequirementsUpdateComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        //this.purchaseQty=requirementsConfrimStore.record.requireQty;
        //this.planReceiveDate=requirementsConfrimStore.record.planReceiveDate;
        this.state={
            remark:"",
            planReceiveDate:"",
            purchaseUnitName:"",
            requireQty:"",
            purchaseUnit:""
        }

        this.purchaseUnitCode="";
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            
            if (!err) {
                let {requireQty,remark,planReceiveDate,purchaseUnitName,purchaseUnit}=this.state;
                
               requirementsConfrimStore.list.list[requirementsConfrimStore.index].purchaseQty=Number(requireQty?requireQty:requirementsConfrimStore.record.requireQty).toFixed(2);
               requirementsConfrimStore.list.list[requirementsConfrimStore.index].planReceiveDate=planReceiveDate?planReceiveDate:requirementsConfrimStore.record.planReceiveDate;
               requirementsConfrimStore.list.list[requirementsConfrimStore.index].remark=remark?remark:requirementsConfrimStore.record.remark;
               requirementsConfrimStore.list.list[requirementsConfrimStore.index].purchaseUnitName=purchaseUnitName?purchaseUnitName:requirementsConfrimStore.record.purchaseUnitName;
               requirementsConfrimStore.list.list[requirementsConfrimStore.index].purchaseUnit=purchaseUnit?purchaseUnit:requirementsConfrimStore.record.purchaseUnit||requirementsConfrimStore.record.baseUnitCode;
               if(Number(data.purchaseQty)>0){
                    requirementsConfrimStore.visible=false;
               }else{
                   message.error('采购数量必须大于0')
               }
                
            }
        });
    }
    handleCancel = (e) => {
        e.preventDefault();
         requirementsConfrimStore.visible=false;
    }
    purchaseQtyChange=(e)=>{
         this.setState({requireQty:e.target.value})
        // requirementsConfrimStore.record.requireQty=e.target.value;
    }
    planReceiveDateChange=(date, dateString) =>{
        this.setState({planReceiveDate:dateString})
       // requirementsConfrimStore.record.planReceiveDate=dateString
    }
    remarkChange=(e)=>{
         this.setState({remark:e.target.value})
    }
    // purchaseUnit=(value)=>{
    //     console.log(value);
    //     //requirementsConfrimStore.record.purchaseUnitName=value.businessUnitName;
    //     requirementsConfrimStore.record.purchaseUnitCode=value;
    // }
    // purchaseUnitSearch=(value)=>{
    //     requirementsConfrimStore.fetchUnit({materialCode:value});
    // }
    getComp = () => {
        let { getFieldDecorator } = this.props.form;
        let formItemLayout = {
            labelCol: { span:7 },
            wrapperCol: { span: 16},
        };
        let {record,unit}=requirementsConfrimStore;
        return (
            <div className="requirementsUpdate-con">
                <Form >
                    <Row>
                        <Col span={12}>
                            <s>物料编码：</s><b>{formatNullStr(record.materialCode)}</b>
                        </Col>
                        <Col span={12}>
                            <s>物料名称：</s><b>{formatNullStr(record.materialName)}</b>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <s>规格：</s><b>{formatNullStr(record.materialSpec)}</b>
                        </Col>
                        <Col span={12}>
                            <s>型号：</s><b>{formatNullStr(record.materialModel)}</b>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <s>材料：</s><b>{formatNullStr(record.materialQuality)}</b>
                        </Col>
                        <Col span={12}>
                            <s>代号：</s><b>{formatNullStr(record.standardCode)}</b>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <s>物料分类：</s><b>{formatNullStr(record.categoryName)}</b>
                        </Col>
                        
                    </Row>
                    {/*<Row>
                        <Col span={24}>
                            需求数量：{record.requireQty} {record.baseUnitName}
                        </Col>
                    </Row>*/}
                    <Row>
                       
                        <Col span={10}>
                            <FormItem label="采购数量" 
                            labelCol= {{span:8}}
                            wrapperCol={{span:9}} >
                                {this.getFD('purchaseQty', {
                                    initialValue:record.purchaseQty,
                                   
                                })(
                                        <Input  onChange={this.purchaseQtyChange} style={{height:30,width:150}}/>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={4} className="unitName">
                            <FormItem label="" 
                            labelCol= {{span:0}}
                            wrapperCol={{span:16}} >
                                {this.getFD('purchaseUnit', {
                                    initialValue:""+requirementsConfrimStore.record.baseUnitCode,
                                })(
                                        <Select
                                            onSelect={(value,option) => {
                                                this.setState({
                                                    purchaseUnitName:option.props.children,
                                                    purchaseUnit:option.props.value
                                                })
                                                //requirementsConfrimStore.record.purchaseUnitName=option.props.children;
                                               // requirementsConfrimStore.record.purchaseUnit=option.props.value;
                                            }}
                                        >
                                            {unitStore.options}
                                        </Select>
                                        
                                    )}
                            </FormItem>
                    
                         </Col>
                        <Col span={10}>
                            <FormItem label="预计收货日" 
                            labelCol= {{span:8}}
                            wrapperCol={{span:10}} >
                                {this.getFD('planReceiveDate', {
                                    initialValue:record.planReceiveDate?moment(record.planReceiveDate, dateFormat):"",
                                   
                                })(
                                        <DatePicker  style={{ width: 150 }}  format={dateFormat}   onChange={this.planReceiveDateChange}/>
                                    )}
                            </FormItem>
                    
                         </Col>
                    </Row>

                    <Row>
                        <FormItem label="备注"  
                        labelCol= {{span:3}}
                        wrapperCol={{span:21}}>
                            {this.getFD('remark', {
                                initialValue:record.remark,
                                rules: [
                                    { max:200, message: '备注不能超过200字符！' }
                                ]
                            })(
                                <Input type='textarea' style={{ height: '60px',width:495}} onChange={this.remarkChange} placeholder="如有特殊需求请在此处说明"/>
                                )}
                        </FormItem>
                       
                            {/*<Col span={3} style={{textAlign:"right",height:28,lineHeight:'28px'}}>备注：</Col>
                            
                                <Col span={21} style={{wdith:495}}><Input type='textarea' style={{ height: '60px',width:495}} onChange={this.remarkChange} placeholder="如有特殊需求请在此处说明"/></Col>*/}
                           
                        
                    </Row>
                </Form>
            </div>
        )
    }
    
}
RequirementsUpdateComp.defaultProps = {
    title: "编辑行",
    width:694,
    loading:false
}
export default Form.create()(RequirementsUpdateComp);
