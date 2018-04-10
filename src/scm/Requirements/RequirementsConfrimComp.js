import { Form,Table, Modal, Row, Col, Button,Icon, Select, Input,  message,Spin ,Breadcrumb ,DatePicker} from 'antd';
import React, { Component } from 'react';
import SearchBarComp from '../../base/mobxComps/SearchBarComp';
import SearchComp from '../../base/components/SearchComp';
import FormModalComp from '../../base/mobxComps/FormModalComp';
import AutoSelectComp from '../../base/components/AutoSelectComp';
import {requirementsNextStore}from "./RequirementsNextStore";
import {requirementsConfrimStore,unitStore}from "./RequirementsConfrimStore";
import {requirementsStore} from './RequirementsStore';
import RequirementsUpdateComp from './RequirementsUpdateComp';
import { formatNullStr } from '../../base/consts/Utils';
import TooltipComp from '../../base/mobxComps/TooltipComp';
import moment from 'moment';
//redux的store 和 tab标签页action
import { store } from '../data/StoreConfig';
import TabsAct from '../actions/TabsAct';
let { observable, action, computed, runInAction,Popconfirm, toJS } = mobx;
let { observer } = mobxReact;
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class RequirementsComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.state={
            show:false
        }
          this.columns = [
              
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width:100
                
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 132, placement: 'top' }} />,
                
            },
            {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 108, placement: 'top' }} />,
                
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 108, placement: 'top' }} />,
                
            },
            {
                title: '材料',
                dataIndex: 'materialQuality',
                key: 'materialQuality',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 108, placement: 'top' }} />,
                
            }, {
                title: '物料分类',
                dataIndex: 'categoryName',
                key: 'categoryName',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 89, placement: 'top' }} />,
                
            },
            {
                title: '代号',
                dataIndex: 'standardCode',
                key: 'standardCode',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 89, placement: 'top' }} />,
                
            }, {
                title: '需求数量',
                dataIndex: 'requireQty',
                key: 'requireQty',
                width:100
                
            },
            {
                title: '基本单位',
                dataIndex: 'baseUnitName',
                key: 'baseUnitName',
                width:100
                
            },{
                title: '采购数量',
                dataIndex: 'purchaseQty',
                key: 'purchaseQty',
                width:100
                
            },
            {
                title: '采购单位',
                dataIndex: 'purchaseUnitName',
                key: 'purchaseUnitName',
                width:100
                
            }, {
                title: '预计收货日期',
                dataIndex: 'planReceiveDate',
                key: 'planReceiveDate',
                width:135
                
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 132, placement: 'top' }} />,
            },
            {
                dataIndex: 'handle',
                title: '操作',
                width:106,
                fixed:'right',
                render:(text,record,index)=>
                <span title="编辑"  style={{borderRadius:'100%',border:'1px solid #9a9a9a',textAlign:'center',lineHeight:'24px',width:24,height:24}} href="javascript:;" onClick={()=>this.update(record,index)}>
                    <i className="c2mfont c2m-bianji" style={{fontSize:16,color:'#4a4a4a'}}></i>
                </span>
                
            }];

           

    }

    update=(record,index)=>{
        requirementsConfrimStore.visible=true;
        requirementsConfrimStore.record=record;
        requirementsConfrimStore.index=index;
        unitStore.fetchUnit({materialCode:record.materialCode});
    }

    

    handleSubmit= (e) => {
        e.preventDefault();
        this.validateFds((err, data) => {
            if (!err) {
               
            }
        });
    }
 
    


    componentDidMount() {
        // requirementsConfrimStore.list.list.map((x)=>{
        //     x.requireQty=x.purchaseQty;
        //     console.log(x.requireQty);
        // })
       
    }    

    ToBack=()=>{
        store.dispatch(TabsAct.TabRemove("requirementsConfrim", "requirementsNext"));
        store.dispatch(TabsAct.TabAdd({
            title: "采购需求单",
            key: "requirementsNext"
        }));
        //requirementsNextStore.setData();
        requirementsConfrimStore.mark=true;
    }
    confirm=()=>{
        requirementsConfrimStore.list.siteCode=requirementsNextStore.siteCode;
        let a=requirementsConfrimStore.list.list.slice();
        if(a.filter(value=>value.orderCode==a[0].orderCode).length==a.length){
            requirementsConfrimStore.list.orderCode=a[0].orderCode;
        }
        requirementsConfrimStore.list.receivingAddressDetl=requirementsNextStore.selectName.addressName;//地址
        requirementsConfrimStore.fetchConfrim(requirementsConfrimStore.list).then(json=>{
            if(json.status===2000){
                requirementsStore.notAttrIn=[];
                store.dispatch(TabsAct.TabRemove("requirementsConfrim", "requirements"));
                store.dispatch(TabsAct.TabAdd({
                    title: "采购需求单",
                    key: "requirements"
                }));
            }
        })
        
    }

    render() {
        let {list,confrimLoading}= requirementsConfrimStore;
        let {supplierName,deptName,empName,siteName,addressName}=requirementsNextStore.selectName;
        return (
            <div>
                <Spin spinning={confrimLoading}>
                    <div style={{margin:'20px 0',border:'1px solid #e2e2e2',borderBottom:'none'}}>
                        <div style={{height:'80px',lineHeight:'80px',borderBottom:'1px solid #e2e2e2'}}>
                            <Breadcrumb separator=">" style={{float:'left',marginLeft:'14px',fontSize:'14px',color:'#000'}}>
                                <Breadcrumb.Item >1.筛选</Breadcrumb.Item>
                                <Breadcrumb.Item >2.执行</Breadcrumb.Item>
                                <Breadcrumb.Item style={{color:'#4c80cf'}}>3.确认</Breadcrumb.Item>
                            </Breadcrumb>
                            <div style={{float:'right',marginRight:'16px'}}>
                                <Button type="primary" style={{width:103,height:30,background:"#4c80cf" }} onClick={this.ToBack}><i className="c2mfont c2m-left" style={{fontSize:14,margin:'0 3px 0 -4px'}}></i>返回上一步</Button>
                                <Button type="primary" style={{width:85,height:30,background:"#4c80cf",margin:'0 20px 0 10px'}} onClick={this.confirm} ><i className="c2mfont c2m-shi" style={{fontSize:14,margin:'0 4px 0 4px'}}></i>确认</Button>
                            </div>
                        </div>
                        <div className="requirementsConfrim-con">
                            <Row>
                                <Col span={8}><i>业务类型：</i><span>{requirementsNextStore.orderType[list.orderType-1].catName}</span></Col>
                                <Col span={8}><i >指定供应商：</i><span>{list.supplierCode?list.supplierCode+"["+supplierName+"]":formatNullStr(list.supplierCode)}</span></Col>
                                <Col span={8}><i>采购部门：</i><span>{list.deptCode?list.deptCode+"["+deptName+"]":formatNullStr(list.deptCode)}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><i>采购类型：</i><span>{requirementsNextStore.purchaseType[list.purchaseType].catName}</span></Col>
                                <Col span={8}><i >预计收货日期：</i><span>{list.planReceiveDate}</span></Col>
                                <Col span={8}><i>业务员：</i><span>{list.empCode?list.empCode+"["+empName+"]":formatNullStr(list.empCode)}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><i>采购渠道：</i><span>{requirementsNextStore.purchaseChannel[list.purchaseChannel-1].catName}</span></Col>
                                <Col span={8}><i >收货站点：</i><span>{siteName}</span></Col>
                                <Col span={8}><i>采购规则：</i><span>{requirementsNextStore.purchaseRule[list.purchaseRule-1].catName}</span></Col>
                            </Row>
                            <Row>
                                <Col span={8}><i>采购方式：</i><span>{requirementsNextStore.purchaseWay[list.purchaseWay-1].catName}</span></Col>
                                <Col span={8}><i >收货地址：</i><span>{addressName}</span></Col>
                                <Col span={8}><i>交期要求：</i><span>{list.deliveryAskFor?requirementsNextStore.deliveryAskFor[list.deliveryAskFor-1].catName:null}</span></Col>
                            </Row>
                        
                            <div style={{position:'absolute',bottom:'10px',right:'20px'}}>
                                <a  href="#" onClick={() => {
                                    this.setState({ show: !this.state.show })
                                }}>{this.state.show ? '收起更多隐藏信息' : '展开更多隐藏信息'}
                                </a>
                            </div>
                        </div>
                        <div className="requirementsConfrim-remark"style={{ display: this.state.show ? `block` : `none`}}>
                            <Row>
                                <Col span={1}><div className="remark-title">备注：</div></Col><Col span={23}><div className="remark-con">{formatNullStr(list.remark)}</div></Col>
                            </Row>
                        </div>
                        
                    </div>
                    <div style={{margin:'20px auto 12px',fontSize:'14px',color:'#4a4a4a'}}>物料信息</div>
                    <Table dataSource={list.list.slice()|| null} columns={this.columns}
                        rowKey={"id"}
                        pagination={{
                            total: list.list ? list.list.length : 0,
                            showTotal: (total) => `总共 ${total} 条记录`,
                            pageSizeOptions: ['10', '15', '20', '50'],
                            showSizeChanger: true,
                        }}
                        scroll={{ x: 2200 }}
                    />
                    <RequirementsUpdateComp visible={requirementsConfrimStore.visible}/>
                </Spin>
            </div>
        )
    }
}
export default Form.create()(RequirementsComp);