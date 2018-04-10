/**
 * Created by MW on 2017/4/25.
 */
import React, {Component} from 'react'
import MTable from '../../../base/components/TableComp'
import TooltipComp from '../../../base/components/TooltipComp'
import {Spin} from '../../../base/components/AntdComp'

let colmuns = [
    {
        title: '行号',
        dataIndex: 'number',
        key: 'number',
        render: (text,recoder,index) => <div className="number">{index + 1}</div>,
        width: 41,
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (txt, record, index) => window.ENUM.getEnum("outDetailStatus", record.status) ,
        // width: 81,
    }, {
        title: '物料编码',
        dataIndex: 'materialCode',
        key: 'materialCode',
        // width: 160,
    }, {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        render: (text, record, index) => <TooltipComp attr={{text: text, wid: 130}} />
    }, {
        title: '规格',
        dataIndex: 'materialSpec',
        key: 'materialSpec',
        render: (text, record, index) => <TooltipComp attr={{text: text, wid: 84}} />
    }, {
        title: '型号',
        dataIndex: 'materialModel',
        key: 'materialModel',
        render: (text, record, index) => <TooltipComp attr={{text: text, wid: 84}} />
    },{
        title: '计划数量',
        dataIndex: 'planAmount',
        key: 'planAmount',
        // width: 88,
    }, {
        title: '已分配数量',
        dataIndex: 'allocatedAmount',
        key: 'allocatedAmount',
        // width: 88,
    }, {
        title: '已发货数量',
        dataIndex: 'shippedAmount',
        key: 'shippedAmount',
        // width: 78,
    }, {
        title: '未清数量',
        dataIndex: 'outstandingAmount',
        key: 'outstandingAmount',
        // width: 75,
    }, {
        title: '库存单位',
        dataIndex: 'materialUnitName',
        key: 'materialUnitName',
        width: 60,
    }
];

class PurchaseReturnOutboundDetailsTableComp extends Component {
    constructor(props) {
        super(props)
    }

    tablePaging = (page) => {
        this.props.getTable(typeof page =='number'?{page:page,pageSize:10,outCode:this.props.dataSource.orderCode}:Object.assign(page,{outCode:this.props.dataSource.orderCode}));
    }

    render () {
        return(
            <div>
                <div className="table">
                    <h3 className="public-title">明细信息</h3>
                    <Spin spinning={this.props.tableLoading}>
                        <div className="list">
                            <MTable cols={colmuns} rowKey={'id'} dataSource={this.props.list} paging={this.props.paging} pageOnChange={this.tablePaging}/>
                        </div>
                    </Spin>
                </div>
                <div className="remark">
                    <h3 className="public-title">发货记录</h3>
                    <div className="content">
                        {this.props.remarkList.map((perRemark) => {
                            return(
                                <div key={perRemark.id} className="per-remark">
                                    <span className="time">{perRemark.updateDate}</span>
                                    <span>{perRemark.createByName}从{perRemark.stockName}的{perRemark.freightSpaceCode}仓位，分配了批次为{perRemark.batchCode ? perRemark.batchCode : '空'}的{perRemark.materialName}{perRemark.materialCode?'[' + perRemark.materialCode + ']':''}{perRemark.materialAmount}{perRemark.materialUnitName}。</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default PurchaseReturnOutboundDetailsTableComp