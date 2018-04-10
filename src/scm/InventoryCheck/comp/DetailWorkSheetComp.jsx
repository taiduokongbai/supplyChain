import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Spin } from '../../../base/components/AntdComp';
import { detailSheetStore, detailWorkSheetTableStore } from "../store/ImpWorkSheetStore";
import { inventoryWorkSheetStore } from "../store/InventoryWorkSheetStore";
import { formatNullStr } from "../../../base/consts/Utils";
import DetailsWorkSheetTableComp from './DetailsWorkSheetTableComp';
import { WorkSheetCheck } from '../../consts/CheckUrls';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
let completeButton = React.createElement('ul', null,
    React.createElement('li', null, '盘点作业单无法再次修改!'),
    React.createElement('li', null, '系统会自动生成差异报告!'),
    React.createElement('li', null, '确定要完成盘点吗?'))
let shutDownButton = React.createElement('ul', null,
    React.createElement('li', null, '关闭后相关库存会解锁!'),
    React.createElement('li', null, '确定要关闭该盘点作业单吗?'))
@observer
export default class DetailWorkSheetComp extends Component {
    constructor(props) {
        super(props);
        this.store = detailSheetStore
        this.inventoryWorkSheetStore = inventoryWorkSheetStore
    }
    closePage = (pm) => {
        store.dispatch(TabsAct.TabRemove('detailWorkSheetComp', 'inventoryWorkSheet'))
        store.dispatch(TabsAct.TabAdd({
            title: "盘点作业单",
            key: "inventoryWorkSheet"
        }));
        WorkSheetCheck.detailsShutDown(pm).then(json => {
            if (json.status === 2000) {
                message.success('关闭成功!');
            }
        }).then(() => {
            if (this.inventoryWorkSheetStore.isCurrentOpen == true) {
                this.inventoryWorkSheetStore.fetchTableList({ page: 1, pageSize: 15 })
            }
        })
    }
    completeCheck = (pm) => {
        store.dispatch(TabsAct.TabRemove('detailWorkSheetComp', 'inventoryWorkSheet'))
        store.dispatch(TabsAct.TabAdd({
            title: "盘点作业单",
            key: "inventoryWorkSheet"
        }));
        WorkSheetCheck.detailsComplete(pm).then(json => {
            if (json.status === 2000) {
                message.success('完成盘点成功!');
            }
        }).then(() => {
            if (this.inventoryWorkSheetStore.isCurrentOpen == true) {
                this.inventoryWorkSheetStore.fetchTableList({ page: 1, pageSize: 15 })
            }
        });
    }
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
                                {(info.status == 3 || info.status == 4 || info.status == 5) ? "" : (info.status == 2 ?
                                    <span>
                                        <Popconfirm title={completeButton} onConfirm={() => this.completeCheck({ id: info.id })} okText="确定" cancelText="取消">
                                            <Button type="primary" className="complete-check-button"><i className="c2mfont c2m-wanchengpandian" style={{ marginRight: '5px', fontSize: '12px' }}></i>完成盘点</Button>
                                        </Popconfirm>
                                        <Popconfirm title={shutDownButton} onConfirm={() => this.closePage({ id: info.id })} okText="确定" cancelText="取消">
                                            <Button type="primary"><i className="c2mfont c2m-guanbi" style={{ marginRight: '5px', fontSize: '14px' }}></i>关闭</Button>
                                        </Popconfirm>
                                    </span> : <Popconfirm title={shutDownButton} onConfirm={() => this.closePage({ id: info.id })} okText="确定" cancelText="取消">
                                        <Button type="primary"><i className="c2mfont c2m-guanbi" style={{ marginRight: '5px', fontSize: '14px' }}></i>关闭</Button>
                                    </Popconfirm>
                                )}
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
                        <DetailsWorkSheetTableComp />
                    </div>
                </Spin>
            </div>
        )
    }
}