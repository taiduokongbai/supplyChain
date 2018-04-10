import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Form } from '../../../base/components/AntdComp';
import { detailSheetStore, detailWorkSheetTableStore } from "../store/ImpWorkSheetStore";
import TooltipComp from '../../../base/mobxComps/TooltipComp';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
@observer
export default class DetailsWorkSheetTableComp extends Component {
    constructor(props) {
        super(props);
        this.store = detailWorkSheetTableStore;
        this.detailSheetStore = detailSheetStore;
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width: 44,
                className: 'imp-line-number'
            }, {
                title: '仓位',
                dataIndex: 'locationCode',
                key: 'locationCode',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 96 }} />
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 132 }} />
            }, {
                title: '批次号',
                dataIndex: 'batchCode',
                key: 'batchCode',
                render: (text, record, index) => <TooltipComp attr={{ text: text, wid: 106 }} />
            }, {
                title: '库存状态',
                dataIndex: 'inventoryStatus',
                key: 'inventoryStatus',
                render: (text, record, index) => this.renderTableRowStatus(text, record, index)
            }, {
                title: '库存单位',
                dataIndex: 'inventoryUnitName',
                key: 'inventoryUnitName',
            }, {
                title: '账面数量',
                dataIndex: 'accountQty',
                key: 'accountQty',
                render: (text, record, index) => this.detailSheetStore.impDetail.isBlindStocktake == 1 ? '--' : record.accountQty
            }, {
                title: '实盘数量',
                dataIndex: 'actualStocktakeQty',
                key: 'actualStocktakeQty',
                 render: (text, record, index) =>record.actualStocktakeQty,
                className: 'firm-offer-quantity'
            }, {
                title: '差异数量',
                dataIndex: 'differenceQty',
                key: 'differenceQty',
                render: (text, record, index) => this.detailSheetStore.impDetail.isBlindStocktake == 1 ? '--' : this.renderTableRowQty(text, record, index),
                //  render: (text, record, index) => this.renderTableRowQty(text, record, index),
                width: 98
            }
        ]
    }

    renderTableRowStatus = (text, record, index) => {
        // status库存状态:0可用,1分配,2预收货,3待检,4冻结
        switch (record.inventoryStatus) {
            case 0:
                return <span style={{ color: '#4c80cf' }}>可用</span>;
            case 1:
                return <span style={{ color: '#f6a623' }}>分配</span>;
            case 2:
                return "预收货";
            case 3:
                return "待检";
            case 4:
                return <span style={{ color: '#f04134' }}>冻结</span>;
        }
    }
    renderTableRowQty = (text, record, index) => {
        if (record.differenceQty >= 0) {
            return <span style={{ color: '#000000' }}>{record.differenceQty}</span>
        } else {
            return <span style={{ color: 'red' }}>{record.differenceQty}</span>
        }
    }
    render() {
        return (
            <div className="imp-work-sheet-table">
                <div className="imptable-title">
                    <div className="materiel-detail-table">物料明细</div>
                </div>
                <Table
                    {...this.store.Props}
                    rowKey={record => record.id}
                    columns={this.columns}
                />
            </div>
        )
    }
}

