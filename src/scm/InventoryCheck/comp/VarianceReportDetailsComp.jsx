/**
 *  盘点差异报告详情  
 */
import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Select, Checkbox, Tabs, Spin, Row, Col } from '../../../base/components/AntdComp';
import { _varianceReportDetailsStore, _varianceReportStore } from "../store/VarianceReportStore";
import SearchBarComp from '../../StorageBin/comp/SearchBarComp';
import { formatNullStr } from '../../../base/consts/Utils';
import { store } from '../../data/StoreConfig';
import TabsAct from "../../actions/TabsAct";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

let optionsData = [
    {
        key: 'all',
        value: '全部'
    }, {
        key: 'isStocktakeSurplus',
        value: '盘盈'
    }, {
        key: 'isStocktakeAhortage',
        value: '盘亏'
    }
];

@observer
export default class VarianceReportDetailsComp extends Component {
    constructor(props, context) {
        super(props);
        this.store = _varianceReportDetailsStore;
        this.columns = [
            {
                title: '行号',
                dataIndex: 'rowNumber',
                key: 'rowNumber',
                width: 44,
            }, {
                title: '仓位',
                dataIndex: 'locationCode',
                key: 'locationCode',
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
            }, {
                title: '批次号',
                dataIndex: 'batchCode',
                key: 'batchCode',
            }, {
                title: '库存状态',
                dataIndex: 'inventoryStatus',
                key: 'inventoryStatus',
                render: (text, record, index) => this.inventoryStatus(record.inventoryStatus)
            }, {
                title: '库存单位',
                dataIndex: 'inventoryUnitName',
                key: 'inventoryUnitName',
            }, {
                title: '账面数量',
                dataIndex: 'accountQty',
                key: 'accountQty',
            }, {
                title: '实盘数量',
                dataIndex: 'actualStocktakeQty',
                key: 'actualStocktakeQty',
            }, {
                title: '差异数量', 
                dataIndex: 'differenceQty',
                key: 'differenceQty',
                width: 98,
                render: (text, record, index) => {
                    if (record.differenceQty > 0) {
                        return <span style={{ color: '#4a4a4a' }}>{record.differenceQty}</span>
                    } else if (record.differenceQty < 0) {
                        return <span style={{ color: '#f04134' }}>{record.differenceQty}</span>
                    }
                }
            },
        ];
    }
    updateStock = () => {
        let { reportDetail } = this.store;
        let params = { id: reportDetail.id, stocktakeReportCode: reportDetail.stocktakeReportCode }
        this.store.updateInventory(params).then(json => {
            if (json.status === 2000) {
                this.removeCurTabs()
                message.success('更新库存成功！')
            }
            this.store.loading = false;
        })
    }
    closeHandler = () => {
        let { reportDetail } = this.store;
        let params = { id: reportDetail.id, stocktakeReportCode: reportDetail.stocktakeReportCode }
        this.store.shutDown(params).then(json => {
            if (json.status === 2000) {
                this.removeCurTabs();
                message.success('关闭成功！')
            }
            this.store.loading = false;
        })
    }
    removeCurTabs = () => {
        store.dispatch(TabsAct.TabAdd({ title: "盘点差异报告", key: "inventoryVarianceReport" }));
        store.dispatch(TabsAct.TabRemove("varianceReportDetails", "inventoryVarianceReport"));
        _varianceReportStore.fetchTableList();
    }
    handleChange = (key) => {
        runInAction(() => {
            this.store._materialDetailStore.loading = true;
        })
        this.store._materialDetailStore.setSearchVal(key)
        this.store._materialDetailStore.fetchTableList()
    }

    inventoryStatus = (val) => {  
        switch (val) {
            case 0:
                return <span style={{ color: '#417505' }}>可用</span>
            case 1:
                return <span style={{ color: '#F6A623' }}>分配</span>
            case 2:
                return <span>预收货</span>
            case 3:
                return <span>待检</span>
            case 4:
                return <span style={{ color: '#D0011B' }}>冻结</span>
        }
    }


