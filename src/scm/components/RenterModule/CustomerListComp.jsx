import React, { Component } from "react";
import { Button, Popconfirm, message, Select } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import { shouldComponentUpdate,formatNullStr } from '../../../base/consts/Utils';
import SearchBarComp from '../../../base/components/SearchBarComp';
import TXT from '../../languages';
import TooltipComp from "../../../base/components/TooltipComp";
const T = TXT.SUPPLIER;
const Option = Select.Option;


const columns = [
{
    title: '客户编码',
    dataIndex: 'customerCode',
    key: 'customerCode',
    width:118,
},
{
    title: '客户全称',
    dataIndex: 'bpFull',
    key: 'bpFull',
    render: (text, record, index) =>  <TooltipComp attr={{ text: text, wid: 130, placement: 'left' }} />,
},
{
    title: '客户简码',
    dataIndex: 'briefCode',
    key: 'briefCode',
},
{
    title: '客户简称',
    dataIndex: 'customerAbt',
    key: 'customerAbt',
    render: (text, record, index) =>  <TooltipComp attr={{ text: text, wid: 80, placement: 'left' }} />,
},
{
    title: '客户类型',
    dataIndex: 'customerType',
    key: 'customerType',
    render: (text, record, index) => window.ENUM.getEnum("supplierType", text+""),
},
{
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width:68,
    render: (text, record, index) => window.ENUM.getEnum("supplierStauts", text+""),
},
{
    title: 'langCode',
    dataIndex: 'langCode',
    key: 'langCode',
    hidden:true,
},
{
    title: '更新人',
    dataIndex: 'updateByName',
    key: 'updateByName',
    width:72
}, {
    title: '更新时间',
    dataIndex: 'updateDate',
    key: 'updateDate',
    width:140
}, {    
    dataIndex: 'handle',
    title: '操作',
    className:'handle',
    width:94
}];

class SupplierComp extends Component {
    constructor(props, context) {
        super(props, context);
        columns[0].render=(txt,record,index)=>
           <a href="#" onClick={()=>this.CustomerViewShow(record.id,record.uscc,record.customerCode)}>{record.customerCode}</a>
        columns[columns.length - 1].render = (txt, record, index) =>
            <div style={{textAlign:'center'}} className="proReturn_handle">
                <span title="编辑" className="operator-color operator" href="javascript:;" onClick={() => this.editCustomer(record.id,record.uscc,record.customerCode)}>
                    <i className="c2mfont c2m-bianji"></i>
                </span>
                
                {
                    record.status=='0'?
                    <Popconfirm title={
                        <div>
                            <h5>{T.DELSUPPLIER}</h5>
                            <p>{T.DELSUPPLIER_OK}</p>
                        </div>
                    }
                    onConfirm={()=>this.delCustomer(record.id)}
                    >
                       <span title="删除" className="operator-color operator" href="javascript:;">
                            <i className="c2mfont c2m-shanchu"></i>
                        </span>
                    </Popconfirm>:<span className="line">{formatNullStr('')}</span>
                }
            </div>
            this.searchData={
                left:[
                {
                    key:"customerCode",
                    val:"客户编码",
                    type:"string"
                },
                {
                    key:"bpFull",
                    val:"客户全称",
                    type:"string"
                },
                {
                    key:"briefCode",
                    val:"客户简码",
                    type:"string"
                },
                {
                    key:"customerAbt",
                    val:"客户简称",
                    type:"string"
                },
               {
                    key: "customerType",
                    val: "客户类型",
                    type: "select",
                    data: {
                        list: window.ENUM.getEnum("supplierType"),
                        keyName: "catCode",
                        labelName: "catName",
                        style: { width: 200 }
                    }
                },
                {
                    key: "status",
                    val: "状态",
                    type: "select",
                    data: {
                        list: window.ENUM.getEnum("supplierStatus"),
                        keyName: "catCode",
                        labelName: "catName",
                        style: { width: 200 },
                       
                       
                    },
                     
                },
            ],
            center: [
                {
                    title: "查询",
                    Func: null,
                    style: {},
                    type: "button"
                }
            ],
            right:[
                {
                    title:"新建",
                    Func:this.AddCustomer,
                    style:{}
                },
                {
                    title:"导入",
                    Func:this.importViewVisiable,
                    style:{}
                }
            ]
        }
    }

