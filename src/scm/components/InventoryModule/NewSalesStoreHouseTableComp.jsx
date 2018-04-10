/**
 * Created by MW on 2017/4/21.
 */
import React, {Component} from 'react'
import MTable from '../../../base/components/TableComp'
import TooltipComp from '../../../base/components/TooltipComp'

let columns = [
    {
        title: '行号',
        dataIndex: 'lineNo',
        key: 'lineNo',
        width: 62,
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (txt, record, index) => "已保存",
        // width: 85,
    }, {
        title: '物料编码',
        dataIndex: 'materialCode',
        key: 'materialCode',
        // width: 178,
    }, {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        render: (text, record, index) => <TooltipComp attr={{text: text, wid: 132}} />
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
    }, {
        title: '计划数量',
        dataIndex: 'shipQty',
        key: 'shipQty',
        // width: 108,
    }, {
        title: '库存单位',
        dataIndex: 'unitName',
        key: 'unitName',
        // width: 68,
    }, {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 78,
    }
];

class NewSalesStoreHouseTableComp extends Component{
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="table">
                <h3 className="public-name">明细信息</h3>
                <div>
                    <MTable cols={columns} rowKey={"id"} dataSource={this.props.dataSource.list} />
                </div>
            </div>
        )
    }
}

export default NewSalesStoreHouseTableComp

