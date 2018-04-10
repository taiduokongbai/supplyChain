import { Form,Table, Modal, Row, Col, Button,Icon, Select, Input,  message,Spin ,Breadcrumb ,Popconfirm,DatePicker} from 'antd';
import React, { Component } from 'react';
import SearchBarComp from '../../base/mobxComps/SearchBarComp';
import SearchComp from '../../base/components/SearchComp';
import FormModalComp from '../../base/mobxComps/FormModalComp';
import AutoSelectComp from '../../base/components/AutoSelectComp';
import {requirementsNextStore}from "./RequirementsNextStore";
import {requirementsStore} from "./RequirementsStore";
import {requirementsConfrimStore}from "./RequirementsConfrimStore";
import TooltipComp from '../../base/mobxComps/TooltipComp';
import moment from 'moment';
//redux的store 和 tab标签页action
import { store } from '../data/StoreConfig';
import TabsAct from '../actions/TabsAct';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class RequirementsComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
          //this.deliveryAskFor='1';
          this.purchaseType='0';
          //this.purchaseChannel='1';
          //this.purchaseWay='1';
         // this.purchaseRule="1";
          this.deptCode="";
          this.resultarr="";//数组去重
          this.resultCode="";//数组去重
          //this.orderType='1';
         // this.siteCode="";
          this.siteName="";
          this.nextData={};
          //this.supplierCode="";
          this.state={
              siteId:"",
              orderTypeInfo:false,
              nextInfo:true,
              siteCodeInfo:false,
              show:false,
              this_data:[],
          }
          this.columns = [
           
            {
                title: '采购需求单',
                dataIndex: 'orderCode',
                key: 'orderCode',
               
                
            }, {
                title: '业务类型',
                dataIndex: 'orderType',
                key: 'orderType',
                width:100,
                render: (text, record, index) =>record.orderType==requirementsNextStore.this_form.this_orderType?window.ENUM.getEnum("orderType", text.toString()):<span style={{color:"red"}}>{window.ENUM.getEnum("orderType", text.toString())}</span>  
                
            },
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
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 96, placement: 'top' }} />,
                
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
                
            }, {
                title: '期望收货日期',
                dataIndex: 'planReceiveDate',
                key: 'planReceiveDate',
                width:130
                
            },
            {
                title: '收货站点',
                dataIndex: 'siteName',
                key: 'siteName',
                width:135,
                render: (text, record, index) =>record.siteCode==requirementsNextStore.siteCode?<TooltipComp attr={{ text: text, wid: 89, placement: 'top' }} />:<span style={{color:"red"}}><TooltipComp attr={{ text: text, wid: 89, placement: 'top' }} /></span>  
                
            },{
                title: '建议供应商',
                dataIndex: 'supplierName',
                key: 'supplierName',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 89, placement: 'top' }} />,
                
            }, {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 132, placement: 'top' }} />,
                
            },
            {
                title: '需求来源',
                dataIndex: 'sourceType',
                key: 'sourceType',
                render: (text, record, index) => window.ENUM.getEnum("Sources", text.toString()),  
                
            }, {
                title: '来源单据',
                dataIndex: 'sourceOrderType',
                key: 'sourceOrderType',
                render: (text, record, index) => window.ENUM.getEnum("requirementsSourceOrderType", text.toString()),  
            },
            {
                title: '来源单号',
                dataIndex: 'sourceOrderCode',
                key: 'sourceOrderCode',
                width:100
                
            },{
                dataIndex: 'handle',
                title: '操作',
                width:106,
                fixed:'right',
                render:(text,record,index)=>
                    <div title="删除" style={{borderRadius:'100%',border:'1px solid #9a9a9a',textAlign:'center',cursor:'pointer',lineHeight:'24px',width:24,height:24}} href="javascript:;" onClick={()=>this.deleteData(record,index)}>
                        <i className="c2mfont c2m-shanchu" style={{fontSize:22,color:'#4a4a4a'}}></i>
                    </div>
                                                
                                            
            }];

           

    }
    deleteData=(record,index)=>{
        requirementsStore.notAttrIn.map((value,index)=>{
            if(record.id==value){
                requirementsStore.notAttrIn.splice(index,1);
                 let notIn=requirementsStore.notAttrIn.join(",");
                 requirementsStore.searchPm.notIn=requirementsStore.notIn=notIn;
            }
        })
        requirementsNextStore.dataSource.splice(index,1);
        if(requirementsNextStore.dataSource.slice().length==0){
            this.setState({nextInfo:false})
        }
        requirementsStore.middleData.slice(index,1)
    }
    purchaseRuleChange=(value)=>{
        requirementsNextStore.this_form.this_purchaseRule=value;
        
        if(value=='1'){
            requirementsNextStore.this_form.this_deliveryAskFor='1';
            this.setFdv({"deliveryAskFor":"1"})
        }else{
            requirementsNextStore.this_form.this_deliveryAskFor="";
            this.setFdv({"deliveryAskFor":""})
        }
    }

    //通过选择站点带出下面的地址
    siteListSelect=(value)=>{
       requirementsNextStore.this_form.this_site=value.siteCode;
       requirementsNextStore.this_form.this_address=value.addressCode;
       requirementsNextStore.siteCode=value.siteCode;
       requirementsNextStore.addressCode=value.addressCode;
       this.setFdv({'receivingAddress':value.addressCode,'siteCode':value.siteCode})
       this.siteName=value.siteName;
       requirementsNextStore.selectName.siteName=value.siteName;
       requirementsNextStore.selectName.addressName=value.countryName+value.cityName+value.countyName+value.addressDetl;
       requirementsNextStore.fetchComAddrBySiteList({addressCode:value.addressCode,siteCode:value.siteCode,page:1,pageSize:10})
       this.setState({siteId:value.id});
    }
    siteListSearch=(value)=>{
       requirementsNextStore.fetchSiteList({siteCode:value,siteName:value,status:1,page:1,pageSize:10})
    }
    //通过采购部门选择业务员
    deptListSelect=(value)=>{
       requirementsNextStore.this_form.this_dept=value.orgCode;
       requirementsNextStore.selectName.deptName=value.orgName;
       requirementsNextStore.fetchEmpList({deptCode:0,page:1,pageSize:10}).then(json=>{
           if(json.status===2000){
               if(json.data.list&&json.data.list.length==0){
                   this.setFdv({"empCode":""})
               }
           }
       })
    }
    //采购部门
    deptListSearch=(value)=>{
        if(this.deptCode){
            requirementsNextStore.fetchDeptList({orgCode:value,status:1,page:1,pageSize:10})//采购部门
        }
       
    }
    empListSelect=(value)=>{
       requirementsNextStore.this_form.this_emp=value.empCode;
       requirementsNextStore.selectName.empName=value.empName;
    }
    //业务员模糊搜索
    empListSearch=(value)=>{
        if(this.deptCode){
            requirementsNextStore.fetchEmpList({deptCode:0,empCode:value,empName:value,page:1,pageSize:10})//员工
        }
       
    }
    //供应商选择
    supplierListSelect=(value)=>{
       requirementsNextStore.this_form.this_supplier=value.supplierCode;
       requirementsNextStore.selectName.supplierName=value.bpFull;
       requirementsNextStore.supplierCode=value.supplierCode;
       
    }
    //供应商模糊搜索
    supplierListSearch=(value)=>{
       requirementsNextStore.this_form.this_purchaseChannel==1?
       requirementsNextStore.fetchSupplierList({isEnterPlatform:1,bpFull:value,supplierCode:value,status:1,page:1,pageSize:10}):
       requirementsNextStore.fetchSupplierList({bpFull:value,supplierCode:value,status:1,page:1,pageSize:10});//供应商
    }
    //收货地址
    ComAddressSelect=(value)=>{
       requirementsNextStore.this_form.this_address=value.addressCode;
       requirementsNextStore.selectName.addressName=value.countryName+value.cityName+value.countyName+value.addressDetl;
    }
    ComAddressSearch=(value)=>{
       requirementsNextStore.fetchComAddrBySiteList({siteCode:requirementsNextStore.siteCode,page:1,pageSize:10});
       requirementsNextStore.selectName.addressName=value;
    }
    orderTypeChange=(value)=>{
        requirementsNextStore.this_form.this_orderType=value;
       if(value=='1'||value=='2'){
           this.purchaseType='0';
           this.setFdv({ "purchaseType":'0' })
       }else{
           this.purchaseType='1';
           this.setFdv({ "purchaseType":'1' })
       }
    }
    purchaseChannelChange=(value)=>{
       // this.setState({nextInfo:true})
       if(value=='1'){
           requirementsNextStore.fetchSupplierList({isEnterPlatform:1,status:1,page:1,pageSize:10})
           this.setFdv({ "purchaseWay":'1' })
           requirementsNextStore.this_form.this_purchaseWay="1";
           requirementsNextStore.purchaseWay.splice(2,1);
            this.props.form.setFields({
                supplierCode: {
                
                },
            })
            
            
       }else{
           this.setFdv({ "purchaseWay":'3' })
           requirementsNextStore.fetchSupplierList({status:1,page:1,pageSize:10})
           requirementsNextStore.this_form.this_purchaseWay="3";
           requirementsNextStore.purchaseWay.splice(2,0,
               {
                    "catCode": '3',
                    "catName": "采购订单"
                }
           )
       }
       requirementsNextStore.this_form.this_purchaseChannel=value;

    }
    purchaseWayChange=(value)=>{
       // this.setState({nextInfo:true})
        requirementsNextStore.this_form.this_purchaseWay=value;
        if( requirementsNextStore.this_form.this_purchaseWay=='1'){
            this.props.form.setFields({
                supplierCode: {},
                receivingAddress:{},  
               

            })
        }
        
    }
    deliveryAskForChange=(value)=>{
        requirementsNextStore.this_form.this_deliveryAskFor=value;
    }
    planReceiveDateChange=(date, dateString)=>{
        requirementsNextStore.this_form.this_planReceiveDate=dateString;
       
    }
    remarkChange=(e)=>{
        requirementsNextStore.this_form.this_remark=e.target.value;
    }
    // isSupplierPrice=()=>{
    //     let list=[];
    //     //console.log("purchaseChannel:"+requirementsNextStore.this_purchaseChannel+"purchaseWay:"+requirementsNextStore.this_purchaseWay);
    //     if(this.purchaseChannel=='1'&& requirementsNextStore.this_purchaseWay=='2'){
    //         requirementsNextStore.dataSource.slice().map((index)=>{
    //                 list.push({id:index.id,materialCode:index.materialCode,supplierCode:requirementsNextStore.supplierCode})
                    
    //         })
    //         requirementsNextStore.fetchExistPrice({list:list}).then(json=>{
    //             if(json.status===2000){
    //                 if(json.data.list&&json.data.list.length>0){
    //                     message.error('有些物料未找到对应的采购价格');
    //                 }else{
    //                     store.dispatch(TabsAct.TabRemove("requirementsNext", "requirementsConfrim"));
    //                     store.dispatch(TabsAct.TabAdd({
    //                         title: "采购需求单",
    //                         key: "requirementsConfrim"
    //                     }));
    //                 }
    //             }
    //         })
    //     }else{
    //         store.dispatch(TabsAct.TabRemove("requirementsNext", "requirementsConfrim"));
    //         store.dispatch(TabsAct.TabAdd({
    //             title: "采购需求单",
    //             key: "requirementsConfrim"
    //         }));
    //     }
    // }
    handleSubmit= (e) => {
        e.preventDefault();
        this.validateFds((err, data) => {
            if (!err) {
               let source=[].concat(JSON.parse(JSON.stringify(toJS(requirementsNextStore.dataSource))));
               data.planReceiveDate = data.planReceiveDate?moment(data.planReceiveDate).format('YYYY-MM-DD'):"";
               data.list=source;
               data.orderType=Number(data.orderType);
               data.purchaseType=Number(data.purchaseType);
               data.purchaseChannel=Number(data.purchaseChannel);
               data.purchaseWay=Number(data.purchaseWay);
               data.purchaseRule=Number(data.purchaseRule);
               data.deliveryAskFor=Number(data.deliveryAskFor);
               this.nextData=data;
               let getData=[];
               let ids=[];
               let orderCodes=[];
               let siteAttr=[],orderAttr=[];
               requirementsNextStore.existPrice=[];
            //    1.先判断收货站点是否是同一个站点
            //    2.在判断业务类型是否是同一个业务类型
            //    3.判断采购规则是否是按照物料合并

               this.nextData.list.map((x,index)=>{
                    siteAttr.unshift(x.siteCode);
                    orderAttr.unshift(x.orderType);
                    let siteLen=siteAttr.filter(value=>value=="").length+siteAttr.filter(value=>value==requirementsNextStore.siteCode).length;
                    let orderLen=orderAttr.filter(value=>value=="0").length+orderAttr.filter(value=>value==requirementsNextStore.this_form.this_orderType).length;
                    if(siteLen==siteAttr.length&&orderLen==orderAttr.length){
                       
                        if(this.nextData.purchaseRule==2){
                             x.purchaseQty=x.requireQty;//采购数量
                             x.purchaseUnit=x.baseUnitCode;//采购单位code
                             x.purchaseUnitName=x.baseUnitName;//采购单位名称 
                             
                        }
                    }
                    
                    
                    ids.push(x.id);
                    orderCodes.push(x.orderCode);
                    this.resultarr=[...new Set(ids)].join(",");//数组去重
                    this.resultCode=[...new Set(orderCodes)].join(",");//数组去重

               })
               let siteLen=siteAttr.filter(value=>value=="").length+siteAttr.filter(value=>value==requirementsNextStore.siteCode).length;
               let orderLen=orderAttr.filter(value=>value=="0").length+orderAttr.filter(value=>value==requirementsNextStore.this_form.this_orderType).length;
               if(siteLen!=siteAttr.length){
                     this.state.siteCodeInfo=true;
               }else if(orderLen!=orderAttr.length){
                    this.state.orderTypeInfo=true;
               }else if(requirementsNextStore.this_form.this_purchaseChannel=='1'&& requirementsNextStore.this_form.this_purchaseWay=='2'){
                    requirementsNextStore.dataSource.slice().map((index)=>{
                            requirementsNextStore.existPrice.push({id:index.id,materialCode:index.materialCode,supplierCode:requirementsNextStore.supplierCode})
                            
                    })
                    requirementsNextStore.fetchExistPrice({list:requirementsNextStore.existPrice}).then(json=>{
                        if(json.status===2000){
                            if(json.data.list&&json.data.list.length>0){
                                message.error('有些物料未找到对应的采购价格');
                                //this.setState({nextInfo:false})
                            }else{
                                store.dispatch(TabsAct.TabRemove("requirementsNext", "requirementsConfrim"));
                                store.dispatch(TabsAct.TabAdd({
                                    title: "采购需求单",
                                    key: "requirementsConfrim"
                                }));
                            }
                        }
                    })
                }
               else{
                    store.dispatch(TabsAct.TabRemove("requirementsNext", "requirementsConfrim"));
                    store.dispatch(TabsAct.TabAdd({
                        title: "采购需求单",
                        key: "requirementsConfrim"
                    }));
               }
               
               if(this.nextData.purchaseRule==1){
                    let arr = this.nextData.list;
                    let arr_new=new Array();
                    for(let i=0;i<arr.length;i++){
                        let sub_arr=arr[i];
                        let flag=0;
                        for(let n=0;n<arr_new.length;n++){
                            let sub_arr_new=arr_new[n];
                            if(sub_arr_new.materialCode==sub_arr.materialCode){
                                sub_arr_new.requireQty=parseInt(sub_arr_new.requireQty)+parseInt(sub_arr.requireQty);
                                sub_arr_new.requireQty=Number(sub_arr_new.requireQty).toFixed(2);
                                sub_arr_new.purchaseQty=sub_arr_new.requireQty;
                                sub_arr_new.purchaseUnitName=sub_arr.baseUnitName;
                                sub_arr_new.purchaseUnit=sub_arr.baseUnitCode;
                                if(requirementsNextStore.this_form.this_deliveryAskFor=='2'){
                                    if(Date.parse(sub_arr.planReceiveDate)>Date.parse(sub_arr_new.planReceiveDate)){
                                        sub_arr_new.planReceiveDate=sub_arr.planReceiveDate;
                                    }
                                }else{
                                    if(Date.parse(sub_arr.planReceiveDate)<Date.parse(sub_arr_new.planReceiveDate)){
                                        sub_arr_new.planReceiveDate=sub_arr.planReceiveDate;
                                    }
                                    
                                }
                                if(sub_arr_new.orderCode!=sub_arr.orderCode){
                                    delete sub_arr_new.orderCode;
                                    delete sub_arr.orderCode;
                                }
                               flag=1;
                                
                            }
                        }
                        
                        if(flag==0){
                            arr_new[arr_new.length]=sub_arr;
                            sub_arr.requireQty=Number(sub_arr.requireQty).toFixed(2);
                            sub_arr.purchaseQty=sub_arr.requireQty;
                            sub_arr.purchaseUnitName=sub_arr.baseUnitName;
                            sub_arr.purchaseUnit=sub_arr.baseUnitCode;
                        }
                    }
                    
                    for(let n=0;n<arr_new.length;n++){
                        let sub_arr_new=arr_new[n];
                        getData.push(sub_arr_new);
                        this.nextData.ids=this.resultarr;
                        this.nextData.orderCodes=this.resultCode;
                        this.nextData.list=getData.slice();
                        requirementsConfrimStore.list=this.nextData;
                    }
               }else{
                   this.nextData.ids=this.resultarr;
                   this.nextData.orderCodes=this.resultCode;
                   requirementsConfrimStore.list=this.nextData;
               }
               
            }
        });
    }
    handleNotSubmit= () => {
       
    }
    disabledDate=(date)=> {
        return date < moment().endOf('day');
    }
    getComp = () => {
        let formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        let {supplierList,orderType,deptList,purchaseType,empList,purchaseChannel,siteList,addressCode,purchaseRule,purchaseWay,deliveryAskFor,ComAddressList,this_form}=requirementsNextStore;
        let {mark,list}=requirementsConfrimStore;
        if( requirementsNextStore.this_form.this_orderType=="3"){
            this.purchaseType='1';
        }
        return (
            <div>
                <Form >
                    <div style={{borderBottom:'1px solid #e2e2e2',position:'relative',marginTop:20,paddingBottom:22}}>
                        <Row>
                            <Col span={8}>
                                <FormItem label="业务类型" {...formItemLayout} >
                                    {this.getFD('orderType', {
                                        initialValue: mark?""+list.orderType:this_form.this_orderType,
                                    })(
                                            <Select   style={{ width: 200,verticalAlign:'top'}} onChange={this.orderTypeChange}>
                                                {
                                                    orderType.map(order => {
                                                        return <Select.Option value={order.catCode} key={order.catCode}>{order.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="指定供应商" {...formItemLayout} >
                                    {this.getFD('supplierCode', {
                                        initialValue: mark?""+list.supplierCode:this_form.this_supplier,
                                        rules:this_form.this_purchaseWay=='1'?[
                                            {required:false}
                                        ]: [
                                            {
                                                type: "autoselect",
                                                list: supplierList.slice(),
                                                keyName: "supplierCode",
                                                message: "请从下拉列表中选择一项！",
                                            },
                                            { required: true, message: '指定供应商 必填！' }
                                        ],
                                    })(
                                            <AutoSelectComp
                                                selectedList={supplierList.slice()}
                                                onSelect={this.supplierListSelect}
                                                onSearch={this.supplierListSearch}
                                                displayName={["supplierCode", "bpFull"]}
                                                keyName={"supplierCode"}
                                                style={{width:200}}
                                            />
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="采购部门" {...formItemLayout} >
                                    {this.getFD('deptCode', {
                                        initialValue: mark?""+list.deptCode:this_form.this_dept?this_form.this_dept:requirementsNextStore.defaultDept,
                                        rules:[
                                            {
                                                type: "autoselect",
                                                list: deptList.slice(),
                                                keyName: "orgCode",
                                                message: "请从下拉列表中选择一项！",
                                            }
                                        ],
                                    })(
                                            <AutoSelectComp
                                                selectedList={deptList.slice()}
                                                onSelect={this.deptListSelect}
                                                onSearch={this.deptListSearch}
                                                displayName={["orgCode", "orgName"]}
                                                keyName={"orgCode"}
                                                style={{width:200}}
                                            />
                                        )}
                                </FormItem>
                            
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="采购类型" {...formItemLayout} >
                                    {this.getFD('purchaseType', {
                                        initialValue: mark?""+list.purchaseType:this.purchaseType,
                                    })(
                                            <Select   style={{ width: 200,verticalAlign:'top'}} disabled>
                                                {
                                                    purchaseType.map(purchase => {
                                                        return <Select.Option value={purchase.catCode} key={purchase.catCode}>{purchase.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="期望收货日期" {...formItemLayout} >
                                    {this.getFD('planReceiveDate', {
                                        initialValue: mark?moment(""+list.planReceiveDate):this_form.this_planReceiveDate?moment(this_form.this_planReceiveDate):"",
                                        rules: [{ required: true, message: '期望收货日期 必填！' }],
                                        
                                    })(
                                            <DatePicker style={{ width: 200 }} onChange={this.planReceiveDateChange} disabledDate={this.disabledDate}/>
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="业务员" {...formItemLayout} >
                                    {this.getFD('empCode', {
                                        initialValue: mark?""+list.empCode:this_form.this_emp?this_form.this_emp:requirementsNextStore.defaultPerson,
                                        rules:[
                                            {
                                                type: "autoselect",
                                                list: empList.slice(),
                                                keyName: "empCode",
                                                message: "请从下拉列表中选择一项！",
                                            }
                                        ],
                                    })(
                                            <AutoSelectComp
                                                selectedList={empList.slice()}
                                                onSelect={this.empListSelect}
                                                onSearch={this.empListSearch}
                                                displayName={["empCode", "empName"]}
                                                keyName={"empCode"}
                                                style={{width:200}}
                                            />
                                        )}
                                </FormItem>
                            
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="采购渠道" {...formItemLayout} >
                                    {this.getFD('purchaseChannel', {
                                        initialValue: mark?""+list.purchaseChannel:this_form.this_purchaseChannel,
                                    })(
                                            <Select   style={{ width: 200,verticalAlign:'top'}} onChange={this.purchaseChannelChange}>
                                                {
                                                    purchaseChannel.map(purchaseChannel => {
                                                        return <Select.Option value={purchaseChannel.catCode} key={purchaseChannel.catCode}>{purchaseChannel.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="收货站点" {...formItemLayout} >
                                    {this.getFD('siteCode', {
                                        initialValue: mark?""+requirementsNextStore.siteCode:this_form.this_site?this_form.this_site:requirementsStore.redMessage?"":requirementsStore.siteCodeAttr[0],
                                        rules: [
                                            {
                                                type: "autoselect",
                                                list: siteList.slice(),
                                                keyName: "siteCode",
                                                message: "请从下拉列表中选择一项！",
                                            },
                                            { required: true, message: '收货站点 必填！' }
                                        ],
                                    })(
                                    
                                        <AutoSelectComp
                                            selectedList={siteList.slice()}
                                            onSelect={this.siteListSelect}
                                            onSearch={this.siteListSearch}
                                            displayName={["siteCode", "siteName"]}
                                            keyName={"siteCode"}
                                            style={{width:200}}
                                        />
                                            
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="采购规则" {...formItemLayout} >
                                    {this.getFD('purchaseRule', {
                                        initialValue: mark?""+list.purchaseRule:this_form.this_purchaseRule,
                                        
                                    })(
                                        <Select   style={{ width: 200,verticalAlign:'top'}} onChange={this.purchaseRuleChange} disabled>
                                                {
                                                    purchaseRule.map(purchaseRule => {
                                                        return <Select.Option value={purchaseRule.catCode} key={purchaseRule.catCode}>{purchaseRule.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                </FormItem>
                            
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label="采购方式" {...formItemLayout} >
                                    {this.getFD('purchaseWay', {
                                        initialValue: mark?""+list.purchaseWay:this_form.this_purchaseWay,
                                    })(
                                            <Select   style={{ width: 200,verticalAlign:'top'}} onChange={this.purchaseWayChange} disabled={this_form.this_purchaseWay=="3"?true:false}>
                                                {
                                                    purchaseWay.map(purchaseWay => {
                                                        return <Select.Option value={purchaseWay.catCode} key={purchaseWay.catCode}>{purchaseWay.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                            
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="收货地址" {...formItemLayout} >
                                    {this.getFD('receivingAddress', {
                                        initialValue: mark?""+list.receivingAddress:this_form.this_address?this_form.this_address:addressCode,
                                        rules:this_form.this_purchaseWay=='1'?[
                                            {required:false},
                                            {
                                                type: "autoselect",
                                                list: ComAddressList.slice(),
                                                keyName: "addressCode",
                                                message: "请从下拉列表中选择一项！",
                                            },
                                        ]: [
                                            {
                                                type: "autoselect",
                                                list: ComAddressList.slice(),
                                                keyName: "addressCode",
                                                message: "请从下拉列表中选择一项！",
                                            },
                                            { required: true, message: '收货地址 必填！' }
                                        ],
                                    })(
                                            
                                            <AutoSelectComp
                                                selectedList={ComAddressList.slice()}
                                                onSelect={this.ComAddressSelect}
                                                onSearch={this.ComAddressSearch}
                                                displayName={[ "countryName","cityName","countyName","addressDetl"]}
                                                keyName={"addressCode"}
                                                format="{0}{1}{2}{3}"
                                                style={{width:200}}
                                            />
                                        )}
                                </FormItem>
                            
                            </Col>
                            <Col span={8}>
                                <FormItem label="交期要求" {...formItemLayout} >
                                    {this.getFD('deliveryAskFor', {
                                        initialValue: mark?(list.deliveryAskFor?""+list.deliveryAskFor:""):this_form.this_deliveryAskFor,
                                         //initialValue: ((data.gender && data.gender[0]) ? data.gender[0].genderCode : '') || '',
                                        
                                    })(
                                        this_form.this_purchaseRule=="1"?
                                        <Select   style={{ width: 200,verticalAlign:'top'}} onChange={this.deliveryAskForChange}>
                                            {
                                                deliveryAskFor.map(deliveryAskFor => {
                                                    return <Select.Option value={deliveryAskFor.catCode} key={deliveryAskFor.catCode}>{deliveryAskFor.catName}</Select.Option>
                                                })
                                            }
                                        </Select>:
                                        <Select   style={{ width: 200,verticalAlign:'top'}} disabled>
                                            {
                                                deliveryAskFor.map(deliveryAskFor => {
                                                    return <Select.Option value={deliveryAskFor.catCode} key={deliveryAskFor.catCode}>{deliveryAskFor.catName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                        )}
                                </FormItem>
                            
                            </Col>
                        </Row>
                        <div style={{position:'absolute',bottom:'10px',right:'20px'}}>
                            <a  href="#" onClick={() => {
                                this.setState({ show: !this.state.show })
                            }}>{this.state.show ? '收起更多隐藏信息' : '展开更多隐藏信息'}
                            </a>
                        </div>
                    </div>
                    <div style={{ display: this.state.show ? `block` : `none`,margin:'12px 0',borderBottom:'1px solid #e2e2e2'}}>
                        <Row>
                            <Col span={16}>
                                <FormItem label="备注"
                                 labelCol= {{span:4}}
                                 wrapperCol={ {span:16}}
                                 
                                 >
                                    {this.getFD('remark', {
                                        initialValue:mark?""+list.remark:this_form.this_remark,
                                        rules: [{min:0,max:200,message:'最多允许200字符'}],
                                    })(
                                            <Input type='textarea' style={{ height: '88px',width:'781px'}} onChange={this.remarkChange}/>
                                        )}
                                </FormItem>
                            </Col>
                            <Col span={4}></Col>
                            <Col span={4}></Col>
                        </Row>
                    </div>
                </Form>
                
                {this.state.orderTypeInfo?
                    <Modal title="提示" visible={this.state.orderTypeInfo}
                            onCancel={() => this.setState({ orderTypeInfo: false })}
                            footer={[
                                <Button key="submit" type="primary" size="large"
                                    onClick={ this.onOk}>
                                    确定
                            </Button>,
                            <Button key="cancel" type="primary" size="large"
                                    onClick={() => this.setState({ orderTypeInfo: false })}>
                                    取消
                            </Button>,
                            ]}>
                            <p>明细中存在非'<span>{requirementsNextStore.orderType[requirementsNextStore.this_form.this_orderType-1].catName}</span>'的数据，确定要执行吗？</p>
                        </Modal>
                    
                    :null}
                {this.state.siteCodeInfo?
                    <Modal title="提示" visible={this.state.siteCodeInfo}
                            onCancel={() => this.setState({ siteCodeInfo: false })}
                            footer={[
                                <Button key="submit" type="primary" size="large"
                                    onClick={()=>this.setState({ siteCodeInfo: false })}>
                                    确定
                            </Button>,
                            <Button key="cancel" type="primary" size="large"
                                    onClick={() => this.setState({ siteCodeInfo: false })}>
                                    取消
                            </Button>,
                            ]}>
                            <p>明细中存在非'<span>{this.siteName}</span>'的收货站点，请调整后重试！</p>
                        </Modal>
                    
                    :null}
            </div>
        )
    }

    onOk=()=>{
        //let data=requirementsNextStore.sourceData.slice();
        this.setState({ orderTypeInfo: false })
        //this.isSupplierPrice()
        store.dispatch(TabsAct.TabRemove("requirementsNext", "requirementsConfrim"));
        store.dispatch(TabsAct.TabAdd({
            title: "采购需求单",
            key: "requirementsConfrim"
        }));
        this.nextData.list.map((x)=>{
            x.purchaseQty=x.requireQty;//采购数量
            x.purchaseUnit=x.baseUnitCode;//采购单位code
            x.purchaseUnitName=x.baseUnitName;//采购单位名称 
        })
         requirementsConfrimStore.list=this.nextData;
            
    
        
    }
      
    componentDidMount() {
         //requirementsStore.toback=true;
        requirementsNextStore.purchaseWay.splice(2,1);
        if(this.getFdv("purchaseChannel")=="2"){
            requirementsNextStore.purchaseWay.splice(2,0,
               {
                    "catCode": '3',
                    "catName": "采购订单"
                }
           )
        }
        requirementsNextStore.this_form.this_purchaseChannel==1?
        requirementsNextStore.fetchSupplierList({isEnterPlatform:1,status:1,page:1,pageSize:10}):
        requirementsNextStore.fetchSupplierList({status:1,page:1,pageSize:10});//供应商

        requirementsNextStore.fetchLogin({page:1,pageSize:10})//当前登录采购部门
            .then(json=>{
                //登录有部门的情况
                if(json.data.deptCode){
                    this.deptCode=json.data.deptCode;
                    requirementsNextStore.defaultDept=json.data.deptCode;
                    requirementsNextStore.defaultPerson=json.data.empCode;
                     //console.log(json.data.deptCode);
                    //console.log(requirementsStore.toback);
                    // if(requirementsStore.toback){
                        
                    //     this.setFdv({ 
                    //         "deptCode":requirementsNextStore.this_form.this_dept,
                    //         "empCode":requirementsNextStore.this_form.this_emp,

                    //     })
                    // }
                    //部门
                    requirementsNextStore.fetchDeptList({orgCode:"",status:1,page:1,pageSize:10})
                    //员工
                    requirementsNextStore.fetchEmpList({deptCode:0,page:1,pageSize:10})
                    requirementsNextStore.selectName.deptName=json.data.deptName;
                    requirementsNextStore.selectName.empName=json.data.empName;
                }else{
                    requirementsNextStore.fetchDeptList({orgCode:"",status:1,page:1,pageSize:10})
                   
                }
                
            })
        requirementsNextStore.fetchSiteList({status:1,page:1,pageSize:10})//获取站点下拉
        // if(requirementsNextStore.closeTables){
        //     requirementsNextStore.resetData();
        // }
        // if(requirementsStore.toback){
            
       // }
        
        
        
    }    

    ToBack=()=>{
        store.dispatch(TabsAct.TabRemove("requirementsNext", "requirements"));
        store.dispatch(TabsAct.TabAdd({
            title: "采购需求单",
            key: "requirements"
        }));
        requirementsStore.toback=true;
        requirementsConfrimStore.mark=false;
       // requirementsNextStore.closeTables=true;
    }
    clearAll=()=>{
        let {defaultPerson,defaultDept}=requirementsNextStore;
        this.setFdv({ 
            "orderType":"1",
            "supplierCode":"",
            "deptCode":defaultDept,
            "purchaseType":"0",
            "planReceiveDate":"",
            "empCode":defaultPerson,
            "purchaseChannel":"1",
            "siteCode":"",
            "purchaseRule":"1",
            "purchaseWay":"1",
            "receivingAddress":"",
            "deliveryAskFor":"1",
            "remark":""
        })
        requirementsStore.middleData=[];
        requirementsNextStore.dataSource=[];
        this.state.nextInfo=false;
        delete requirementsStore.searchPm.notIn;
    }

    render() {
        let {dataSource}=requirementsNextStore;
        let data=[].concat(JSON.parse(JSON.stringify(toJS(dataSource))));
        return (
            <div>
                <div style={{margin:'20px 0',border:'1px solid #e2e2e2',borderBottom:'none'}}>
                    <div style={{height:'80px',lineHeight:'80px',borderBottom:'1px solid #e2e2e2'}}>
                        <Breadcrumb separator=">" style={{float:'left',marginLeft:'14px',fontSize:'14px',color:'#000'}}>
                            <Breadcrumb.Item >1.筛选</Breadcrumb.Item>
                            <Breadcrumb.Item style={{color:'#4c80cf'}}>2.执行</Breadcrumb.Item>
                            <Breadcrumb.Item >3.确认</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{float:'right',marginRight:'16px'}}>
                            <Popconfirm title={
                                <div>
                                    <h5>确定要清空数据吗？</h5>
                                </div>
                            }
                            onConfirm={()=>this.clearAll()}
                            >
                                <Button type="primary" style={{height:30,background:"#4c80cf" }} >清空</Button>
                            </Popconfirm>
                            
                            <Button type="primary" style={{width:103,height:30,background:"#4c80cf",marginLeft:"10px" }} onClick={this.ToBack}><i className="c2mfont c2m-left" style={{fontSize:14,margin:'0 3px 0 -4px'}}></i>返回上一步</Button>
                            <Button type={this.state.nextInfo?"primary":"default"} style={{width:85,height:30,margin:'0 20px 0 10px',background:this.state.nextInfo?"#4c80cf":"#fff",border:this.state.nextInfo?'1px solid #4c80cf':'1px solid #e2e2e2',color:this.state.nextInfo?'#fff':'#e2e2e2'}} onClick={this.state.nextInfo?this.handleSubmit:this.handleNotSubmit} >下一步<i className="c2mfont c2m-right" style={{fontSize:14,margin:'0 4px 0 4px'}}></i></Button>
                        </div>
                    </div>
                    
                    {this.getComp()}
                </div>
                <div style={{margin:'20px auto 12px',fontSize:'14px',color:'#4a4a4a'}}>物料信息</div>
                <Table dataSource={data.slice() || null} columns={this.columns}
                    rowKey={"id"}
                    pagination={{
                        total: data.list ? data.list.length : 0,
                        showTotal: (total) => `总共 ${total} 条记录`,
                        pageSizeOptions: ['10', '15', '20', '50'],
                        showSizeChanger: true,
                    }}
                    scroll={{ x: 2200 }}
                />
            </div>
        )
    }
}
export default Form.create()(RequirementsComp);