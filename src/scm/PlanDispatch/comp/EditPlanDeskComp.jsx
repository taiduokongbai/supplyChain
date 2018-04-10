/*计划分配详情、编辑*/

import React, { Component } from 'react';
import { planDeskListStore, searchBarStore } from "../store/PlanDeskListStore";
import { Form, Input, Button, Select, message, Dropdown, Menu, Icon, Spin, Row, Col, Popconfirm } from '../../../base/components/AntdComp';
import PlanTableEditComp from './EditPlanDispatchComp';
import { formatNullStr } from "../../../base/consts/Utils";
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { editInfoStore, editDetailStore } from "../store/EditPlanDispatchStore";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
import { prefix, prefix_route, prefixScm } from '../../../base/consts/UrlsConfig'

@observer
class EditPlanDeskComp extends Component {
    constructor(props) {
        super(props);
        this.store = editDetailStore;
        this.state = {
            popVisible: false,
            visible: false,
        }
    }
    saveHandler = (e) => {
        e.preventDefault();
        let form = this.refs.planTableEditCompRef
        form.validateFields((err, values) => {
            if (!err) {
                editInfoStore.save().then(json => {
                    if (json.status === 2000) {
                        editInfoStore.fetchTableList();
                        message.success('数据保存成功！')
                    }
                    editInfoStore.selectRows = editInfoStore.selectedRowKeys = [];
                })
            }
        })
    }
    title = () => {
        return (
            <h3 className="title"><span>*</span>计划分配(标准采购、外协加工、自制生产)</h3>
        );
    }
    getDetailComp = () => {
        let Comp = editInfoStore.Comp;
        let { selectedRowKeys } = editInfoStore;
        let rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                runInAction(() => {
                    editInfoStore.selectRows = selectedRows
                })
                editInfoStore.selectedRowKeys = selectedRowKeys
            },
        };
        return (
            <div>
                <Comp ref="planTableEditCompRef"
                    {...editInfoStore.Props}
                    rowKey={"id"}
                    title={this.title}
                    rowSelection={rowSelection} />
            </div>
        )
    }
    changeHandleClick = (e) => {
        e.preventDefault();
        let form = this.refs.planTableEditCompRef
        form.validateFields((err, values) => {
            if (!err) {
                editInfoStore.save().then(json => {
                    if (json.status == 2000) {
                        editInfoStore.onSubmit().then(json => {
                            if (json.status === 2000) {
                                editInfoStore.selectedRowKeys = [];
                                let pm = this.store.editDetail.planOrderCode;
                                this.store.fetchDeskDetails({ planOrderCode: pm }, false);
                            }
                        })
                    }
                    this.changeHandleCancel(false)
                })
            } else {
                message.info('请选择要提交的数据!')
            }
        })
    }
    changeHandleCancel = (flag) => {
        let interVal = setTimeout(() => {
            this.setState({ visible: flag, popVisible: false })
        }, 350)
    }
    explayPop = (e) => {
        let selectRows = editInfoStore.selectRows;
        let subMitData = 0;
        if (selectRows.length) {
            selectRows.forEach(item => {
                item.submitStatus == 1 ? subMitData += 1 : null
            })
            if (subMitData) {
                this.setState({ popVisible: true })
            } else message.info('请选择未提交数据进行提交！')
        } else message.info('请选择需要提交的行！')
    }

    onMore = (item) => {
        if (item.key == 'print') {
            let selectRows = editInfoStore.selectRows.slice();
            if (selectRows.length <= 0) {
                message.info('请选择需要打印的行！');
                return
            }
            let data = selectRows.filter(row => row.planMode == 3 || row.planMode == 4 && row.submitStatus == 2).map(row => row.id).join(',');
            if (data.length <= 0) {
                message.info('请选择有效打印的行！');
                return
            }
            window.open(`${prefix_route}/print.html?temp=plan&data=${data}`);
        }
    }
    render() {
        let info = this.store.editDetail;
        let menu = (
            <Menu style={{ textAlign: 'center' }} onClick={this.onMore}>
                <Menu.Item key="submit">
                    <Popconfirm title="请确认是否提交被选中的计划？"
                        visible={this.state.popVisible}
                        onConfirm={(e) => this.changeHandleClick(e)}
                        onCancel={() => this.changeHandleCancel(false)}
                    >
                        <span style={{ width: '56px', display: 'block' }} onClick={(e) => this.explayPop(e)}> 提交 </span>
                    </Popconfirm>
                </Menu.Item>
                <Menu.Item key="print">打印</Menu.Item>
            </Menu>
        );
        return (
            <div className="edit-plan-desk">
                <Spin spinning={this.store.spinLoading}>
                    <div className="edit-plan-desk-title">
                        <div className="edit-plan-desk-top">
                            <div>
                                <div className="edit-plan-desk-number">计划单号：{formatNullStr(info.planOrderCode)}</div>
                                <div className="edit-plan-desk-status">单据状态：{window.ENUM.getEnum("planDeskStatus", info.planOrderStatus)}</div>
                            </div>
                            <div>
                                <Button type="primary" className="edit-plan-desk-save" onClick={(e) => this.saveHandler(e)}><span className="add-save-icon c2mfont c2m-baocun"></span>保存</Button>
                                <Dropdown
                                    overlay={menu}
                                    trigger={['click']}
                                    visible={this.state.visible}
                                    onVisibleChange={this.changeHandleCancel}
                                    getPopupContainer={() => document.getElementsByClassName('edit-plan-desk')[0]}
                                ><Button type="default" className="edit-plan-desk-opration">更多操作 <Icon type="down" /></Button>
                                </Dropdown>
                            </div>
                        </div>
                        <Row className="edit-plan-desk-middle">
                            <Col span={8}><span><span className="edit-plan-desk-require">*</span>销售订单号：</span>{formatNullStr(info.sellOrderCodeDisplay)}</Col>
                        </Row>
                        <div className="edit-plan-desk-bottom">
                            <Row className="edit-plan-desk-bottom-top">
                                <Col span={8}><span className="edit-plan-desk-bottom-lable">合同编号：</span>{formatNullStr(info.contractCode)}</Col>
                                <Col span={8}><span className="edit-plan-desk-bottom-lable">产品名称：</span>{formatNullStr(info.materialName)}</Col>
                                <Col span={8}><span className="edit-plan-desk-bottom-lable">预计交货日期：</span>{formatNullStr(info.predictProvideDate)}</Col>
                            </Row>
                            <Row>
                                <Col span={8}><span className="edit-plan-desk-bottom-lable">客户名称：</span>{formatNullStr(info.customerName)}</Col>
                                <Col span={8}><span className="edit-plan-desk-bottom-lable">销售数量：</span>{formatNullStr(info.sellQty)}</Col>
                                <Col span={8}><span className="edit-plan-desk-bottom-lable">本次计划数量：</span>{formatNullStr(info.planQty)}</Col>
                            </Row>
                        </div>
                    </div>
                </Spin>
                <div className='edit-plan-dispatch-table'>
                    {
                        this.getDetailComp()
                    }
                </div>
            </div>
        )
    }
}
export default EditPlanDeskComp
export { EditPlanDeskComp }