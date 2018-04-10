/**
 * Created by MW on 2017/7/21.
 * 其他出库单详情页面表格、发货记录
 */

import React, {Component} from 'react'
import MTable from '../../../base/components/TableComp'
import TooltipComp from '../../../base/components/TooltipComp'
import { Spin } from '../../../base/components/AntdComp'

let columns = [
    {
        title: '行号',
        dataIndex: 'number',
        key: 'number',
        render: (text,recoder,index) => index + 1,
        width: 39,
        fixed: 'left',
        className: 'first'
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width:160,
        render: (txt, record, index) => window.ENUM.getEnum("outDetailStatus", record.status),
        fixed: 'left'
    }, {
        title: '物料编码',
        dataIndex: 'materialCode',
        key: 'materialCode',
        width: 160,
        fixed: 'left'
    }, {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        render: (text, record, index) => <TooltipComp attr={{text: text, wid: 132}} />,
        width: 135,
        fixed: 'left'
    }, {
        title: '规格',
        dataIndex: 'materialSpec',
        key: 'materialSpec',
        render: (text, record, index) => <TooltipComp attr={{text: text, wid: 108}} />,
        className: 'two-first'
    },{
        title: '型号',
        dataIndex: 'materialModel',
        key: 'materialModel',
        render: (text, record, index) => <TooltipComp attr={{text: text, wid: 106}} />
    }, {
        title: '计划数量',
        dataIndex: 'planAmount',
        key: 'planAmount',
    }, {
        title: '库存单位',
        dataIndex: 'materialUnitName',
        key: 'materialUnitName',
    }, {
        title: '已分配数量',
        dataIndex: 'allocatedAmount',
        key: 'allocatedAmount',
    }, {
        title: '已发货数量',
        dataIndex: 'shippedAmount',
        key: 'shippedAmount',
        fixed: 'right',
        width: 96,
    }, {
        title: '未清数量',
        dataIndex: 'outstandingAmount',
        key: 'outstandingAmount',
        fixed: 'right',
        width: 96,
    }
];

class OtherOutboundOrderDetailsTableComp extends Component {
    constructor (props) {
        super(props)
    };

    tablePaging = (page) => {
        this.props.getTable(typeof page =='number'?
            {page:page,pageSize:10,outCode:this.props.orderInfoData.orderCode}
            :
            Object.assign(page,{outCode:this.props.orderInfoData.orderCode})
        );
    };

    render () {
        return (
            <div>
                <div className="table">
                    <h3 className="public-title">明细信息</h3>
                    <Spin spinning={this.props.tableLoading}>
                        <div className="list">
                            <MTable cols={columns} rowKey={'id'} dataSource={this.props.tableList}
                                    scroll={{ x: 1680 }}
                                    paging={this.props.paging} pageOnChange={this.tablePaging} />
                        </div>
                    </Spin>
                </div>
                <div className="remark-info">
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

export default OtherOutboundOrderDetailsTableComp