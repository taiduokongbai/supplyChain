/**
 * Created by MW on 2017/7/20.
 * 其它出库单执行_订单信息
 */

import React, {Component} from 'react'
import MTable from '../../../base/components/TableComp'
import TooltipComp from '../../../base/components/TooltipComp'
import  { Spin } from '../../../base/components/AntdComp'
import { formatNullStr } from '../../../base/consts/Utils';

let columns = [
    {
        title: '行号',
        dataIndex: 'lineNum',
        key: 'lineNum',
        width: 48,
        fixed: 'left',
        className: 'first'
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 90,
         fixed: 'left',
        render: (txt, record, index) => window.ENUM.getEnum("outDetailStatus", record.status)
    }, {
        title: '物料编码',
        dataIndex: 'materialCode',
        key: 'materialCode',
        width: 161,
        fixed: 'left',
    }, {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        render: (text, record, index) => <TooltipComp attr={{text: text, wid: 88}} />,
        width: 148,
        fixed: 'left',
    }, {
        title: '规格',
        dataIndex: 'materialSpec',
        key: 'materialSpec',
        render: (text, record, index) => <TooltipComp attr={{text: text, wid: 88}} />,
        className: 'two-first'
    }, {
        title: '型号',
        dataIndex: 'materialModel',
        key: 'materialModel',
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
    }, {
        title: '未清数量',
        dataIndex: 'outstandingAmount',
        key: 'outstandingAmount',
    }, {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        fixed: 'right',
        width: 54,
        className: 'last'
    },
];

class OtherOutboundOrderCarryOutOrderInfoComp extends Component {
    constructor(props) {
        super(props);

        columns[11].render = (text, record) => {
                if(record.status == 1 || record.status == 2 || ((record.status == 4) && (Number(record.planAmount) > Number(record.allocatedAmount)))){
                    return (
                        <span title="分配" className="operator" href="javascript:;" onClick={() => this.props.popup(this.props.orderCode,record.lineNum)}>
                            <i className="c2mfont c2m-fenpei"></i>
                        </span>);
                } else {
                    return <span className="line">{formatNullStr('')}</span>;
                }

        }
    };

    tablePaging = (page) => {
        this.props.getOrderInfo(typeof page =='number'?
            {page:page,pageSize:10,outCode:this.props.orderCode}
            :
            Object.assign(page,{outCode:this.props.orderCode})
        );
    };

    render() {
        return(
            <div>
                <Spin spinning={this.props.orderLoading}>
                    <MTable cols={columns} rowKey="id" dataSource={this.props.orderList}
                            scroll={{ x: 1680 }}
                            paging={this.props.orderPaging} pageOnChange={this.tablePaging} />
                </Spin>
            </div>
        )
    }
}

export default OtherOutboundOrderCarryOutOrderInfoComp