import React, { Component } from "react";
import { Button, Popconfirm, message, Select } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import SearchBarComp from '../../../base/components/SearchBarComp';
import OperationsComp from '../../../base/components/OperationsComp';
import TooltipComp from "../../../base/components/TooltipComp";
import {formatNullStr } from '../../../base/consts/Utils';
import TXT from '../../languages';

const T = TXT.SUPPLIER;
const Option = Select.Option;
const columns = [
    {
        title: '供应商编码',
        dataIndex: 'supplierCode',
        key: 'supplierCode',
        width:'132px',
    },
    {
        title: 'deptCode',
        dataIndex: 'deptCode',
        key: 'deptCode',
        hidden: true,
    },
    {
        title: '供应商全称',
        dataIndex: 'bpFull',
        key: 'bpFull',
        render: (text, record, index) =>  <TooltipComp attr={{ text: text, wid: 130, placement: 'left' }} />,
    },
    {
        title: '供应商简码',
        dataIndex: 'briefCode',
        key: 'briefCode',
    }, {
        title: '供应商简称',
        dataIndex: 'supplierAbt',
        key: 'supplierAbt',
        render: (text, record, index) =>  <TooltipComp attr={{ text: text, wid: 80, placement: 'left' }} />,
    }, 
    {
        title: '供应商类型',
        dataIndex: 'supplierType',
        key: 'supplierType',
        render: (text, record, index) => window.ENUM.getEnum("supplierType", text+""),
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width:68,
        render: (text, record, index) => window.ENUM.getEnum("supplierStauts", text+""),
    },{
        title: '更新人',
        dataIndex: 'updateByName',
        key: 'updateByName',
        width: 94,
    }, {
        title: '更新时间',
        dataIndex: 'updateDate',
        key: 'updateDate',
        width: 140,
    }, {
        dataIndex: 'handle',
        title: '操作',
        width: 94,
        className:'handle',
        className: 'table-operation'
    }];



class SupplierComp extends Component {
    constructor(props, context) {
        super(props, context);


        columns[0].render = (txt, record, index) =>
            <a href="#" onClick={() => this.SupplierViewShow(record.id,record.uscc,record.supplierCode)}>{record.supplierCode}</a>

        columns[columns.length - 1].render = (txt, record, index) => 
            <div style={{textAlign:'center'}} className="proReturn_handle">
                <span title="编辑" className="operator-color operator" href="javascript:;" onClick={() => this.editSupplier(record.id,record.uscc,record.supplierCode)}>
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
                     onConfirm={() => this.delSupplier(record.id)}
                    >
                       <span title="删除" className="operator-color operator" href="javascript:;">
                            <i className="c2mfont c2m-shanchu"></i>
                        </span>
                    </Popconfirm>:<span className="line">{formatNullStr('')}</span>
                }
            </div>
        // {
        //     let opts = [
        //         {
        //             title: '编辑',
        //             titleText: [],
        //             icon: '',
        //             fun: () => this.editSupplier(record.id,record.uscc,record.supplierCode),
        //             show: true,
        //         },
        //         {
        //             title: "删除",
        //             titleText: ['确定删除该条订单吗？', '删除后，该条订单记录将不可恢复！'],
        //             icon: '',
        //             show: record.status == 0,
        //             fun: () => this.delSupplier(record.id),
        //         },
        //     ];
        //     return <OperationsComp operations={opts} />;
        // };
                
            // <div>
            //     <a href="#" onClick={() => this.editSupplier(record.supplierCode, record.langCode, record.deptCode)} >编辑 </a>
            //     {
            //         record.status == 0 ? <Popconfirm title={
            //             <div>
            //                 <h5>{T.DELSUPPLIER}</h5>
            //                 <p>{T.DELSUPPLIER_OK}</p>
            //             </div>
            //         }
            //             onConfirm={() => this.delSupplier(record.supplierCode, record.langCode)}
            //         >
            //             <a href="#">删除</a>
            //         </Popconfirm> : null
            //     }

