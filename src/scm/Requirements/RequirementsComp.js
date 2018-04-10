import { Table, Button, Select,Row,Col, Input, Popconfirm, message,Spin ,Form,Breadcrumb ,DatePicker} from 'antd';
import React, { Component } from 'react';
import SearchBarComp from '../../base/mobxComps/SearchBarComp';
import SearchComp from '../../base/components/SearchComp';
import {requirementsStore}from "./RequirementsStore";
import {requirementsNextStore}from "./RequirementsNextStore";
import {requirementsConfrimStore}from "./RequirementsConfrimStore";
import TooltipComp from '../../base/mobxComps/TooltipComp';
//redux的store 和 tab标签页action
import { store } from '../data/StoreConfig';
import TabsAct from '../actions/TabsAct';
import moment from 'moment';
let dateFormat = 'YYYY-MM-DD';
let RangePicker = DatePicker.RangePicker;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
let moreData=[];

@observer
export default class RequirementsComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedRowKeys: [], 
            selectedRows:[],
            isAdd: false,
            rows:[]
        };
        // this.date = new Date();
        // this.year=this.date.getFullYear();
        // this.seperator1 = "-";
        // this.startMonth =  this.date.getMonth();
        // this.endMonth =  this.date.getMonth()+2;
        // this.strDate = "01";
        // this.endDay= this.date.getDate();
        // if ( this.startMonth >= 1 &&  this.startMonth <= 9) {
        //      this.startMonth = "0" +  this.startMonth;
        // }
        // if ( this.endMonth >= 1 &&  this.endMonth <= 9) {
        //      this.endMonth = "0" +  this.endMonth;
        // }
        // if(this.endMonth>12){
        //     this.endMonth="01";
        //     this.year=this.date.getFullYear()+1;
        // }
        // if(this.endMonth%2){
        //     this.endDay='30'
        // }else if(this.endMonth==2){
        //     this.endDay='28'
        // }else{
        //     this.endDay='31'
        // }
        // this.startDate= this.date.getFullYear() +  this.seperator1 +  this.startMonth +  this.seperator1 +  this.strDate;
        // this.endDate= this.year +  this.seperator1 +  this.endMonth +  this.seperator1 + this. endDay;           
        // this.searchPm = {orderCode:"",sourceType:null,sourceOrderCode:"",siteCode:null,pushdownFlag:0,orderType:null,categoryName:"",materialNickname:"",supplierNickname:"",planReceiveStart:this.startDate,planReceiveEnd:this.endDate,page:1,pageSize:15};
       
        this.columns = [
            {
                title: '采购需求单',
                dataIndex: 'orderCode',
                key: 'orderCode',
                width:129,
                fixed:'left'
                
            }, {
                title: '业务类型',
                dataIndex: 'orderType',
                key: 'orderType',
                width:80,
                render: (text, record, index) => window.ENUM.getEnum("orderType", text.toString()), 
                fixed:'left' 
                
            },
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                width:124
                
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
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 96, placement: 'top' }} />,
                
            }, {
                title: '物料分类',
                dataIndex: 'categoryName',
                key: 'categoryName',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 84, placement: 'top' }} />,

                //render: (text, record, index) => window.ENUM.getEnum("materialProperty", text.toString()),  
                
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
                
            },
            {
                title: '基本单位',
                dataIndex: 'baseUnitName',
                key: 'baseUnitName',

                
            }, {
                title: '期望收货日期',
                dataIndex: 'planReceiveDate',
                key: 'planReceiveDate',
                
            },
            {
                title: '收货站点',
                dataIndex: 'siteName',
                key: 'siteName',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 108, placement: 'top' }} />,
            },{
                title: '建议供应商',
                dataIndex: 'supplierName',
                key: 'supplierName',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 108, placement: 'top' }} />,
                
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 108, placement: 'top' }} />,
                
            },
            {
                title: '需求来源',
                dataIndex: 'sourceType',
                key: 'sourceType',
                render: (text, record, index) => window.ENUM.getEnum("Sources", text.toString()),  
                
            }, {
                title: '关联单据',
                dataIndex: 'sourceOrderType',
                key: 'sourceOrderType',
                render: (text, record, index) => window.ENUM.getEnum("requirementsSourceOrderType", text.toString()),  
                
            },
            {
                title: '关联单号',
                dataIndex: 'sourceOrderCode',
                key: 'sourceOrderCode',
                
            }, {
                title: '下推状态',
                dataIndex: 'pushdownFlag',
                key: 'pushdownFlag',
                render: (text, record, index) => window.ENUM.getEnum("pushdownFlag", text.toString()),  
            },
            {
                title: '下游单据',
                dataIndex: 'pushdownOrderType',
                key: 'pushdownOrderType',
                render: (text, record, index) => window.ENUM.getEnum("pushdownOrderType", text+""), 
                
            }, {
                title: '下游单据编号',
                dataIndex: 'pushdownOrderCode',
                key: 'pushdownOrderCode',
            }];
        }

    requirementsChange=(e)=>{
        requirementsStore.searchPm.orderCode=e.target.value;
    }

    materialNicknameChange=(e)=>{
        requirementsStore.searchPm.materialNickname=e.target.value;
    }

    supplierNicknameChange=(e)=>{
        requirementsStore.searchPm.supplierNickname=e.target.value;
    }
    SourcesChange=(value)=>{
        requirementsStore.searchPm.sourceType=value;
    }

    sourceChange=(e)=>{
        requirementsStore.searchPm.sourceOrderCode=e.target.value;
    }
    pushdownFlagChange=(value)=>{
        requirementsStore.searchPm.pushdownFlag=value;
    }
    orderTypeChange=(value)=>{
        requirementsStore.searchPm.orderType=value;
    }
    categoryNameChange=(e)=>{
        requirementsStore.searchPm.categoryName=e.target.value;
    }

    isNull=()=>{
        if(requirementsStore.searchPm.sourceType==null){
            delete requirementsStore.searchPm.sourceType;
           
        }
        if(requirementsStore.searchPm.siteCode==null){
             delete requirementsStore.searchPm.siteCode;
        }
        if(requirementsStore.searchPm.pushdownFlag==null){
             delete requirementsStore.searchPm.pushdownFlag;
        }
        if(requirementsStore.searchPm.orderType==null){
             delete requirementsStore.searchPm.orderType;
        }
        
    }