    render() {
        let { reportDetail } = this.store;
        let statusOptions = optionsData.map((item) => {
            if(this.store._materialDetailStore.searchKey == `${item.key}`){
                return <Option key={item.key} value={item.key} style={{ display: 'none' }}>{item.value}</Option>
            }else {
                return <Option key={item.key} value={item.key } style={{ display: 'block' }}>{item.value}</Option>
            }
        })
        return (
            <div className='variance-report-details'>
                <Spin spinning={this.store.loading}>
                    <div className='report-head'>
                        <div className='report-head-info'>
                            <div>
                                <p><span>报告编号：</span><span>{formatNullStr(reportDetail.stocktakeReportCode)}</span></p>
                                <p>|</p>
                                <p><span>关联作业单号：</span><span>{formatNullStr(reportDetail.stocktakeTaskCode)}</span></p>
                            </div>
                            <div>
                                <p><span>关联方按编号：</span><span>{formatNullStr(reportDetail.solutionCode)}</span></p>
                                <p><span>关联方案名称：</span><span>{formatNullStr(reportDetail.solutionName)}</span></p>
                                <p><span>是否盲盘：</span><span style={{ color: '#4C80CF' }}>{reportDetail.isBlindStocktake ? '是' : '否'}</span></p>
                            </div>
                        </div>
                        <div className='report-head-btn'>
                            {
                                reportDetail.status == 1 ? <div>
                                    <Popconfirm
                                        title="一旦更新后库存会即时修改！相关库存会同时解锁，确定要更新库存么？"
                                        okText="确定"
                                        cancelText="取消"
                                        overlayStyle={{ width: 215 }}
                                        onConfirm={() => this.updateStock()}>
                                        <Button type='primary'><i className='c2mfont c2m-wanchengpandian' style={{ marginRight: '5px', fontSize: '12px' }}></i>更新库存</Button>
                                    </Popconfirm>
                                    <Popconfirm
                                        title="关闭后相关库存会解锁！相关盘点作业单也会被关闭，确定要关闭该盘点报告么？"
                                        okText="确定"
                                        cancelText="取消"
                                        overlayStyle={{ width: 215 }}
                                        onConfirm={() => this.closeHandler()}
                                    >
                                        <Button type='primary' style={{ marginLeft: 10 }}><i className='c2mfont c2m-guanbi' style={{ marginRight: '5px', fontSize: '12px' }}></i>关闭</Button>
                                    </Popconfirm>
                                </div> : null
                            }
                        </div>
                    </div>
                    <div className='plan-details'>
                        <p>方案明细</p>
                        <Row className='plan-details-info'>
                            <Col span={8}>
                                <p><span>所属仓库：</span><span>{formatNullStr(reportDetail.warehouseName)}</span></p>
                                <p><span>仓位：</span><span>{formatNullStr(reportDetail.locationCodeStart)}  —  {formatNullStr(reportDetail.locationCodeEnd)}</span></p>
                            </Col>
                            <Col span={8}>
                                <p><span>物料分类：</span><span>{formatNullStr(reportDetail.materialCategoryName)}</span></p>
                                <p><span>物料：</span><span>{formatNullStr(reportDetail.materialName)}</span></p>
                            </Col>
                            <Col span={8} style={{ marginTop: 15 }}>
                                <div>备注：</div><p>{formatNullStr(reportDetail.remarks)}</p>
                            </Col>
                        </Row>
                    </div>
                    <div className='report-materialList'>
                        <div>
                            <p>物料明细</p>
                            <Select className='report-materialList-select' value={this.store._materialDetailStore.searchKey} style={{ width: 72 }} onChange={(key) => this.handleChange(key)}>
                                {statusOptions}
                            </Select>
                        </div>
                        <div style={{ clear: 'both' }}></div>
                        <Table
                            {..._varianceReportDetailsStore._materialDetailStore.Props}
                            rowKey='id'
                            columns={this.columns}
                            style={{ marginTop: '12px' }}
                        />
                    </div>
                </Spin>
            </div>
        )
    }
}