import React, { Component } from 'react';
import { Table } from '../../../base/components/AntdComp';
let { observable, action, computed, runInAction, toJS } = mobx;
import { addAllotTableStore } from '../store/AddAllotStore';
let { observer } = mobxReact;

@observer
class AddAllotStepThreeComp extends Component {
    constructor(props){
        super(props);
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNo',
                key: 'lineNo',
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
            }, {
                title: '调出仓库',
                dataIndex: 'allotOutStockName',
                key: 'allotOutStockName',
            }, {
                title: '调出仓位',
                dataIndex: 'allotOutLocationCode',
                key: 'allotOutLocationCode',
            }, {
                title: '原批次号',
                dataIndex: 'allotOutBatchCode',
                key: 'allotOutBatchCode',
            }, {
                title: '调入仓库',
                dataIndex: 'allotInStockName',
                key: 'allotInStockName',
            }, {
                title: '调入仓位',
                dataIndex: 'allotInLocationCode',
                key: 'allotInLocationCode',
            }, {
                title: '现批次号',
                dataIndex: 'allotInBatchCode',
                key: 'allotInBatchCode',
            }, {
                title: '调拨数量',
                dataIndex: 'allotInQty',
                key: 'allotInQty',
            }, {
                title: '库存单位',
                dataIndex: 'unitName',
                key: 'unitName',
            },
        ]
    }

    render() {
        return (
            <div>
                <h3 className="allot-table-title">调拨信息</h3>
                <Table {...addAllotTableStore.Props}
                    columns={this.columns} rowKey={"id"} />
            </div>
        )
    }
}

export default AddAllotStepThreeComp