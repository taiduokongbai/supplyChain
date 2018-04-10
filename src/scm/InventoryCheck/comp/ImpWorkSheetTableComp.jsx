import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Form } from '../../../base/components/AntdComp';
import { impWorkSheetStore, addTableLineStore, addDialogLineStore, shippingSpaceStore} from "../store/ImpWorkSheetStore";
import AddDialogWorkSheetComp from './AddDialogWorkSheetComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import FormComp from '../../../base/mobxComps/FormComp';
import Validate from '../../../base/consts/ValidateList';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
let FormItem = Form.Item;
@observer
class ImpWorkSheetTableComp extends FormComp {
    constructor(props) {
        super(props);
        this.store = addTableLineStore;
        this.addDialogLineStore = addDialogLineStore;
        this.impWorkSheetStore = impWorkSheetStore;
        this.columns = [
            {
                title: '行号',
                dataIndex: 'lineNumber',
                key: 'lineNumber',
                width:44,
                className:'imp-line-number'
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
                render: (text, record, index) => this.impWorkSheetStore.impDetail.isBlindStocktake == 1 ? '--' : record.accountQty
            }, {
                title: '实盘数量',
                dataIndex: 'actualStocktakeQty',
                key: 'actualStocktakeQty',
                className:'firm-offer-quantity'
            }, {
                title: '差异数量',
                dataIndex: 'differenceQty',
                key: 'differenceQty',
                render: (text, record, index) => this.impWorkSheetStore.impDetail.isBlindStocktake == 1 ? '--' :  this.renderTableRowQty(text, record, index),
                width:106
            },{
                title: '操作',
                dataIndex: 'operation',
                width: 74,
                className: this.store.changeOpration
            }
        ]
       
        this.columns[this.columns.length - 3].render = (text, record, index) => {
            let realKey = record.lineNumber - 1
            if (this.impWorkSheetStore.startCheck) {
                return (
                    <div>{record.actualStocktakeQty}</div>
                )
            } else {
                return (
                    <FormItem>
                        {this.getFD('actualStocktakeQty_' + index, {
                            initialValue: record.actualStocktakeQty || '',
                            rules: [
                                { type: 'gtEqZero', decimal: 2, message: '请输入正数或零!' },
                            ]
                        })(
                            <Input onChange={(e) => this.inputChange(e, realKey)} style={{width:'94px',height:'24px'}} />
                            )}
                    </FormItem>
                )
            }
        }
        this.columns[this.columns.length - 1].render = (text, record, index) => {
            let opts = [
                {
                    title: "删除",
                    titleText: ['确定要删除该条记录吗', '删除后，该条记录将不可恢复！'],
                    show: record.isManual == 1,
                    fun: () => this.onDelete(index, { id: record.id }),
                    default:'--',
                    icon:'c2mfont c2m-shanchu1 columns-distribute columns-distribute-border'
                },
            ];
            return <OperationsComp operations={opts} />;
        }
    }

    inputChange = (e, realKey) => {
        let val = e.target.value;
        let newKey = 'actualStocktakeQty' + realKey
        runInAction(() => {
            this.store.dataSource[realKey].actualStocktakeQty = val;
        })
    }
    title = () => {
        let {startCheck} = this.impWorkSheetStore;
        let addBtnText = startCheck ? " " : "添加行";
        return (
            <div className="imptable-title">
                <div className="materiel-detail-table">物料明细</div>
                <div>
                    {
                        addBtnText ?
                            <a href='#' onClick={this.onAdd}>
                                {this.impWorkSheetStore.startCheck ? "" : <i className='c2mfont c2m-tianjia' />}
                                {addBtnText}
                            </a>
                            : null
                    }
                </div>
            </div>
        )
    }
    onAdd = () => {
        this.addDialogLineStore.setVisible(true);
    }
    getMaterialCont = () => (
        <div>
            <AddDialogWorkSheetComp />
        </div>
    )
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
    onDelete = (index, pm) => {
        if (pm.id > 0) {
            this.store.fetchTableDel(pm).then(json => {
                if (json.status === 2000) {
                    this.store.onMaterialDelete(index)
                }
            });
        } else {
            this.store.onMaterialDelete(index)
        }
    }
    renderTableRowQty=(text,record,index)=>{
        if(record.differenceQty>=0){
            return <span style={{color:'#000000'}}>{record.differenceQty}</span>
        }else{
            return <span style={{color:'red'}}>{record.differenceQty}</span>
        }
    }
    render() {
        let {startCheck} = this.impWorkSheetStore;
        return (
            <div className="imp-work-sheet-table">
                <Form>
                    <Table
                        {...this.store.Props}
                        rowKey={record => record.id}
                        columns={this.columns}
                        title={this.title}
                        className='imp-table'
                    />
                </Form>
                {
                    this.getMaterialCont()
                }
            </div>
        )
    }
}
export default ImpWorkSheetTableComp;