//    componentWillUnmount(){
//        requirementsNextStore.closeTables=false;
//     }
    componentDidMount() {
        // if(!requirementsStore.toback){
        //     requirementsStore.middleData=[];
        //     requirementsNextStore.dataSource=[];
        //     requirementsStore.resetData();

        // }
        // if(!requirementsNextStore.closeTables){
        //     //requirementsNextStore.resetData();
        //     requirementsConfrimStore.list={
        //         orderType:"",
        //         supplierCode:"",
        //         deptCode:"",
        //         purchaseType:"",
        //        // planReceiveDate:null,
        //         empCode:"",
        //         purchaseChannel:"",
        //         siteCode:"",
        //         purchaseRule:"",
        //         purchaseWay:"",
        //         receivingAddress:"",
        //         deliveryAskFor:"",
        //         remark:""

        //     };
        // }
        
         this.isNull();
         let {searchPm}=requirementsStore;
         requirementsStore.fetchsiteList({status:1,page:1,pageSize:10});//站点

         let searchUrl = window.location.search.split('&');
         let orderCode = searchUrl.length>1?searchUrl[1].split('=')[1]:'';
         requirementsStore.searchPm.orderCode=orderCode;
        if (orderCode) {
            requirementsStore.fetchTableList(searchPm).then(json=>{
                if( requirementsStore.toback){
                    this.isNull();
                    requirementsStore.fetchTableList(searchPm);
                    requirementsStore.toback=false;
                }
            })
        } else {
            requirementsStore.fetchTableList(searchPm).then(json=>{
                if( requirementsStore.toback){
                    this.isNull();
                    requirementsStore.fetchTableList(searchPm);
                    requirementsStore.toback=false;
                }
            })
        }

       
        
        
    }    
    onSearch=()=>{
        let {searchPm}=requirementsStore;
        if(searchPm.sourceType=="null"){
            // delete this.searchPm.sourceType;
           delete searchPm.sourceType
            
        }
        if(searchPm.siteCode=="null"){
             // delete this.searchPm.siteCode;
            delete searchPm.siteCode;
        }
        if(searchPm.pushdownFlag=="null"){
            // delete this.searchPm.pushdownFlag;
             delete searchPm.pushdownFlag;
        }
        if(searchPm.orderType=="null"){
             //delete this.searchPm.orderType;
             delete searchPm.orderType;
        }
        
        //requirementsStore.searchPm=this.searchPm;
        //this.searchPm.notIn=requirementsStore.notIn;
        requirementsStore.fetchTableList(requirementsStore.searchPm)
       
    }
    siteListSelect=(val)=>{
        requirementsStore.searchPm.siteCode=val;
    }

    onChange=(dates, dateStrings)=> {
        requirementsStore.searchPm.planReceiveStart=dateStrings[0];
        requirementsStore.searchPm.planReceiveEnd=dateStrings[1];
        
    }

    onSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({ selectedRowKeys,selectedRows,isAdd:false,rows:selectedRowKeys});
    }
    tableSelect=(record, selected, selectedRows)=>{
        requirementsStore.tableSelect=selected;
    }
  batchAdd=()=>{ 
    this.setState({isAdd:true})
    requirementsStore.tableSelect=false;
    let notIn=this.state.selectedRowKeys.join(",");
    let rowKey=this.state.selectedRowKeys;
    if(requirementsStore.searchPm.notIn){
        notIn=requirementsStore.searchPm.notIn+","+this.state.selectedRowKeys.join(",");
        requirementsStore.notAttrIn=[...rowKey,...requirementsStore.notAttrIn];
    }else{
        requirementsStore.notAttrIn=this.state.selectedRowKeys;
    }
    

   // requirementsStore.searchPm.notIn=notIn;
    requirementsStore.searchPm.notIn=requirementsStore.notIn=notIn;
    for(let i=0;i<this.state.selectedRowKeys.length;i++){
        requirementsStore.dataList.filter((x,key)=>{
            if(this.state.selectedRowKeys[i]==x.id){
                requirementsStore.dataList.splice(key,1);
            }
        })
    }

    moreData=this.state.selectedRows;
    let data=requirementsStore.middleData;
    if(data.length>0){
        let list = data.map(item => Number(item.id));
        if (Array.isArray(moreData)) {
            moreData.forEach(item => {
                if (!list.includes(item.id)) {
                    data.unshift(item);
                }
            });
        };

    }else{
        requirementsStore.middleData=moreData;
    }
   this.setState({ selectedRowKeys:[]});
   //this.setState({ rows:[] });
  }
