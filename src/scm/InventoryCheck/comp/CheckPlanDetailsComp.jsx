/**
 * 盘点方案详情
 */
import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Checkbox, Row, Col, Spin, Modal } from '../../../base/components/AntdComp';
import { checkplan_store, _checkplan_details } from "../store/CheckPlanStore";
import { formatNullStr } from '../../../base/consts/Utils';
import { store } from '../../data/StoreConfig';
import TabsAct from "../../actions/TabsAct";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const CheckboxGroup = Checkbox.Group;

@observer
class CheckPlanDetailsComp extends Component {
    constructor() {
        super();
        this.store = _checkplan_details;
    }

    pushDownHandler = () => {
        let { details } = this.store;
        let pm = { id: details.id, solutionCode: details.solutionCode }
        this.store.pushDown(pm).then(json => {
            if (json.status === 2000 && json.data) {
                store.dispatch(TabsAct.TabAdd({ title: "盘点方案", key: "inventoryCheckPlan" }));
                store.dispatch(TabsAct.TabRemove("CheckPlanDetailsComp", "inventoryCheckPlan"));
                checkplan_store.fetchTableList();
                message.success('下推成功, 盘点作业单' + json.data.stocktakeTaskCode)
            }
        })
    }

    render() {
        const loading = this.store.loading || false;
        let { details } = this.store;
        return (
            <div className='check-plan-details'>
                <Spin spinning={loading}>
                    <div className="details-head">
                        <div className='details-solutionCode'>
                            <p><span>方案编号:</span><span>{formatNullStr(details.solutionCode)}</span></p>
                        </div>
                        <div className='details-pushdown-btn'>
                            {
                                details.status == 1 ? < Popconfirm
                                    title="确定要将该盘点方案下推至盘点作业单吗？"
                                    okText="确定" 
                                    cancelText="取消"
                                    onConfirm={() => this.pushDownHandler()}>
                                    <Button type="primary" size="large" loading={this.store.loading} >
                                        <i className='c2mfont c2m-xiatui' style={{marginRight:'5px'}}></i>下推
                                    </Button>
                                </Popconfirm> : null
                            }
                        </div>
                    </div>
                    <div className='details-body'>
                        <p className='basic-info-title'>基本信息</p>
                        <div className='details-body-infos'>
                            <Row>
                                <Col span={8}>
                                    <p><span>方案名称：</span><span>{formatNullStr(details.solutionName)}</span></p>
                                    <p><span>仓位：</span><span>{formatNullStr(details.locationCodeStart) + ' — ' + formatNullStr(details.locationCodeEnd)}</span></p>
                                    <p><span>下推人：</span><span>{formatNullStr(details.pushdownByName)}</span></p>
                                    <p><span>更新人：</span><span>{formatNullStr(details.updateByName)}</span></p>
                                </Col>
                                <Col span={8}>
                                    <p><span>是否盲盘：</span><span><Checkbox checked={details.isBlindStocktake ? true : false}></Checkbox></span></p>
                                    <p><span>物料分类：</span><span>{formatNullStr(details.materialCategoryName)}</span></p>
                                    <p><span>下推时间：</span><span>{formatNullStr(details.pushdownDatetime)}</span></p>
                                    <p><span>更新时间：</span><span>{formatNullStr(details.updateDate)}</span></p>
                                </Col>
                                <Col span={8}>
                                    <p><span>所属仓库：</span><span>{formatNullStr(details.warehouseName)}</span></p>
                                    <p><span>物料：</span><span>{formatNullStr(details.materialName)}</span></p>
                                </Col>
                            </Row>
                            <Row>
                                <div>备注：</div><p>{formatNullStr(details.remarks)}</p>
                            </Row>
                        </div>
                    </div>
                </Spin>
            </div >
        );
    }
}

export default CheckPlanDetailsComp
