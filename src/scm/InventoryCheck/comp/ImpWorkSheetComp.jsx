import React, { Component } from 'react';
import { impWorkSheetStore, addTableLineStore, shippingSpaceStore, materialSelectStore } from "../store/ImpWorkSheetStore";
import { Table, Button, Input, Popconfirm, message, Form, Checkbox, Spin } from '../../../base/components/AntdComp';
import ImpWorkSheetTableComp from './ImpWorkSheetTableComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import FormComp from '../../../base/mobxComps/FormComp';
import { formatNullStr } from "../../../base/consts/Utils";
import { WorkSheetCheck } from '../../consts/CheckUrls';
import { inventoryWorkSheetStore } from "../store/InventoryWorkSheetStore";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
let FormItem = Form.Item;
let startCheckButton = React.createElement('ul', null,
    React.createElement('li', { style: { width: 160 } }, '开始盘点后相关库存会被锁定!'),
    React.createElement('li', null, '确定要开始盘点吗?'))
@observer
export default class ImpWorkSheetComp extends Component {
    constructor(props) {
        super(props);
        this.store = impWorkSheetStore;
        this.shippingSpaceStore = shippingSpaceStore;
        this.materialSelectStore = materialSelectStore;
        this.inventoryWorkSheetStore = inventoryWorkSheetStore;
    }
    getDetailComp = () => {
        let Comp = addTableLineStore.Comp;
        return (
            <div>
                <Comp ref="impWorkSheetTableRef" {...this.props} />
            </div>
        )
    }