            // </div>
            this.searchData={
                left:[
                {
                    key:"supplierCode",
                    val:"供应商编码",
                    type:"string"
                },
                {
                    key:"bpFull",
                    val:"供应商全称",
                    type:"string"
                },
                {
                    key:"supplierAbt",
                    val:"供应商简称",
                    type:"string"
                },
                {
                    key:"briefCode",
                    val:"供应商简码",
                    type:"string"
                },
                 {
                    key: "supplierType",
                    val: "供应商类型",
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
                        style: { width: 200 }
                    }
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
                    Func:this.AddSupplier,
                    style:{}
                },
                {
                    title:"导入",
                    Func: this.props.importViewVisiable,
                    style:{}
                }
            ]
        }
    }


    SupplierViewShow = (id,uscc,supplierCode) => {
        this.props.getEditData(id,'detail',uscc,supplierCode);
        this.props.SupplierViewClick();
        this.props.SupplierBaseLoading();
        this.props.ContactList({uscc:uscc,page:1,pageSize:10})
        //this.props.ContactList({bpCode:supplierCode,page:1,pageSize:10})
    };
    AddSupplier = () => {
        //结算方式 C014，付款条件 C013，行业 C015，经营类型 C019，公司性质 C018，公司规模 C016, 发票类型 C021
        let subCode=["C013","C015","C019","C018","C016","C021"]
        this.props.AddModul();
        this.props.supplierLoading(true);
        this.props.getUserInfo().then(data => {
            let de=data.deptCode;
            if(de==""){
                  this.props.getDept({ "orgCode":"","orgType": 2, "status": 1, "page": 1, "pageSize": 10 })
            }
            if(de){
                this.props.getDept({ "orgCode": de,"orgType": 2, "status": 1, "page": 1, "pageSize": 10 }).then(json=>{
                    if(json.data.list&&json.data.list.length>0){
                        this.props.getEmployeesList({ "deptCode": de, "page": 1, "pageSize": 10 });
                    }else{
                        this.props.getDept({ "orgCode":"","orgType": 2, "status": 1, "page": 1, "pageSize": 10 })
                    }
                })
            }
            

            subCode.map((item)=>{
                this.props.getSubjectList({"subCode":item,"status":1,"page":1,"pageSize":10});
            });
            this.props.settleList({status:1,page:1,pageSize:10})
            this.props.getBusinessPartnerData({
                "page": "1",
                "pageSize": "10"
            });
            this.props.getCurrencyList({
                "page": "1",
                "pageSize": "10"
            });
        })
    }

    editSupplier = (id,uscc,supplierCode) => {
        this.props.EditModul();
        this.props.getEditData(id, 'edit',uscc,supplierCode,"supplier").then(data => {
            //结算方式 C014，付款条件 C013，行业 C015，经营类型 C019，公司性质 C018，公司规模 C016, 发票类型 C021
            let param = [
                { "subCode": "C013", "catCode": data.paymentCode },
                { "subCode": "C015", "catCode": data.scmBp.tradeTypeCode },
                { "subCode": "C019", "catCode": data.scmBp.businessTypeCode },
                { "subCode": "C018", "catCode": data.scmBp.companyTypeCode },
                { "subCode": "C016", "catCode": data.scmBp.companyScaleCode },
                { "subCode": "C021", "catCode": data.invoiceTypeCode }
            ]
            param.map((item) => {
                this.props.getSubjectList({ ...item, "status": 1, "page": 1, "pageSize": 10 });
            });
            this.props.settleList({settleCode:data.settlementCode,status:1,page:1,pageSize:10})
            this.props.getDept({ "orgCode": data.deptCode,"orgType": 2, "status": 1, "page": 1, "pageSize": 10 });
            if(data.deptCode){
                this.props.getEmployeesList({ "deptCode": data.deptCode, "employeeCode": data.empCode, "page": 1, "pageSize": 10 });
            }
            
            this.props.getBusinessPartnerData({
                "bpCode": data.receiveOrgCode,
                "page": "1",
                "pageSize": "10"
            });
            this.props.getCurrencyList({
                "curCode": data.currencyCode,
                "page": "1",
                "pageSize": "10"
            })
        });
    }

    delSupplier = (id) => {
        this.props.delSupplier({id})
            .then(json => {
                if (json.status == 2000) {
                    this.props.tablePaging();
                }
            })
    }

    render() {
        let { onSearch, SearchVal, status, tabLoading, tablePaging, AddModul, onSelect, ...props } = this.props;
        return (
            <div>
                <SearchBarComp
                    {...props}
                    onSearch={onSearch}
                    searchData={this.searchData}
                />
                <div className="supplier-body">
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
