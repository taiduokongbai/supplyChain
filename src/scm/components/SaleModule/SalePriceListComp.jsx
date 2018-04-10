import React, { Component } from 'react';
import { Button, Popconfirm, message, Select } from '../../../base/components/AntdComp';
import MTable from '../../../base/components/TableComp';
import SearchBarComp from '../../../base/components/SearchBarComp';
import OperationsComp from '../../../base/components/OperationsComp';
import TooltipComp from "../../../base/components/TooltipComp";

const Option = Select.Option;
const columns = [
    {
        title: '价格编码',
        dataIndex: 'orderCode',
        key: 'orderCode',
        width: 150,
    },
    {
        title: '单据状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width: 150,
        render: (text, record, index) => window.ENUM.getEnum("orderStatusType",text.toString()),
    },
    {
        title: '价格单名称',
        dataIndex: 'priceName',
        key: 'priceName',
        width: 150,
        render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 100, placement: 'left' }} />
    },{
        title: '是否含税',
        dataIndex: 'isTax',
        key: 'isTax',
        width: 150,
        render: (text, record, index) => window.ENUM.getEnum("isTax", text.toString()),
    },{
        title: '生效日期',
        dataIndex: 'startTime',
        key: 'startTime ',
        width: 150,
    }, {
        title: '失效日期',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 200,
    }, {
        title: '币种',
        dataIndex: 'currency',
        key: 'currency',
        width: 200,
    }, {
        title: '更新人',
        dataIndex: 'updateByName',
        key: 'updateByName',
        width: 200,
    },{
        title: '更新时间',
        dataIndex: 'updateDate',
        key: 'updateDate',
        width: 200,
    },{    
        dataIndex: 'handle',
        title: '操作',
        className: 'operate-center',
        width: 80,
        fixed:'right',
    }];

class SalePriceListComp extends Component {
     constructor(props, context) {
        super(props, context);
         this.searchData={
                left:[
                {
                    key:"orderCode",
                    val:"价格编码",
                    type:"string"
                },
                {
                    key:"priceName",
                    val:"价格单名称",
                    type:"string"
                },
                {
                    key:"orderStatus",
                    val:"单据状态",
                    type:"select",
                    data:{
                        list: window.ENUM.getEnum("orderStatusType"),
                        keyName:"catCode",
                        labelName:"catName",
                        style:{width:200}
                    }
                },
                {
                    key:"startTime",
                    val:"生效日期",
                    type:"date"
                }
            ],
            center:[
                {
                    title:"查询",
                    Func:null,
                    style:{},
                    type:"button"
                }
            ],
            right:[
                {
                    title:"新建",
                    Func:this.AddSalePrice,
                    style:{}
                },
            ]
          }
          columns[0].render=(txt,record,index)=>
            <a href="#" onClick={()=>this.MaterialViewShow(record.orderCode)}>{record.orderCode}</a>
            columns[columns.length - 1].render = (txt, record, index) =>
                {
                    let opts=[
                        {
                            title: '编辑',
                            titleText: [],
                            icon: '',
                            fun: () => this.editMaterial(record.orderCode),
                            default: '--',
                            show: record.orderStatus == "0" || record.orderStatus == "4" || record.orderStatus == "6",
                        },
                        {
                            title: "删除",
                            titleText: ['确认删除该数据吗？'],
                            icon: '',
                            default: '--',
                            show: record.orderStatus == "0" || record.orderStatus == "4" || record.orderStatus == "6",
                            fun: () => this.delMaterial(record.orderCode),
                        }
                    ]
                    return <OperationsComp operations={opts} />;
                }
     }
     delMaterial=(orderCode)=>{
      this.props.delMaterial(orderCode)
        .then(json=>{
            if(json.status==2000){
                this.props.tablePaging();
            }
        })
    }
    AddSalePrice=()=>{
          this.props.GetCodeRule().then(json=>{
            if(json.status===2000){
                 this.props.AddModul();  
                 this.props.SalePriceAdd();  
            }
        })
        
    }
    editMaterial=(orderCode)=>{
        this.props.EditModul();
        this.props.getEditData(orderCode);
    }
    MaterialViewShow =(orderCode)=>{
        this.props.MaterialViewClick();
        this.props.getEditData(orderCode);
       
    }; 
     
  
    render() {
        let {onSearch,SearchVal,tablePaging, tabLoading,...props} = this.props;
        return (
            <div className="saleprice">
            
                <SearchBarComp
                    onSearch={onSearch}
                    searchData={this.searchData}
                />
               <div className="saleprice-body">
                    <MTable
                        {...props}
                        loading={tabLoading}
                        cols={columns}
                        rowKey={"orderCode"}
                        pageOnChange={tablePaging}
                    />
               </div>
            </div>
        );
    }
    componentDidMount() {
        this.props.tablePaging(1);
    }
}

export default SalePriceListComp;    