    changeStartCheck = (pm) => {
        WorkSheetCheck.impStartCheck({ id: pm.id }).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    this.store.startCheck = false
                    addTableLineStore.changeOpration = 'table-thead-center'
                    addTableLineStore.onMaterialAdd({
                        locationName: "",
                        materialCode: "",
                        materialName: "",
                        batchCode: "",
                        actualStocktakeQty: "",
                        accountQty: "",
                        inventoryStatus: "",
                        isManual: 0,
                        inventoryUnit: "",
                        inventoryUnitName: "",
                    })
                    addTableLineStore.dataSource.splice(-1, 1)
                })
                this.shippingSpaceStore.fetchSelectList({ stockId: this.store.impDetail.warehouseId, locationNameStart: this.store.impDetail.locationNameStart, locationNameEnd: this.store.impDetail.locationNameEnd });
                // this.materialSelectStore.fetchSelectList({ materialName: this.store.impDetail.materialName, materialCode: this.store.impDetail.materialCode });
                this.materialSelectStore.fetchSelectList();
                addTableLineStore.getTableList({ id: pm.id, stocktakeTaskCode: pm.stocktakeTaskCode, page: 1, pageSize: 15 })
                runInAction(() => {
                    addTableLineStore.paging.current = 1
                })
            }
        })
    }
    saveHandler = (e, pm) => {
        e.preventDefault();
        // let form = this.refs.impWorkSheetTableRef.refs.wrappedComponent.props.form
        let form = this.refs.impWorkSheetTableRef
        form.validateFields((err, values) => {
            if (!err) {
                let data = addTableLineStore.dataSource.slice();
                let isSave = 1;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].actualStocktakeQty == '' || data[i].actualStocktakeQty < 0) {
                        message.info('[行号' + data[i].lineNumber + ']实盘数量输入不正确')
                        isSave = 0;
                        break
                    }
                }
                if (isSave != 0) {
                    for (let i = 0; i < data.length; i++) {
                        data[i].accountQty = Number(data[i].accountQty)
                        data[i].actualStocktakeQty = Number(data[i].actualStocktakeQty)
                        data[i].differenceQty = (data[i].differenceQty == '' ? null : Number(data[i].differenceQty))
                        delete data[i].lineNumber
                        if (data[i].id < 0) {
                            delete data[i].id
                        }
                    }
                    WorkSheetCheck.impSaveCheck({ stocktakeTaskId: pm, list: data }).then(json => {
                        if (json.status === 2000) {
                            message.success('保存成功!');
                        }
                    }).then(() => {
                        if (this.inventoryWorkSheetStore.isCurrentOpen == true) {
                            this.inventoryWorkSheetStore.fetchTableList({ page: 1, pageSize: 15 })
                        }
                    })
                    store.dispatch(TabsAct.TabRemove('impWorkSheetComp', 'inventoryWorkSheet'))
                    store.dispatch(TabsAct.TabAdd({
                        title: "盘点作业单",
                        key: "inventoryWorkSheet"
                    }));
                }

            }
        })
    }
    componentWillMount() {
        addTableLineStore.paging = {
            current: 1,
            pageSize: 15,
            total: 0
        }
        runInAction(() => {
            addTableLineStore.dataSource = []
            this.store.startCheck = true
            addTableLineStore.changeOpration = 'table-thead-center add-table-operation-hidden'
        })
    }
    // componentDidMount() {
    //     addTableLineStore.getTableList({page: 1, pageSize: 15 })
    // }
    render() {
        let info = this.store.impDetail;
        return (
            <div className="imp-work-sheet">
                <Spin spinning={this.store.spinLoading}>
                    <div className="imp-work-head">
                        <div className="imp-work-head-top">
                            <div className="imp-work-head-left">
                                <div className="imp-work-head-left-top">
                                    <span>作业单号：<span>{formatNullStr(info.stocktakeTaskCode)}</span></span>
                                    <span className="imp-vertical-line">|</span>
                                    <span>关联方案编号：<span>{formatNullStr(info.solutionCode)}</span></span>
                                    <span className="imp-vertical-line">|</span>
                                    <span>关联方案名称：<span>{formatNullStr(info.solutionName)}</span></span>
                                </div>
                                <div className="imp-work-head-left-bottom">
                                    <span className="imp-work-head-margin">是否盲盘：<span className="blind-plate-color">{formatNullStr(info.isBlindStocktake == 1 ? "是" : "否")}</span></span>
                                    <span className="imp-work-head-margin">方案下推人：<span>{formatNullStr(info.pushdownByName)}</span></span>
                                    <span className="imp-work-head-margin">方案下推时间：<span>{formatNullStr(info.pushdownDatetime)}</span></span>
                                </div>
                            </div>
                            <div className="imp-work-head-right">
                                {this.store.startCheck ?
                                    <Popconfirm title={startCheckButton} onConfirm={() => this.changeStartCheck({ id: info.id, stocktakeTaskCode: info.stocktakeTaskCode })} okText="确定" cancelText="取消">
                                        <Button type="primary"><i className='c2mfont c2m-kaishipandian' style={{ marginRight: '5px',fontSize:'14px' }}></i>开始盘点</Button>
                                    </Popconfirm>
                                    : <Button type="primary" onClick={(e) => this.saveHandler(e, info.id)}><i className="c2mfont c2m-baocun" style={{ marginRight: '5px',fontSize:'14px' }}></i>保存</Button>
                                }
                            </div>
                        </div>
                        <div className="imp-work-head-bottom">
                            <div className="imp-program-details-title">方案明细</div>
                            <div className="imp-program-details-content">
                                <div className="imp-work-bottom-left">
                                    <p><span className="imp-warehouse-lable">所属仓库：</span><span>{formatNullStr(info.warehouseName)}</span></p>
                                    <p><span className="imp-warehouse-lable">仓位：</span><span>{formatNullStr(info.locationCodeStart)}</span>-<span>{formatNullStr(info.locationCodeEnd)}</span></p>
                                </div>
                                <div className="imp-work-bottom-center">
                                    <p><span className="imp-materiel-lable">物料分类：</span><span className="imp-materiel-content">{formatNullStr(info.materialCategoryName)}</span></p>
                                    <p><span className="imp-materiel-lable">物料：</span><span>{formatNullStr(info.materialName)}</span></p>
                                </div>
                                <div className="imp-work-bottom-right">
                                    <p><span className="imp-remarks-lable">备注：</span><span className="imp-remarks-content">{formatNullStr(info.remarks)}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {
                            this.getDetailComp()
                        }
                    </div>
                </Spin>
            </div>
        )
    }
}
