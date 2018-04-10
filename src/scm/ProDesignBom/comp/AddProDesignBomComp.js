import { Form,Table,AutoComplete,TreeSelect, Modal, Row, Col, Button,Icon,Cascader , Select, Input,  message,Spin ,Breadcrumb ,DatePicker} from '../../../base/components/AntdComp';
import React, { Component } from 'react';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import SearchComp from '../../../base/components/SearchComp';
import FormModalComp from '../../../base/mobxComps/FormModalComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import EditProDesignBomTableComp from './EditProDesignBomTableComp';
import UploadProDesignBomComp from './UploadProDesignBomComp';
import TreeSelectComp from '../../../base/components/TreeSelectComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import MeasureComp from '../../../base/mobxComps/MeasureComp';
import {editProDesignBomTableStore,addProDesignBomStore,designTypeStore,importAddTypeStore,productCategoryStore,measurestores} from "../store/AddProDesignBomStore";
import { deignTypeDetailsStore,importTypeDetailsStore,proDesignBomDetailsInfoStore, detailsEditTable} from '../store/ProDesignBomDetailsStore'
import { importTableStore } from '../store/ImportProDesignBomStore';
import { searchBarStore, productTableStore } from '../store/ProDesignBomStore';
import { measurestore} from '../store/EditProDesignStore';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const FormItem = Form.Item;
const Option = Select.Option;
@observer
class AddProDesignBomComp extends FormModalComp {
    constructor(props, context) {
        super(props, context); 
        this.designTypeCode="",
        this.importTypeCode="",
        //this.stdUnitStore=stdUnitStore;
        this.measurestores=measurestores;
        this.measurestore=measurestore;
        this.state={
            show:false,
            isMergeModal:false,
            isMerge:false,
        }
    };

    componentWillReceiveProps(nextProps){
        if(this.props.tag.Ids) {
            if (nextProps.tag.Ids.bomTypeId !== this.props.tag.Ids.bomTypeId
                || nextProps.tag.Ids.productId !== this.props.tag.Ids.productId
                || nextProps.tag.Ids.bomLogIds !== this.props.tag.Ids.bomLogIds) {
                Object.assign(addProDesignBomStore.Ids, this.props.tag.Ids);
            }
        }
    };

    componentDidMount (){
        if(this.props.tag.Ids){
            Object.assign(addProDesignBomStore.Ids,this.props.tag.Ids);
        }
    };

