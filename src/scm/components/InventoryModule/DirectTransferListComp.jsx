/**
 * Created by MW on 2017/8/29.
 * 直接调拨单
 */
import React, { Component } from 'react'
import SearchBarComp from '../../../base/components/SearchBarComp'
import MTable from '../../../base/components/TableComp'

let columns = [
    {
        title: '单据号',
        dataIndex: 'allotOrderCode',
        key: 'allotOrderCode',
        width: 214,
    }, {
        title: '单据类型',
        dataIndex: 'allotOrderTypeName',
        key: 'allotOrderTypeName',
    }, {
        title: '调出仓库',
        dataIndex: 'allotOutSiteName',
        key: 'allotOutSiteName',
    }, {
        title: '调入仓库',
        dataIndex: 'allotInSiteName',
        key: 'allotInSiteName',
    }, {
        title: '调拨申请人',
        dataIndex: 'allotProposerName',
        key: 'allotProposerName',
    }, {
        title: '调拨日期',
        dataIndex: 'allotDate',
        key: 'allotDate',
        width: 130
    }
]

class DirectTransferListComp extends Component {
    constructor(props) {
        super(props)
       columns[0].render = (txt, record, index) =><a href="#" onClick={() => this.props.newTab(record.allotOrderCode, 'details')}>{txt}</a>
        this.searchData = {
            left: [
                {
                    key: "allotOrderCode",
                    val: "单据号",
                    initialValue: "",
                    type: "string"
                },
                {
                    key: "allotOrderTypeCode",
                    val: "单据类型",
                    initialValue: "",
                    type: "select",
                    data: {
                        list: window.ENUM.getEnum("ProOrderStatus"),
                        keyName: "catCode",
                        labelName: "catName",
                        style: { width: 200 }
                    }
                },
                {
                    key: "allotOutSiteName",
                    val: "调出仓库",
                    initialValue: "",
                    type: "string"
                },
                {
                    key: "allotInSiteName",
                    val: "调入仓库",
                    initialValue: "",
                    type: "string"
                },
                {
                    key: "allotProposerName",
                    val: "调拨申请人",
                    initialValue: "",
                    type: "string"
                },
                {
                    key: "productDate",
                    val: "调拨时间",
                    initialValue: ['1992-01-02', '1993-05-06'],
                    type: "date"
                }
            ],
            center: [
                {
                    title: "查询",
                    Func: this.props.onSearch,
                    style: {},
                    type: "button",
                    icon: "c2mfont c2m-search"
                }
            ],
            right: [
                {
                    title: "新建",
                    Func: this.props.newTab,
                    style: {},
                    icon: "add"
                }
            ]
        }
    }
    onChange = (e) => {
       if(e.key=='productDate'){
           let searchVal={'allotDateStart':e.val[0],'allotDateEnd':e.val[1]}
           this.props.PurchaseList({page:1, pageSize:this.props.paging.pageSize,...searchVal})
       }else if(e.key!=""){
            let paramCode='{'+e.key+':'+e.val+'}'
            let searchVal=eval("("+paramCode+")")
            this.props.PurchaseList({page:1, pageSize:this.props.paging.pageSize,...searchVal})
       }else{
           console.log(e)
       } 
    }
    tablePaging = (current) => {
        this.props.PurchaseList(typeof current == 'number' ? Object.assign(this.props.search, { page: current }) : Object.assign(this.props.search, current));
    }
    componentDidMount() {
        this.props.PurchaseList({ page: 1, pageSize: 10 });
    }
    render() {
        let {tableLoading, tablePaging, paging, ...props} = this.props;
        return (
            <div>
                <SearchBarComp
                 {...props}
                 searchData={this.searchData}
                 onSearch={this.onChange}
                  />

                <MTable cols={columns}
                    rowKey={"id"}
                    loading={tableLoading}
                    paging={paging}
                    pageOnChange={this.tablePaging}
                    dataSource={this.props.dataSource}
                    {...props}
                />
            </div>
        )
    }

}

export default DirectTransferListComp