    AddCustomer=()=>{
        this.props.customerLoading(true);
        this.props.AddModul();
        this.props.getDept({"orgType":3,"status":1});
        this.props.getBusinessPartnerData({
            "page": "1",
            "pageSize": "10"
        });
        this.props.getCurrencyList({
            "page": "1",
            "pageSize": "10"
        });
        this.props.defaultUser().then(json => {
            //结算方式 C014，付款条件 C013，行业 C015，经营类型 C019，公司性质 C018，公司规模 C016, 发票类型 C021
            let subCode = [ "C013", "C015", "C019", "C018", "C016", "C021"];
            subCode.map((item) => {
                this.props.getSubjectList({ "subCode": item, "status": 1, "page": 1, "pageSize": 10 });
            });
            this.props.settleList({status:1,page:1,pageSize:10})
            let de=json.data.deptCode;
            if(de==""){
                this.props.getDept({ "orgCode":"","orgType": 3, "status": 1, "page": 1, "pageSize": 10 })
            }
            if(de){
                this.props.getDept({ "orgCode": de,"orgType": 3, "status": 1, "page": 1, "pageSize": 10 }).then(json=>{
                    if(json.data.list&&json.data.list.length>0){
                        this.props.getEmployeesList({ "deptCode": de, "page": 1, "pageSize": 10 });
                    }else{
                        this.props.getDept({ "orgCode":"","orgType": 3, "status": 1, "page": 1, "pageSize": 10 })
                    }
                })
            }
            

            // if(json.data.deptCode){
                
            // }
            
        });//新增默认用户 给负责人加默认值

    }

    editCustomer=(id,uscc,customerCode)=>{
        this.props.EditModul();
        this.props.customerLoading(true);
        this.props.getEditData(id, 'edit',uscc,customerCode,"customer").then(data => {
            //结算方式 C014，付款条件 C013，行业 C015，经营类型 C019，公司性质 C018，公司规模 C016, 发票类型 C021
            let param = [
                { "subCode": "C013", "catCode": data.paymentOrgCode },
                { "subCode": "C015", "catCode": data.scmBp.tradeTypeCode },
                { "subCode": "C019", "catCode": data.scmBp.businessTypeCode },
                { "subCode": "C018", "catCode": data.scmBp.companyTypeCode },
                { "subCode": "C016", "catCode": data.scmBp.companyScaleCode },
                { "subCode": "C021", "catCode": data.invoiceTypeCode }
            ]
            this.props.settleList({settleCode:data.settlementCode,status:1,page:1,pageSize:10})
            this.props.getDept({ "orgCode": data.deptCode, "orgType": 3, "status": 1, "page": 1, "pageSize": 10 });
            if(data.deptCode){
                this.props.getEmployeesList({ "deptCode": data.deptCode, "employeeCode": data.empCode, "page": 1, "pageSize": 10 });
            }
            
            this.props.getBusinessPartnerData({
                "bpCode":data.paymentOrgCode,
                "page": "1",
                "pageSize": "10"
            });
            this.props.getCurrencyList({
                "page": "1",
                "pageSize": "10"
            })
            param.map((item) => {
                this.props.getSubjectList({ ...item, "status": 1, "page": 1, "pageSize": 10 });
            });
        });
    }

    CustomerViewShow =(id,uscc,customerCode)=>{
        this.props.CustomerViewClick();
        this.props.customerBaseLoading(true);
        this.props.getEditData(id,'detail',uscc,customerCode);
        this.props.ContactList({uscc:uscc,page:1,pageSize:10})
    };   

    delCustomer=(id)=>{
        this.props.delCustomer({id})
        .then(json=>{
            if(json.status==2000){
                this.props.tablePaging();
            }
        });
    }

    importViewVisiable=()=>{
        this.props.importViewVisiable();
    }

    render() {
        let { onSearch, SearchVal, status, tabLoading, tablePaging,AddModul, onSelect, ...props } = this.props;
        return (
            <div>
                <SearchBarComp
                    {...props}
                    onSearch={onSearch}
                    searchData={this.searchData}
                />
                <div className="customer-body">
                    <MTable
                        {...props}
                        loading={tabLoading}
                        cols={columns}
                        rowKey={"id"}
                        pageOnChange={tablePaging}
                    />
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.props.tablePaging(1);
        this.props.isAuto({businessIndex:'45'});
    }
}

export default SupplierComp;
