import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col, AutoComplete } from '../../../base/components/AntdComp';

import FormComp from '../../../base/mobxComps/FormComp';
import { formatNullStr } from '../../../base/consts/Utils';
//redux的store 和 tab标签页action
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { materialDetailStore, materialDetailFJStore ,materialDetailDWStore} from '../stores/MaterialDetailStore';
import { materialListStore } from '../stores/MaterialListStore';
import { materialEditStore, measurestoreSize, measurestoreBase, measurestoreVolume, measurestoreWeight } from '../stores/MaterialEditStore';
import MaterialDetailKCComp from './MaterialDetailKCComp';
import MaterialDetailSCComp from './MaterialDetailSCComp';
import MaterialDetailSXComp from './MaterialDetailSXComp';
import MaterialDetailCGComp from './MaterialDetailCGComp';
import MaterialDetailJHComp from './MaterialDetailJHComp';
import MaterialDetailDWComp from './MaterialDetailDWComp';
import MaterialDetailFJComp from './MaterialDetailFJComp';
let Option = Select.Option;
const FormItem = Form.Item;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const colors = {
    0: '#4C80CF',
    1: '#417505',
    2: '#D0011B',
}
@observer
class MaterialDetailComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.store = materialDetailStore;
        this.materialDetailFJStore = materialDetailFJStore;
        this.materialListStore = materialListStore;
        this.materialEditStore = materialEditStore;
    }
    @observable showMore = false;
    setShowMore = () => this.showMore = !this.showMore;
    getE = (key, val) => {
        if (val !== undefined && val !== null && val !== "" && val !== "undefined") {
            return window.ENUM.getEnum(key, val)
        }
    };
    getBtn = (value) => {
        switch (value) {
            case 0:
                return <Button onClick={() => this.isDisable(1)} className="default-btn save"><i className="c2mfont c2m-qiyongcopy" style={{ paddingRight: 7, fontSize: 10 }}></i>启用</Button>
                break;
            case 1:
                return <Button onClick={() => this.isDisable(2)} className="default-btn save"><i className="c2mfont c2m-jinyong2" style={{ paddingRight: 7, fontSize: 10 }}></i>禁用</Button>
                break;
            case 2:
                return <Button onClick={() => this.isDisable(1)} className="default-btn save"><i className="c2mfont c2m-qiyongcopy" style={{ paddingRight: 7, fontSize: 10 }}></i>启用</Button>
                break;
            default:
        }
    };
    isDisable = (status) => {
        let materialCode = this.store.detail.materialCode;
        this.materialDetailFJStore.fetchMaterialisDisable({ materialCode: materialCode, status: status }).then(json => {
            if (json.status === 2000) {
                if(status===1){
                    message.success('启用成功')
                }else{
                    message.success('禁用成功')
                }
                this.store.fetchMaterialDetail({ materialCode });
            }
        }).then(json => {
            materialListStore.fetchTableList('');
            store.dispatch(TabsAct.TabRemove('detailMaterial'));
            store.dispatch(TabsAct.TabAdd({
                title: "物料列表",
                key: "materialList"
            }));
        })
    };
    materialEdit = () => {
        materialDetailDWStore.setEditRecord();
        let materialCode = this.store.detail.materialCode;
        this.materialEditStore.fetchMaterialDetail({ materialCode }).then(() => {
            measurestoreBase.initData();
            measurestoreVolume.initData();
            measurestoreSize.initData();
            measurestoreWeight.initData();
        });
        store.dispatch(TabsAct.TabAdd({
            title: "编辑物料",
            key: "editMaterial"
        }));
    }
    render() {
        let { detail, loading } = this.store;
        // console.log('materialProperty---',detail.materialPlanList[0].materialProperty);
        return (
            <div className="materialDetail-wrap">
                <Spin spinning={loading}>
                    <div className="material-header">
                        <div className="material-head-border">
                            <div className="material-head-left">
                                <strong
                                    className="materialm-head-h1 material-head-strong">物料：{detail.materialCode}|{detail.materialName}
                                </strong>
                                <span className="material-head-h">
                                    状态：<strong style={{ color: colors[detail.status], paddingRight: 5 }}>{formatNullStr(this.getE("materialStatusData", detail.status + ""))}</strong>
                                    计划属性：<strong className="material-head-strong" style={{ paddingRight: 5 }}>{formatNullStr(this.getE("materialPro", detail.materialPlanList ? detail.materialPlanList.slice()[0].materialProperty + "" : ""))}</strong>
                                    {/* 存货类别：<strong className="material-head-strong">{formatNullStr(this.getE("materialInventoryType", detail.materialInventoryList.slice()[0].materialInventoryType + ""))}</strong> */}
                                </span>
                            </div>
                            <Button onClick={this.materialEdit} className="default-btn m-bianji"><i className="c2mfont c2m-bianji1" style={{ paddingRight: 7, fontSize: 10 }}></i>编辑</Button>
                            {
                                this.getBtn(detail.status)
                            }
                        </div>
                    </div>
                    <div className="material-body-border">
                        <div className="material-body-top">
                            <div className="material-baseInfo">
                                <span className="material-form-baseInfo"><strong>基本信息</strong></span>
                            </div>
                            <Row>
                                <Col span={8}>
                                    <FormItem
                                        label="物料编码"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('materialCode', {
                                        })(
                                            <span>{formatNullStr(detail.materialCode)}</span>
                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="规格"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('materialSpec', {
                                        })(
                                            <span>{formatNullStr(detail.materialSpec)}</span>
                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="材料"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('materialTexture', {
                                            initialValue: detail.materialTexture,
                                        })(
                                            <span>{formatNullStr(detail.materialTexture)}</span>
                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="品牌"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('brand', {
                                            initialValue: detail.brand,
                                        })(
                                            <span>{formatNullStr(detail.brand)}</span>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="物料名称"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('materialName', {
                                        })(
                                            <span>{formatNullStr(detail.materialName)}</span>
                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="型号"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('model', {
                                        })(
                                            <span>{formatNullStr(detail.model)}</span>

                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="代号"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('materialCodeName', {
                                            initialValue: detail.materialCodeName,
                                        })(
                                            <span>{formatNullStr(detail.materialCodeName)}</span>
                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="基本单位"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('measureUnitName', {
                                        })(
                                            <span>{formatNullStr(detail.measureUnitName)}</span>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="简码"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('simpleCode', {
                                        })(
                                            <span>{formatNullStr(detail.simpleCode)}</span>
                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="物料分类"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('categoryName', {
                                        })(
                                            <span>{formatNullStr(detail.categoryName)}</span>

                                            )}
                                    </FormItem>
                                    <FormItem
                                        label="物料类型"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('categoryCode', {
                                        })(
                                            <span>{formatNullStr(this.getE("materialType", detail.type + ""))}</span>
                                            )}
                                    </FormItem>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <FormItem
                                        label="备注"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                    >
                                        {this.getFD('materialDesc', {
                                            rules: [{ message: '请输入描述' }, { message: '描述不能超过200字符', max: 200 }],
                                        })(
                                            <span type='textarea' style={{ height: '76px' }} >{formatNullStr(detail.materialDesc)}</span>
                                            )}
                                    </FormItem>
                                </Col>
                                <a className="show-more-info" onClick={this.setShowMore} href="#">{this.showMore ? '收起更多隐藏信息' : '展开更多隐藏信息'}</a>
                            </Row>
                        </div>
                        <div className="material-body-down" style={{ display: this.showMore ? `block` : `none` }}>
                            <Row type="flex" justify="end">
                                <Col span={8}>
                                    <FormItem
                                        label="长"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('sizeLength', {
                                        })(
                                            <span>{formatNullStr(detail.sizeLength)}</span>
                                            )}<span style={{ paddingLeft: 5 }}>{detail.sizeLength ? detail.sizeUnitName : ""}</span>
                                    </FormItem>
                                    <FormItem
                                        label="体积"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('sizeVolume', {
                                        })(
                                            <span>{formatNullStr(detail.sizeVolume)}</span>
                                            )}<span style={{ paddingLeft: 5 }}>{detail.sizeVolume ? detail.volumeUnitName : ""}</span>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="宽"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('sizeWidth', {
                                        })(
                                            <span>{formatNullStr(detail.sizeWidth)}</span>
                                            )}<span style={{ paddingLeft: 5 }}>{detail.sizeWidth ? detail.sizeUnitName : ""}</span>
                                    </FormItem>
                                    <FormItem
                                        label="毛重"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('roughWeight', {
                                        })(
                                            <span>{formatNullStr(detail.roughWeight)}</span>
                                            )}<span style={{ paddingLeft: 5 }}>{detail.roughWeight ? detail.weightUnitName : ""}</span>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="高"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('sizeHeight', {
                                        })(
                                            <span>{formatNullStr(detail.sizeHeight)}</span>
                                            )}<span style={{ paddingLeft: 5 }}>{detail.sizeHeight ? detail.sizeUnitName : ""}</span>
                                    </FormItem>
                                    <FormItem
                                        label="净重"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('netWeight', {
                                        })(
                                            <span>{formatNullStr(detail.netWeight)}</span>
                                            )}<span style={{ paddingLeft: 5 }}>{detail.netWeight ? detail.weightUnitName : ""}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                        <div className="material-body-down">
                            <Row className="material-body-top">
                                <Col span={12}>
                                    <MaterialDetailKCComp />
                                </Col>
                                <Col span={12}>
                                    <MaterialDetailSCComp />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <MaterialDetailSXComp />
                                </Col>
                                <Col span={12}>
                                    <MaterialDetailCGComp />
                                </Col>
                            </Row>
                            <Row>
                                <MaterialDetailJHComp />
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <MaterialDetailDWComp />
                                </Col>
                                <Col span={12}>
                                    <MaterialDetailFJComp />
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }

}
export default Form.create()(MaterialDetailComp);