    goToDetailComp=(id)=>{
        proDesignBomDetailsInfoStore.getProDesignBomDetailsInfo({id:id})
        .then(json => {
            detailsEditTable.fetchTableList({
                productId:id,
                designTypeCode:'',
                importTypeCode:''
            });
        });
        deignTypeDetailsStore.fetchSelectList({ subCode: ["C022"]});
        importTypeDetailsStore.fetchSelectList({orderStatus: 1});
        productTableStore.fetchTableList({pageSize:15});
        this.props.form.resetFields();
    };
    commonSubmit=(data)=>{
        let newData = {};
        newData = { ...data.stdUnitCode };
        delete data.stdUnitCode;
        if (newData.dimensionality == 1 || newData.dimensionality == 0) {
            if (newData.meaCode == '') {
                data.unitDimensionality = this.strConvertNumber(newData.dimensionality)
                data.unitSystem = null
                data.stdUnitCode = newData.meaSystem
            } else {
                data.unitDimensionality = this.strConvertNumber(newData.dimensionality)
                data.unitSystem = null
                data.stdUnitCode = newData.meaCode
            }
        } else {
            data.unitDimensionality = this.strConvertNumber(newData.dimensionality)
            data.unitSystem = this.strConvertNumber(newData.meaSystem)
            data.stdUnitCode = newData.meaCode
        }
        if(this.props.title=="新建产品BOM"){
            addProDesignBomStore.addProDesignBom(data).then(json=>{
                if(json.status==2000){
                    if(!json.data.compareErrorMessage){
                        store.dispatch(TabsAct.TabRemove("addProDesignBom", "importProDesignBomDetails"));
                        store.dispatch(TabsAct.TabAdd({
                            title: "产品设计BOM详情",
                            key: "importProDesignBomDetails",
                            tag: {Ids:addProDesignBomStore.Ids}
                        }));
                        this.goToDetailComp(json.data.id)
                    }else{
                        addProDesignBomStore.compareErrorMessage=json.data.compareErrorMessage;
                        this.setState({ isMergeModal: true });
                    }

                }
            })
        }else{
            addProDesignBomStore.addProDesignBom(data).then(json=>{
                if(json.status==2000){
                    if(!json.data.compareErrorMessage){
                        store.dispatch(TabsAct.TabRemove("editProDesignBom", "importProDesignBomDetails"));
                        store.dispatch(TabsAct.TabAdd({
                            title: "产品设计BOM详情",
                            key: "importProDesignBomDetails",
                            tag: {Ids:addProDesignBomStore.Ids}
                        }));
                        this.goToDetailComp(json.data.id)
                    }else{
                        addProDesignBomStore.compareErrorMessage=json.data.compareErrorMessage;
                        this.setState({ isMergeModal: true });
                    }
                }
            })
        }
    }
    sethandleSubmit= (e) => {
        this.setState({ isMerge: true,isMergeModal:false });
        e.preventDefault();
        this.validateFds((err, data) => {
            if (!err) {
                data.isMerge=true;
                data.list=addProDesignBomStore.detailStore.dataSource.slice();
                data.id= addProDesignBomStore.bomDetial.id;
                this.commonSubmit(data)

            }
        });
    };
    handleSubmit= (e) => {
        e.preventDefault();
        this.validateFds((err, data) => {
            if (!err) {
                data.isMerge=this.state.isMerge;
                data.list=addProDesignBomStore.detailStore.dataSource.slice();
                data.id= addProDesignBomStore.bomDetial.id;
                this.commonSubmit(data)
               
            }
        });
    };
    strConvertNumber = (value) => {
        if (value === "") {
            return null;
        }
        else if (value === '') {
            return null;
        }
        else if (value === undefined) {
            return null;
        }
        return Number(value);
    }
    getComp = () => {
        let formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 14 },
        };

        let {bomDetial,comboboxList}=addProDesignBomStore;
        let unitClass = {};
        if (this.props.title=="编辑产品BOM") {
            if (bomDetial.unitDimensionality == 1 || bomDetial.unitDimensionality == 0) {
                unitClass = {
                    dimensionality: bomDetial.unitDimensionality,
                    meaCode: bomDetial.stdUnitCode
                }
            } else {
                unitClass = {
                    dimensionality: bomDetial.unitDimensionality,
                    meaSystem: bomDetial.unitSystem,
                    meaCode: bomDetial.stdUnitCode
                }
            }
        } else {
            unitClass = {
                dimensionality: '',
                meaSystem: '',
                meaCode: ''
            } 
        }
        return (
            <div>
                <Form >
                    <div style={{marginTop:15,paddingBottom:20}}>
                        <Row>
                            <Col span={8}>
                                <FormItem label="产品编码" {...formItemLayout} >
                                    {this.getFD('productCode', {
                                        initialValue:bomDetial.productCode,
                                        rules:[
                                             { type: 'numOrLetterOrOther',required: true,whitespace:true },
                                             {max:20,message:'最多允许20字符'},
                                            
                                        ]
                                    })(
                                            <Input />
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="产品名称" {...formItemLayout} >
                                    {this.getFD('productName', {
                                        initialValue:bomDetial.productName,
                                        rules:[
                                             { required: true, message: '产品名称 必填！',whitespace:true },
                                              {max:50,message:'最多允许50字符'}
                                        ]
                                    })(
                                            <Input />
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8} className="productCategoryCode">
                                <FormItem label="产品分类" {...formItemLayout} >
                                    {this.getFD('productCategoryCode', {
                                        initialValue:bomDetial.productCategoryCode,
                                        rules:[
                                             { required: true, message: '产品分类 必填！' }
                                        ]
                                    })(
                                            
                                            <TreeSelect
                                            style={{height:'30px',width:'330px'}}
                                                {...productCategoryStore.Props}
                                            />
                                        )}
                                </FormItem>
                            
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="规格" {...formItemLayout} >
                                    {this.getFD('productSpec', {
                                        initialValue:bomDetial.productSpec,
                                        rules:[
                                            {max:50,message:'最多允许50字符'}
                                        ]
                                       
                                    })(
                                            <Input />
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="型号" {...formItemLayout} >
                                    {this.getFD('productModel', {
                                        initialValue:bomDetial.productModel,
                                        rules:[
                                            {max:50,message:'最多允许50字符'}
                                        ]
                                      
                                    })(
                                            <Input />
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="来源单号" {...formItemLayout} >
                                    {this.getFD('sourceCode', {
                                        initialValue:bomDetial.sourceCode,
                                        rules:[
                                            {max:50,message:'最多允许50字符'}
                                        ]
                                        
                                    })(
                                           <Input />
                                        )}
                                </FormItem>
                            
                            </Col>
                        </Row>
                        <Row >
                            <Col span={8}>
                                <FormItem label="材料" {...formItemLayout} >
                                    {this.getFD('productTexture', {
                                        initialValue:bomDetial.productTexture,
                                        rules:[
                                            {max:50,message:'最多允许50字符'}
                                        ]
                                       
                                    })(
                                            <Input />
                                        )}
                                </FormItem>
                                <FormItem label="品牌" {...formItemLayout} >
                                    {this.getFD('productBrand', {
                                        initialValue:bomDetial.productBrand,
                                        rules:[
                                            {max:50,message:'最多允许50字符'}
                                        ]
                                       
                                    })(
                                            <Input />
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8} style={{position:'relative'}}>
                                <FormItem label="代号" {...formItemLayout} >
                                    {this.getFD('gbCode', {
                                        initialValue:bomDetial.gbCode,
                                        rules:[
                                            {max:50,message:'最多允许50字符'}
                                        ]
                                      
                                    })(
                                            <Input />
                                        )}
                                </FormItem>
                                <FormItem label="标准数量"  
                                labelCol={{span:5}}
                                wrapperCol= {{span:9}}  >
                                    {this.getFD('stdQty', {
                                        initialValue:bomDetial.stdQty,
                                        rules:[
                                             { type: 'gtZero', label: '标准数量', decimal: 4 ,required: true}
                                        ]
                                      
                                    })(
                                            <Input />
                                        )}
                                </FormItem>
                                <FormItem label="" 
                                labelCol={{span:0}}
                                wrapperCol= {{span:10}} 
                                style={{position:'absolute',top:'56px',right:'-6px',width:'215px'}}
                                >
                                    {this.getFD('stdUnitCode', {
                                        initialValue:unitClass||"",
                                        rules: [{
                                            required: true,
                                            validator: (rule, value, callback) => {
                                                if (value.dimensionality === '') {
                                                    callback('计量单位 为必填')
                                                } else {
                                                    if (value.dimensionality === 0 || value.dimensionality == 1) {
                                                        if (value.meaSystem === '') {
                                                            callback('计量单位 为必填')
                                                        } else {
                                                            callback()
                                                        }
                                                    } else {
                                                        if (value.meaSystem === '' || value.meaCode == '') {
                                                            callback('计量单位 为必填')
                                                        } else {
                                                            callback()
                                                        }
                                                    }
                                                }
                                            }
                                        }],
                                    })(
                                            <MeasureComp store={this.measurestore}  />
                                        )}
                                </FormItem>
                                
                            </Col>
                            <Col span={8}>
                                <FormItem label="产品描述" {...formItemLayout} >
                                    {this.getFD('remarks', {
                                        initialValue:bomDetial.remarks,
                                        rules:[
                                            {max:200,message:'最多允许200字符'}
                                        ]
                                        
                                    })(
                                           <Input type="textarea" style={{height:74}}/>
                                        )}
                                </FormItem>
                            
                            </Col>
                        </Row>
                       
                    </div>

                </Form>
            </div>
        )
    };
    // componentDidMount() {
        //editProDesignBomTableStore.fetchTableList();
       
    // };
    // onMouseOver=()=>{
    //     this.setState({show:true})
    // };
    // onMouseOut=()=>{
    //     this.setState({show:false})
    // };
    // uploadModal=()=>{
    //     addProDesignBomStore.addVisible=true;
    // };
    //物料明细查询：
    searchMaterial=()=>{
      editProDesignBomTableStore.fetchTableList({productId:addProDesignBomStore.bomDetial.id,importTypeCode:this.importTypeCode,designTypeCode:this.designTypeCode})
    };
    parentChange=(val)=>{
        this.importTypeCode=val;
    };
    // onUnitSearch=(value)=>{
    //     this.stdUnitStore.fetchSelectList({status:1,meaName:value,meaCode:value});
    // };
    getDetailComp = () => <EditProDesignBomTableComp />
    render() {   
        let {addProDesignBomLoading,bomDetial}=addProDesignBomStore;  
        let formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        }
        return (
             <Spin spinning={addProDesignBomLoading}>
                <div>
                    <div style={{border:'1px solid #e2e2e2',margin:'12px auto 20px'}}>
                        <div style={{height:'74px',lineHeight:'74px',borderBottom:'1px solid #e2e2e2'}}>
                            <div style={{float:'left',paddingLeft:"16px",fontSize:'14px',color:"#4a4a4a"}}>{this.props.title}</div>
                            <div style={{float:'right',marginRight:'16px'}}>
                                <Button type="primary" style={{width:72,height:30,background:"#4c80cf"}} onClick={this.handleSubmit}><i className="c2mfont c2m-baocun" style={{fontSize:'12px',marginRight:'4px'}}></i>保存</Button>
                            </div>
                        </div>
                        <div style={{height:'44px',lineHeight:'44px',margin:'0 16px',borderBottom:'1px solid #e2e2e2'}}>
                            <p style={{float:'left',fontSize:'14px',color:"#4a4a4a"}}>产品信息</p>
                           
                        </div>
                        
                        {this.getComp()}
                    </div>
                    <div style={{height:30,lineHeight:'30px',marginBottom:'10px'}}>

                        <p style={{fontSize:'14px',color:'#4C4C4C',float:'left'}}>物料明细</p>
                        <div style={{float:'right',height:30}}>
                            <Form>
                                <FormItem style={{float:'right'}}>
                                    <Button type="primary" style={{width:72,height:30,marginLeft:20,background:"#4c80cf"}} onClick={this.searchMaterial}><i className="c2mfont c2m-search1" style={{fontSize:'12px',marginRight:'4px'}}></i>查询</Button>
                                </FormItem>
                                <FormItem style={{float:'right',margin:"0 20px"}} {...formItemLayout}
                                            label="导入类型">
                                    {this.getFD('importTypeCode',{
                                            initialValue:"",
                                        }
                                    )(
                                        <Select 
                                        style={{width:200}}
                                        onSelect={(value,option) => {
                                            this.importTypeCode=option.props.value;
                                        }}
                                        >
                                            {importAddTypeStore.options}
                                        </Select>
                                    )
                                    }
                                </FormItem>
                                <FormItem  style={{float:'right'}} {...formItemLayout}
                                            label="设计类型">
                                    {this.getFD('designTypeCode',{
                                            initialValue:""
                                        }
                                    )(
                                        <Select
                                        style={{width:200}}
                                        onSelect={(value,option) => {
                                            this.designTypeCode=option.props.value;
                                        }}
                                        >
                                                {designTypeStore.options}
                                        </Select>
                                    )
                                    }
                                </FormItem>
                                
                            </Form>
                           
                        </div>
                    </div>
                    <div className="saleNotice-detail-info">
                        {
                            this.getDetailComp()
                        }
                    </div>
                   
                    <Modal title="提示" visible={this.state.isMergeModal}
                        onCancel={() => this.setState({ isMerge: false })}
                        footer={[
                            <Button key="submit" type="primary" size="large"
                                onClick={this.sethandleSubmit}>
                                确定
                        </Button>,
                        <Button key="cancel" type="primary" size="large"
                                onClick={() => this.setState({ isMerge: false,isMergeModal:false })}>
                                取消
                        </Button>,
                        ]}>
                        <p>{addProDesignBomStore.compareErrorMessage}</p>
                    </Modal>
                </div>
            </Spin>
        )
    }
}
AddProDesignBomComp.defaultProps={
    title:"新建产品BOM"
}
export default Form.create()(AddProDesignBomComp);