//数组排序：
sortNumber=(a,b)=>{
    return a - b
}


nextDOM=()=>{
     //requirementsNextStore.saveData();
     //let data=[].concat(JSON.parse(JSON.stringify(toJS(requirementsStore.middleData))));
     //requirementsNextStore.this_form=Object.assign({},requirementsNextStore.this_form);
     //requirementsNextStore.supplierList.push({supplierCode:"BB",bpFull:'gag'})
     requirementsNextStore.dataSource=requirementsStore.middleData;
     let data=requirementsNextStore.dataSource.slice();
     let attr=[];
     data.map((value)=>{
         attr.unshift(value.orderType);
         requirementsStore.siteCodeAttr.push(value.siteCode);
         requirementsStore.siteCodeAttr.sort(this.sortNumber);
     })

    if(attr.indexOf(2)!=-1){
         requirementsNextStore.this_form.this_orderType="2"
    }else if(attr.indexOf(3)!=-1&&attr.indexOf(2)==-1){
        requirementsNextStore.this_form.this_orderType="3";
    }else{
        requirementsNextStore.this_form.this_orderType="1"
    }

     
    store.dispatch(TabsAct.TabAdd({
        title: "采购需求单",
        key: "requirementsNext",
    }));

    store.dispatch(TabsAct.TabRemove("requirements", "requirementsNext"));

    this.setState({ selectedRows:[],selectedRowKeys:[],rows:[]});
   // requirementsNextStore.closeTables=true;

    requirementsStore.toback=false;
    let a=requirementsStore.siteCodeAttr.filter(item=>item==requirementsStore.siteCodeAttr[0]).length;
    let b=requirementsStore.siteCodeAttr.length;
    
    if(requirementsStore.siteCodeAttr.filter(value=>value=="").length==b){
        requirementsStore.redMessage=true;
        requirementsNextStore.fetchSiteList({status:1,page:1,pageSize:10})
    }else if(a!=b){
        requirementsStore.redMessage=true;
         requirementsNextStore.fetchSiteList({status:1,page:1,pageSize:10})
        
    }else{
         requirementsStore.redMessage=false;
         requirementsNextStore.fetchSiteList({siteCode:requirementsStore.siteCodeAttr[0],status:1,page:1,pageSize:10}).then(json=>{
            if(json.status===2000&&json.data.list){
                requirementsNextStore.selectName.siteName=json.data.list[0].addressName;
                //requirementsNextStore.fetchComAddrBySiteList({siteCode:requirementsStore.siteCodeAttr[0],page:1,pageSize:10})
                requirementsNextStore.addressCode=json.data.list[0].addressCode;
                requirementsNextStore.siteCode=requirementsStore.siteCodeAttr[0];
                requirementsNextStore.fetchComAddrBySiteList({addressCode:requirementsNextStore.this_form.this_address?requirementsNextStore.this_form.this_address:json.data.list[0].addressCode,siteCode:requirementsStore.siteCodeAttr[0],page:1,pageSize:10}).then(json=>{
                    if(json.status===2000&&json.data.list){
                        let value=json.data.list[0]
                        requirementsNextStore.selectName.addressName=value.countryName+value.cityName+value.countyName+value.addressDetl;
                    }
                })
                
            }
        })
    }
   
    
}
  nextNotDOM=()=>{
    //没勾选数据的时候添加下一步不可点击按钮处理方法
  }
  batchClose=()=>{
    if(this.state.selectedRowKeys.length>0){
        let ids=this.state.selectedRowKeys.join(",");
        //this.searchPm.ids=ids;
        requirementsStore.fetchTableClose({ids:ids}).then(json=>{
            this.setState({ selectedRowKeys:[],rows:[]});
            requirementsStore.fetchTableList(requirementsStore.searchPm);
        })
    }
  }
    render() {
        let {Sources,siteList,pushdownFlag,orderType,materialProperty,dataList,searchPm,toback}=requirementsStore;
        let {selectedRowKeys,isAdd,rows} = this.state;
        let rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect:this.tableSelect,
            getCheckboxProps: record => ({
                disabled: record.pushdownFlag == '1',
            }),
        };
        const FormItem = Form.Item;
       let hasSelected = rows.length > 0;
        return (
            <div>
                <div style={{border:'1px solid #e2e2e2',margin:'20px auto 12px'}}>
                    <div style={{height:'80px',lineHeight:'80px',borderBottom:'1px solid #e2e2e2'}}>
                        <Breadcrumb separator=">" style={{float:'left',marginLeft:'14px',fontSize:'14px',color:'#000'}}>
                            <Breadcrumb.Item style={{color:'#4c80cf'}}>1.筛选</Breadcrumb.Item>
                            <Breadcrumb.Item >2.执行</Breadcrumb.Item>
                            <Breadcrumb.Item >3.确认</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{float:'right',marginRight:'16px',position:'relative'}}>
                            <Button type="default" style={{width:72,height:30,margin:'0 10px'}}><i className="c2mfont c2m-daoru_nor" style={{fontSize:14,margin:'0 4px 0 -4px'}}></i>导入</Button>
                            <Button type={isAdd||requirementsStore.middleData.length>0?"primary":"default"} style={{width:85,height:30,background:"#fff",border:isAdd||requirementsStore.middleData.length>0?'1px solid #4c80cf':'1px solid #e2e2e2',color:isAdd||requirementsStore.middleData.length>0?'#4c80cf':'#e2e2e2'}} onClick={(isAdd&&selectedRowKeys.length)||requirementsStore.middleData.length>0?this.nextDOM:this.nextNotDOM}>下一步<i className="c2mfont c2m-right" style={{fontSize:14,margin:'0 4px 0 4px'}}></i></Button>
                            {isAdd?<span style={{width:'19px',height:'19px',borderRadius:"100%",background:'#d73435',display:'inline-block',color:"#fff",position:'absolute',top:'18px',right:"-6px",textAlign:'center',lineHeight:'19px'}}>{requirementsStore.notAttrIn.length}</span>:null}
                        </div>
                    </div>

                    <Form style={{margin:"12px 20px 12px 14px"}} className="requirementsForm">
                        <Row >
                            <Col  sm={12} md={8}>
                                <FormItem label="采购需求单号" >
                                    <Input  placeholder="请输入单据号查询" onChange={this.requirementsChange} defaultValue={toback?searchPm.orderCode:""}/>
                                </FormItem>
                               
                            </Col>
                            <Col  sm={12} md={8}>
                                <FormItem label="来源单号" >
                                    <Input  placeholder="请输入来源单号查询" onChange={this.sourceChange} defaultValue={toback?searchPm.sourceOrderCode:""}/>
                                </FormItem>
                            </Col>
                            <Col  sm={12} md={8} >
                                <FormItem label="站点" >
                                     <Select  onChange={this.siteListSelect} defaultValue={toback?searchPm.siteCode==undefined?"全部":""+searchPm.siteCode:"全部"}>
                                        {
                                            siteList.slice().map(site => {
                                                return <Select.Option value={site.siteCode} key={site.siteCode}>{site.siteName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            
                        </Row>
                        <Row >
                            
                            <Col  sm={12} md={8}>
                                <FormItem label="业务类型" >
                                   <Select  onChange={this.orderTypeChange} defaultValue={toback?searchPm.orderType==undefined?"null":""+searchPm.orderType:"null"}>
                                        {
                                            orderType.map(order => {
                                                return <Select.Option value={order.catCode} key={order.catCode}>{order.catName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>
                              
                                
                            </Col>
                            <Col sm={12} md={8}>
                                <FormItem label="期望收货日期" >
                                   <RangePicker
                                    allowClear={false}
                                    ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                                    onChange={this.onChange}
                                    defaultValue={toback?[moment( searchPm.planReceiveStart, dateFormat), moment( searchPm.planReceiveEnd, dateFormat)]:[moment( searchPm.planReceiveStart, dateFormat), moment( searchPm.planReceiveEnd, dateFormat)]}
                                    format={dateFormat}
                                    />
                                </FormItem>
                            </Col>
                            
                            <Col sm={12} md={8}>
                                <FormItem label="物料分类" >
                                   <Input  placeholder="请输入物料分类名称查询" onChange={this.categoryNameChange} defaultValue={toback?searchPm.categoryName:""}/>
                                </FormItem>
                            </Col>
                            
                        </Row>
                        <Row>
                            <Col sm={12} md={8}>
                                <FormItem label="物料" >
                                    <Input placeholder="请输入物料编码/名称查询" onChange={this.materialNicknameChange} defaultValue={toback?searchPm.materialNickname:""}/>
                                </FormItem>
                            </Col>
                            <Col sm={12} md={8}>
                                <FormItem label="供应商" >
                                    <Input placeholder="请输入供应商编码/名称查询" onChange={this.supplierNicknameChange} defaultValue={toback?searchPm.supplierNickname:""}/>
                                </FormItem>
                            </Col>
                            <Col sm={12} md={8}>
                                <FormItem label="需求来源" >
                                   <Select  onChange={this.SourcesChange} defaultValue={toback?searchPm.sourceType==undefined?"null":""+searchPm.sourceType:"null"}>
                                        {
                                            Sources.map(sources => {
                                                return <Select.Option value={sources.catCode} key={sources.catCode}>{sources.catName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                
                                
                            </Col>
                            
                        </Row>
                        <Row >
                            <Col sm={12} md={8}>
                                <FormItem label="下推状态" >
                                    <Select  onChange={this.pushdownFlagChange} defaultValue={toback?searchPm.pushdownFlag==undefined?"0":""+searchPm.pushdownFlag:"0"}>
                                        {
                                            pushdownFlag.map(pushdown => {
                                                return <Select.Option value={pushdown.catCode} key={pushdown.catCode}>{pushdown.catName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>
                               
                            </Col>
                             <Col sm={12} md={8}>

                            </Col>

                            <Col sm={12} md={8}>
                                <FormItem label="" >
                                    <div style={{float:'right'}}>
                                        <Button type="primary" style={{width:70,height:28,background:"#4c80cf"}} onClick={this.onSearch}><i className="c2mfont c2m-search1" style={{fontSize:14,margin:'0 4px 0 -4px'}}></i>查询</Button>
                                    </div>
                                </FormItem>
                                    
                                
                            </Col>
                        </Row>
                        
                    </Form>
                </div>

                <div>
                    {requirementsStore.tableSelect&&hasSelected?
                    <div style={{margin:'12px 0'}}>
                        <Button type="primary" style={{width:94,height:30,background:"#4c80cf",marginRight:10 }} onClick={this.batchAdd}><i className="c2mfont c2m-tianjia" style={{fontSize:14,margin:'0 4px 0 -4px'}}></i>批量添加</Button>
                        <Button type="primary" style={{width:94,height:30,background:"#4c80cf"}} onClick={this.batchClose} ><i className="c2mfont c2m-quxiao" style={{fontSize:14,margin:'0 4px 0 -4px'}}></i>批量关闭</Button>
                    </div>:null
                    }
                    <Table
                    {...requirementsStore.Props}
                    dataSource={dataList.slice()}
                    rowKey='id'
                    columns={this.columns}
                    rowSelection={rowSelection}
                    scroll={{ x: 2200 }}
                    />
                </div>
                
            </div>
        )
    }
}