import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col, AutoComplete, Cascader } from '../../../base/components/AntdComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import { enumStore } from '../../../base/stores/EnumStore';
import FormComp from '../../../base/mobxComps/FormComp';
//redux的store 和 tab标签页action
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import MeasureComp from '../../../base/mobxComps/MeasureComp';
import { materialAddStore, measurestoreSize, measurestoreBase, measurestoreVolume, measurestoreWeight } from '../stores/MaterialAddStore';
//物料分类store
import { materialTypeStore, materialListStore } from '../stores/MaterialListStore';
import { materialDetailStore, materialDetailFJStore, materialDetailDWListStore } from '../stores/MaterialDetailStore';
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
class MaterialAddComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.title = "新建物料";
        this.store = materialAddStore;
        this.measurestoreSize = measurestoreSize;
        this.measurestoreBase = measurestoreBase;
        this.measurestoreVolume = measurestoreVolume;
        this.measurestoreWeight = measurestoreWeight;
        this.materialDetailDWListStore = materialDetailDWListStore;

        // this.measureVolumeUnitStore = new Measurestore();
        // this.measureWeightUnitStore = new Measurestore();
        this.materialTypeStore = materialTypeStore;
        this.materialDetailStore = materialDetailStore;
        this.materialDetailFJStore = materialDetailFJStore;
        this.materialListStore = materialListStore;
    }
    @observable showMore = false;
    componentWillUnmount = () => {
        this.store.resetDetail()
        this.forceUpdate()
    }
    componentDidMount = () => {
        // this.materialListStore.isAuto()
    }
    setShowMore = () => {
        this.showMore = !this.showMore;
        // this.measurestore.initData();
    }
    getE = (key, val) => {
        if (val !== undefined && val !== null && val !== "" && val !== "undefined") {
            return window.ENUM.getEnum(key, val)
        }
    };
    onMessage = () => {
        message.success('保存成功');
    }
    strConvertNumber = (value) => {
        if (value === "") {
            return null;
        }
        else if (value === '') {
            return null;
        }
        else if (value === undefined) {
            return null;
        }
        return Number(value);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.validateFds((err, data) => {
            if (!err) {
                let newData = {}, newSizeUnit = {}, newVolumeUnit = {}, newWeightUnit;
                newData = { ...data.measureUnit };
                newSizeUnit = { ...data.sizeUnit };
                newVolumeUnit = { ...data.volumeUnit };
                newWeightUnit = { ...data.weightUnit };
                delete newData.measure;
                delete newSizeUnit.measure;
                delete newVolumeUnit.measure;
                delete newWeightUnit.measure;
                delete data.measureUnit;
                delete data.sizeUnit;
                delete data.volumeUnit;
                delete data.weightUnit;
                if (newData.dimensionality == 1 || newData.dimensionality == 0) {
                    if (newData.meaCode == '') {
                        data.baseDimensionality = this.strConvertNumber(newData.dimensionality)
                        data.baseUnitSystem = null
                        data.baseUnitCode = newData.meaSystem
                    } else {
                        data.baseDimensionality = this.strConvertNumber(newData.dimensionality)
                        data.baseUnitSystem = null
                        data.baseUnitCode = newData.meaCode
                    }
                } else {
                    data.baseDimensionality = this.strConvertNumber(newData.dimensionality)
                    data.baseUnitSystem = this.strConvertNumber(newData.meaSystem)
                    data.baseUnitCode = newData.meaCode
                }
                if (newSizeUnit.dimensionality == 1 || newSizeUnit.dimensionality == 0) {
                    if (newSizeUnit.meaCode == '') {
                        data.sizeDimensionality = this.strConvertNumber(newSizeUnit.dimensionality)
                        data.sizeUnitSystem = null
                        data.sizeUnit = newSizeUnit.meaSystem
                    } else {
                        data.sizeDimensionality = this.strConvertNumber(newSizeUnit.dimensionality)
                        data.sizeUnitSystem = null
                        data.sizeUnit = newSizeUnit.meaCode
                    }
                } else {
                    data.sizeDimensionality = this.strConvertNumber(newSizeUnit.dimensionality)
                    data.sizeUnitSystem = this.strConvertNumber(newSizeUnit.meaSystem)
                    data.sizeUnit = newSizeUnit.meaCode
                }
                if (newVolumeUnit.dimensionality == 1 || newVolumeUnit.dimensionality == 0) {
                    if (newVolumeUnit.meaCode == '') {
                        data.volumeDimensionality = this.strConvertNumber(newVolumeUnit.dimensionality)
                        data.volumeUnitSystem = null
                        data.volumeUnit = newVolumeUnit.meaSystem
                    } else {
                        data.volumeDimensionality = this.strConvertNumber(newVolumeUnit.dimensionality)
                        data.volumeUnitSystem = null;
                        data.volumeUnit = newVolumeUnit.meaCode
                    }
                } else {
                    data.volumeDimensionality = this.strConvertNumber(newVolumeUnit.dimensionality)
                    data.volumeUnitSystem = this.strConvertNumber(newVolumeUnit.meaSystem)
                    data.volumeUnit = newVolumeUnit.meaCode
                }
                if (newWeightUnit.dimensionality == 1 || newWeightUnit.dimensionality == 0) {
                    if (newWeightUnit.meaCode == '') {
                        data.weightDimensionality = this.strConvertNumber(newWeightUnit.dimensionality)
                        data.weightUnitSystem = null
                        data.weightUnit = newWeightUnit.meaSystem
                    } else {
                        data.weightDimensionality = this.strConvertNumber(newWeightUnit.dimensionality)
                        data.weightUnitSystem = null
                        data.weightUnit = newWeightUnit.meaCode
                    }
                } else {
                    data.weightDimensionality = this.strConvertNumber(newWeightUnit.dimensionality)
                    data.weightUnitSystem = this.strConvertNumber(newWeightUnit.meaSystem)
                    data.weightUnit = newWeightUnit.meaCode
                }
                if(data.materialCode1==undefined){
                    delete data.materialCode1;
                    data.materialCode =='';
                }
                data = Object.assign({}, data);
                this.store.fetchMaterialSubmit(data).then(json => {
                    if (json.status === 2000) {
                        this.onMessage();
                        let materialCode = json.data.materialCode;
                        this.materialDetailStore.fetchMaterialDetail({ materialCode });
                        this.materialDetailDWListStore.fetchSelectList({ materialCode });
                        this.materialListStore.fetchTableList('');
                        if (this.title == 'edit') {
                            store.dispatch(TabsAct.TabRemove('editMaterial'));
                        } else {
                            store.dispatch(TabsAct.TabRemove('addMaterial'));
                        }
                        store.dispatch(TabsAct.TabAdd({
                            title: "物料详情",
                            key: "detailMaterial"
                        }));
                    }
                })
            }
        })

    }
    onChange = (value) => {
    }
    render() {
        let { loading, detail, defaultMeasureList } = this.store;
        const { setFieldsValue } = this.props.form;
        let str = {}, strSizeUnit = {}, strVolumeUnit = {}, strWeightUnit = {};
        //基本单位
        if (this.title == 'edit') {
            if (detail.baseDimensionality === 1 || detail.baseDimensionality === 0) {
                str = {
                    dimensionality: detail.baseDimensionality,
                    meaCode: detail.baseUnitCode
                }
            } else {
                str = {
                    dimensionality: detail.baseDimensionality,
                    meaSystem: detail.baseUnitSystem,
                    meaCode: detail.baseUnitCode
                }
            }
        } else {
            if (defaultMeasureList.slice().length > 0) {
                if (defaultMeasureList.slice()[0].dimensionality == 1 || defaultMeasureList.slice()[0].dimensionality == 0) {
                    str = {
                        dimensionality: defaultMeasureList.slice()[0].dimensionality,
                        meaCode: defaultMeasureList.slice()[0].meaCode
                    }
                } else {
                    str = {
                        dimensionality: defaultMeasureList.slice()[0].dimensionality,
                        meaSystem: defaultMeasureList.slice()[0].meaSystem,
                        meaCode: defaultMeasureList.slice()[0].meaCode
                    }
                }
            }
        }
        //尺寸单位
        if (this.title == 'edit') {
            if (detail.sizeDimensionality == 1 || detail.sizeDimensionality == 0) {
                strSizeUnit = {
                    dimensionality: detail.sizeDimensionality,
                    meaCode: detail.sizeUnit
                }
            } else {
                strSizeUnit = {
                    dimensionality: detail.sizeDimensionality,
                    meaSystem: detail.sizeUnitSystem,
                    meaCode: detail.sizeUnit
                }
            }
        } else {
            if (defaultMeasureList.slice().length > 0) {
                if (defaultMeasureList.slice()[1].dimensionality == 1 || defaultMeasureList.slice()[1].dimensionality == 0) {
                    strSizeUnit = {
                        dimensionality: defaultMeasureList.slice()[1].dimensionality,
                        meaCode: defaultMeasureList.slice()[1].meaCode
                    }
                } else {
                    strSizeUnit = {
                        dimensionality: defaultMeasureList.slice()[1].dimensionality,
                        meaSystem: defaultMeasureList.slice()[1].meaSystem,
                        meaCode: defaultMeasureList.slice()[1].meaCode
                    }
                }
            }
        }
        //体积单位
        if (this.title == 'edit') {
            if (detail.volumeDimensionality == 1 || detail.volumeDimensionality == 0) {
                strVolumeUnit = {
                    dimensionality: detail.volumeDimensionality,
                    meaCode: detail.volumeUnit
                }
            } else {
                strVolumeUnit = {
                    dimensionality: detail.volumeDimensionality,
                    meaSystem: detail.volumeUnitSystem,
                    meaCode: detail.volumeUnit
                }
            }
        } else {
            if (defaultMeasureList.slice().length > 0) {
                if (defaultMeasureList.slice()[3].dimensionality == 1 || defaultMeasureList.slice()[3].dimensionality == 0) {
                    strVolumeUnit = {
                        dimensionality: defaultMeasureList.slice()[3].dimensionality,
                        meaCode: defaultMeasureList.slice()[3].meaCode
                    }
                } else {
                    strVolumeUnit = {
                        dimensionality: defaultMeasureList.slice()[3].dimensionality,
                        meaSystem: defaultMeasureList.slice()[3].meaSystem,
                        meaCode: defaultMeasureList.slice()[3].meaCode
                    }
                }
            }
        }
        //重量单位
        if (this.title == 'edit') {
            if (detail.weightDimensionality == 1 || detail.weightDimensionality == 0) {
                strWeightUnit = {
                    dimensionality: detail.weightDimensionality,
                    meaCode: detail.weightUnit
                }
            } else {
                strWeightUnit = {
                    dimensionality: detail.weightDimensionality,
                    meaSystem: detail.weightUnitSystem,
                    meaCode: detail.weightUnit
                }
            }
        } else {
            if (defaultMeasureList.slice().length > 0) {
                if (defaultMeasureList.slice()[2].dimensionality == 1 || defaultMeasureList.slice()[2].dimensionality == 0) {
                    strWeightUnit = {
                        dimensionality: defaultMeasureList.slice()[2].dimensionality,
                        meaCode: defaultMeasureList.slice()[2].meaCode
                    }
                } else {
                    strWeightUnit = {
                        dimensionality: defaultMeasureList.slice()[2].dimensionality,
                        meaSystem: defaultMeasureList.slice()[2].meaSystem,
                        meaCode: defaultMeasureList.slice()[2].meaCode
                    }
                }
            }
        }
        return (
            <div className="material-wrap">
                <Spin spinning={loading}>
                    <div className="material-header">
                        <div className="material-head-border">
                            {
                                this.title == 'edit' ? <div className="material-head-left">
                                    <strong
                                        className="materialm-head-h1 material-head-strong">物料：{detail.materialCode}|{detail.materialName}
                                    </strong>
                                    <span className="material-head-h">
                                        状态：<strong style={{ color: colors[detail.status], paddingRight: 5 }}>{this.getE("materialStatusData", detail.status ? detail.status + "" : "0")}</strong>
                                        计划属性：<strong className="material-head-strong" style={{ paddingRight: 5 }}>{this.getE("materialPro", detail.materialPlanList ? detail.materialPlanList[0].materialProperty + "" : "0")}</strong>
                                        存货类别：<strong className="material-head-strong">{this.getE("materialInventoryType", detail.materialInventoryList ? detail.materialInventoryList[0].materialInventoryType + "" : "0")}</strong>
                                    </span>
                                </div> :
                                    <span className="material-header-title">{this.title}</span>
                            }
                            <Button onClick={this.handleSubmit} className="default-btn save"><i className="c2mfont c2m-baocun" style={{ paddingRight: 7, fontSize: 10 }}></i>保存</Button>
                        </div>
                    </div>
                    <Form className="material-form">
                        <div className="material-body-border">
                            <div className="material-body-top">
                                <div className="material-baseInfo">
                                    <span className="material-form-baseInfo"><strong>基本信息</strong></span>
                                </div>
                                <Row>
                                    <Col className="material-body-top-borderR" span={8}>
                                        {(this.materialListStore.statusMaterial.ruleType === 0 && this.title!=='edit') ?
                                            <FormItem
                                                label="物料编码"
                                                labelCol={{ span: 4 }}
                                                wrapperCol={{ span: 10 }}
                                            >
                                                {this.getFD('materialCode1', {
                                                    initialValue: detail.materialCode,
                                                    rules: [
                                                        { message: '物料编码不能超过20字符', max: 20 },
                                                        { type: 'numLetterList', label: '物料编码' },
                                                    ],
                                                })(
                                                    <Input disabled={true} />
                                                    )}
                                            </FormItem> :
                                            <FormItem
                                                label="物料编码"
                                                labelCol={{ span: 4 }}
                                                wrapperCol={{ span: 10 }}
                                            >
                                                {this.getFD('materialCode', {
                                                    initialValue: detail.materialCode,
                                                    rules: [
                                                        { required: true, message: '物料编码为必填' },
                                                        { message: '物料编码不能超过20字符', max: 20 },
                                                        { type: 'numLetterList', label: '物料编码' },
                                                    ],
                                                })(
                                                    <Input disabled={(detail.status == 0 || detail.status == 1 || detail.status == 2) ? true : false} />
                                                    )}
                                            </FormItem>}

                                        <FormItem
                                            label="规格"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('materialSpec', {
                                                initialValue: detail.materialSpec,
                                                rules: [
                                                    { message: '规格不能超过50字符', max: 50 }],
                                            })(
                                                <Input disabled={(detail.status == 1 || detail.status == 2) ? true : false} />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="材料"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('materialTexture', {
                                                initialValue: detail.materialTexture,
                                                rules: [{ message: '材料不能超过50字符', max: 50 }],
                                            })(
                                                <Input disabled={(detail.status == 1 || detail.status == 2) ? true : false} />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="品牌"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('brand', {
                                                initialValue: detail.brand,
                                                rules: [{ message: '品牌不能超过50字符', max: 50 }],
                                            })(
                                                <Input disabled={(detail.status == 1 || detail.status == 2) ? true : false} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col className="material-body-top-borderR" span={8}>
                                        <FormItem
                                            label="物料名称"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('materialName', {
                                                initialValue: detail.materialName,
                                                rules: [
                                                    { whitespace: true, required: true, message: '物料名称为必填' },
                                                    { message: '物料名称不能超过50字符', max: 50 }],
                                            })(
                                                <Input disabled={(detail.status == 1 || detail.status == 2) ? true : false} />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="型号"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('model', {
                                                initialValue: detail.model,
                                                rules: [{ message: '型号不能超过50字符', max: 50 }],
                                            })(
                                                <Input disabled={(detail.status == 1 || detail.status == 2) ? true : false} />

                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="代号"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('materialCodeName', {
                                                initialValue: detail.materialCodeName,
                                                rules: [{ message: '代号不能超过50字符', max: 50 }],
                                            })(
                                                <Input disabled={(detail.status == 1 || detail.status == 2) ? true : false} />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="基本单位"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('measureUnit', {
                                                initialValue: '' || str,
                                                rules: [{
                                                    required: true,
                                                    validator: (rule, value, callback) => {
                                                        if (value.dimensionality === '') {
                                                            callback('单位 为必填')
                                                        } else {
                                                            if (value.dimensionality === 0 || value.dimensionality == 1) {
                                                                if (value.meaSystem === '') {
                                                                    callback('单位 为必填')
                                                                } else {
                                                                    callback()
                                                                }
                                                            } else {
                                                                if (value.meaSystem === '' || value.meaCode == '') {
                                                                    callback('单位 为必填')
                                                                } else {
                                                                    callback()
                                                                }
                                                            }
                                                        }
                                                    }
                                                }],
                                            })(
                                                <MeasureComp store={this.measurestoreBase} disabled={(detail.status == 0 || detail.status == 1 || detail.status == 2) ? true : false} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col className="material-body-top-borderR" span={8}>
                                        <FormItem
                                            label="简码"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('simpleCode', {
                                                initialValue: detail.simpleCode,
                                                rules: [
                                                    { message: '简码不能超过10字符', max: 10 },
                                                    { type: 'numLetterList', label: '简码' },
                                                ],
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="物料分类"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('categoryCode', {
                                                initialValue: detail.categoryCode,
                                                rules: [
                                                    { message: '物料分类为必填', max: 50, required: true, }],
                                            })(
                                                <TreeSelect className="treeselect"
                                                    {...this.materialTypeStore.Props}
                                                    width={300}
                                                    onChange={this.onChange}
                                                    notFoundContent="暂无数据"
                                                >
                                                </TreeSelect>

                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="物料类型"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('type', {
                                                initialValue: detail.type + "" || '0',
                                                rules: [{ required: true, message: '物料类型为必填!' }],
                                            })(
                                                <Select >
                                                    {
                                                        window.ENUM.getEnum("materialType").map(materialType => {
                                                            return <Select.Option value={materialType.catCode.toString()} key={materialType.catCode}>{materialType.catName}</Select.Option>
                                                        })
                                                    }
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="material-body-top-borderR" span={8}>
                                        <FormItem
                                            label="备注"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 20 }}
                                        >
                                            {this.getFD('materialDesc', {
                                                initialValue: detail.materialDesc,
                                                rules: [{ message: '描述不能超过200字符', max: 200 }],
                                            })(
                                                <Input type='textarea' style={{ height: '76px' }} />
                                                )}
                                        </FormItem>
                                    </Col>

                                </Row>
                                <a className="show-more-info" onClick={this.setShowMore} href="#">{this.showMore ? '收起更多隐藏信息' : '展开更多隐藏信息'}</a>
                            </div>
                            <div className="material-body-down" style={{ display: this.showMore ? `block` : `none` }}>
                                <div className="material-baseInfo">
                                    <span className="material-form-baseInfo"><strong>尺寸</strong></span>
                                </div>
                                <Row type="flex" justify="end">
                                    <Col className="material-body-top-borderR" span={8}>
                                        <FormItem
                                            label="长"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('sizeLength', {
                                                initialValue: detail.sizeLength,
                                                rules: [{ type: 'gtEqZeroNum', label: '长' }],
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="尺寸单位"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('sizeUnit', {
                                                initialValue: strSizeUnit,
                                                rules: [{
                                                    validator: (rule, value, callback) => {
                                                        if (value.dimensionality === '') {
                                                            callback('单位 为必填')
                                                        } else {
                                                            if (value.dimensionality === 0 || value.dimensionality == 1) {
                                                                if (value.meaSystem === '') {
                                                                    callback('单位 为必填')
                                                                } else {
                                                                    callback()
                                                                }
                                                            } else {
                                                                if (value.meaSystem === '' || value.meaCode == '') {
                                                                    callback('单位 为必填')
                                                                } else {
                                                                    callback()
                                                                }
                                                            }
                                                        }
                                                    }
                                                }],
                                            })(
                                                <MeasureComp store={this.measurestoreSize} allowClear={false} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col className="material-body-top-borderR" span={8}>
                                        <FormItem
                                            label="宽"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('sizeWidth', {
                                                initialValue: detail.sizeWidth,
                                                rules: [{ type: 'gtEqZeroNum', label: '宽' }],
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="体积"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('sizeVolume', {
                                                //initialValue: this.props.title=="物料新增"?this.state.sizeWidth*this.state.sizeHeight*this.state.sizeLength:this.state.updateLength||this.state.updateWidth||this.state.updateHeight?sum:Number(Record.sizeVolume),
                                                initialValue: detail.sizeVolume,
                                                rules: [{ type: 'gtEqZeroNum', label: '体积' }],
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col className="material-body-top-borderR" span={8}>
                                        <FormItem
                                            label="高"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('sizeHeight', {
                                                initialValue: detail.sizeHeight,
                                                rules: [{ type: 'gtEqZeroNum', label: '高' }],
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="体积单位"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('volumeUnit', {
                                                initialValue: strVolumeUnit,
                                                rules: [{
                                                    validator: (rule, value, callback) => {
                                                        if (value.dimensionality === '') {
                                                            callback('单位 为必填')
                                                        } else {
                                                            if (value.dimensionality === 0 || value.dimensionality == 1) {
                                                                if (value.meaSystem === '') {
                                                                    callback('单位 为必填')
                                                                } else {
                                                                    callback()
                                                                }
                                                            } else {
                                                                if (value.meaSystem === '' || value.meaCode == '') {
                                                                    callback('单位 为必填')
                                                                } else {
                                                                    callback()
                                                                }
                                                            }
                                                        }
                                                    }
                                                }],
                                            })(
                                                <MeasureComp store={this.measurestoreVolume} allowClear={false} />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <div className="material-baseInfo">
                                    <span className="material-form-baseInfo"><strong>重量</strong></span>
                                </div>
                                <Row type="flex" justify="end">
                                    <Col className="material-body-top-borderR" span={8}>
                                        <FormItem
                                            label="毛重"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('roughWeight', {
                                                initialValue: detail.roughWeight,
                                                rules: [{ type: 'gtEqZeroNum', label: '毛重' }],
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col className="material-body-top-borderR" span={8}>
                                        <FormItem
                                            label="净重"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('netWeight', {
                                                initialValue: detail.netWeight,
                                                rules: [{ type: 'gtEqZeroNum', label: '净重' }],
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col className="material-body-top-borderR" span={8}>
                                        <FormItem
                                            label="重量单位"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('weightUnit', {
                                                initialValue: strWeightUnit,
                                                rules: [{
                                                    validator: (rule, value, callback) => {
                                                        if (value.dimensionality === '') {
                                                            callback('单位 为必填')
                                                        } else {
                                                            if (value.dimensionality === 0 || value.dimensionality == 1) {
                                                                if (value.meaSystem === '') {
                                                                    callback('单位 为必填')
                                                                } else {
                                                                    callback()
                                                                }
                                                            } else {
                                                                if (value.meaSystem === '' || value.meaCode == '') {
                                                                    callback('单位 为必填')
                                                                } else {
                                                                    callback()
                                                                }
                                                            }
                                                        }
                                                    }
                                                }],
                                            })(
                                                <MeasureComp store={this.measurestoreWeight} allowClear={false} />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Form>
                </Spin>
            </div>
        )
    }
}
const options = {
    onValuesChange(props, values) {
        materialAddStore.setMaterialDetail(values)
    }
}

export { MaterialAddComp };
export default Form.create(options)(MaterialAddComp);