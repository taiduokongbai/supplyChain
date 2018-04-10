/*计划分配详情、编辑表格*/
import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Icon, DatePicker, Select, Form, Row, Col } from '../../../base/components/AntdComp';
import { TableEditComp } from '../../../base/mobxComps/TableEditComp';
import Validate from "../../../base/consts/ValidateList";
let { observable, action, computed, runInAction, toJS } = mobx;
import { editInfoStore, editDatePickerDialog, editDetailStore, confirmSaveStore } from '../store/EditPlanDispatchStore';
import FormComp from '../../../base/mobxComps/FormComp';
import moment from 'moment';
import { findDOMNode } from 'react-dom';
import ModalComp from '../../../base/mobxComps/ModalComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { enumStore } from '../../../base/stores/EnumStore';
let { observer } = mobxReact;
let FormItem = Form.Item;
let Option = Select.Option;
let { RangePicker } = DatePicker;
@observer
class PlanTableEdit extends FormComp {
    constructor(props) {
        super(props);
        this.state = {
            f_s: {  // filter status
                materialCode: false,         //物料编码
                materialCategory: false,     // 物料分类
                materialPlanAttribute: false,   // 计划属性
                materialSymbol: false,     // 物料代号
                materialName: false,       // 物料名称
                materialSpec: false,       // 物料规格
                materialTexture: false,    // 材料
                materialDesc: false,        // 描述
                planMode: false,         // 计划方式
                preReceiveDateStart: false,  // 预计到货日期开始
                preReceiveDateEnd: false,  // 预计到货日期结束
                submitStatus: false,      // 提交状态
            },
            f_v: {  // filter visible
                materialCode: false,
                materialCategory: false,     // 物料分类
                materialPlanAttribute: false,   // 计划属性
                materialSymbol: false,     // 物料代号
                materialName: false,       // 物料名称
                materialSpec: false,       // 物料规格
                materialTexture: false,    // 材料
                materialDesc: false,        // 描述
                planMode: false,         // 计划方式
                preReceiveDateStart: false,  // 预计到货日期开始
                preReceiveDateEnd: false,  // 预计到货日期结束
                submitStatus: false,      // 提交状态
            },
            dateParams: {},//日期传参
            filteredInfo: null, //计划方式过滤
        }
    }
    inputColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, render, onChange, ...inputProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = dataIndex == 'qty' ? record.submitStatus == 1 : (dataIndex == 'predictWorkhours' ? record.planMode == '4' && record.submitStatus == 1 : false)
        if (show) {
            let changeEvent = (e) => {
                if (onChange) {
                    let value = e.target.value;
                    onChange(value, dataIndex, index)
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex + "_" + record.id, {
                            initialValue: dataIndex == 'predictWorkhours' ? Number(record[dataIndex]).toFixed(2) : Number(record[dataIndex]).toFixed(4),
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <Input
                                style={{ width: 100 }}
                                {...inputProps}
                            />
                            )}
                    </FormItem>
                </div>
            )
        } else if (render) {
            if (render.wid) {
                return <TooltipComp attr={{ text: text, ...render }} />
            }
            if (typeof render == 'function') {
                return render(text, record, index);
            }
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }
    datePickerColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, render, onChange, ...dateProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = record.submitStatus == 1;
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    onChange(value, dataIndex, index)
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex + "_" + record.id, {
                            initialValue: record[dataIndex],
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <DatePickerCell
                                {...dateProps}
                            />
                            )}
                    </FormItem>
                </div>
            )
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }
    selectColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, selectStore, enumCode, onChange, ...selectProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = record.submitStatus == 1;
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    onChange(value, dataIndex, index);
                    this.onChangeHandler(0.00, 'predictWorkhours', index)
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex + "_" + record.id, {
                            initialValue: String(record[dataIndex]),
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <Select
                                style={{ width: 88 }}
                                {...selectProps}
                            >
                                <Option value="1">标准采购</Option>
                                <Option value="2">外协采购</Option>
                                <Option value="3">外协加工</Option>
                                <Option value="4">自制生产</Option>
                                <Option value="5">无需求</Option>
                            </Select>
                            )}
                    </FormItem>
                </div>
            )
        } else {
            return <div style={textStyle}>{this.planMethods(record[dataIndex])}</div>
        }
    }
    textColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, render, enumCode, selectStore, isTrue } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];

        if (enumCode) {
            text = enumStore.getEnum(enumCode, text);
        } else if (selectStore) {
            text = selectStore.getLabelName(text);
        };
        if (show) {
            return (
                <FormItem>
                    {this.getFD(dataIndex, {
                        initialValue: editingRecord[dataIndex],
                    })(
                        <TextCell
                            {...obj}
                        />
                        )}
                </FormItem>
            )
        } else if (isTrue) {
            return <Radio checked={isTrue == text ? true : false} disabled style={textStyle} />
        } else if (render) {
            if (render.wid) {
                return <TooltipComp attr={{ text: text, ...render }} />
            }
            if (typeof render == 'function') {
                return render(text, record, index);
            }
            // } else if (dataIndex == 'materialPlanAttribute') {
            //     return window.ENUM.getEnum("materialPlanAttribute", text + '')
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }
    planMethods = (val) => {
        switch (val) {
            case 1:
                return <span>标准采购</span>
            case 2:
                return <span>外协采购</span>;
            case 3:
                return <span>外协加工</span>;
            case 4:
                return <span>自制生产</span>;
            case 5:
                return <span>无需求</span>;
            default:
                return <span></span>
        }
    }
    onSearch = (dataIndex) => {
        const { searchPm, isChanged, setSearchPm } = editInfoStore;  // 搜索值
        let params = { ...searchPm };
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                for (var i in params) {
                    if (i == dataIndex) {
                        if (values[dataIndex] == undefined) {
                            params[i] == ""
                        } else {
                            params[i] = values[dataIndex];
                        }
                    }
                }
                let pm = Object.assign({}, params);
                if (isChanged == false) {
                    setSearchPm(pm);
                    let filtervisible = this.state.f_v;
                    let filterStatus = this.state.f_s;
                    for (var s in filterStatus) {
                        pm[s] == '0' ? filterStatus[s] = true : filterStatus[s] = !!pm[s];
                    }
                    for (var v in filtervisible) {
                        filtervisible[v] = false
                    }
                    this.setState({
                        f_s: filterStatus,
                        f_v: filtervisible
                    })
                    editInfoStore.fetchTableList();
                } else {
                    message.error('表格数据有更改，请先保存！')
                }
            }
        })
    }//搜索框搜索
    onChangeHandler = (value, dataIndex, index) => {
        if (dataIndex == 'planMode') value = value * 1;
        runInAction(() => {
            editInfoStore.dataSource[index][dataIndex] = value;
            editInfoStore.isChanged = true
        })
    }//表格编辑
    handleChange = (pagination, filters, sorter) => {
        let { pages } = editInfoStore,
            isPageChange = (pagination.page != pages.page || pagination.pageSize != pages.pageSize);
        if (!isPageChange) {
            let pm = {}
            for (var i in filters) {
                if (filters[i] || filters[i][0] == '0') {
                    pm[i] = filters[i][0] * 1;
                }
            }
            editInfoStore.setSearchPm(pm);
            this.onSearch()
        } else { }
    }//下拉搜索传递参数
    dateRangeHandler = (date, dateString) => {
        let dateParams = {};
        dateParams.preReceiveDateStart = dateString[0];
        dateParams.preReceiveDateEnd = dateString[1];
        if (dateString[0] && dateString[1]) {
            this.setState({ dateParams })
        } else {
            editInfoStore.setSearchPm(params);
            this.onSearch()
        }
    }//日期搜索传递参数
    datePickerShow = () => {
        runInAction(() => {
            editDatePickerDialog.visible = true;
        })
        this.setState({
            f_v: Object.assign({}, this.state.f_v, { preReceiveDateStart: false, preReceiveDateEnd: false }),
        })
    }//批量搜索日期弹框展示
    datePickerHandleSubmit = () => {
        runInAction(() => editDatePickerDialog.loading = true)
        let { dataSource } = editInfoStore;
        let dataList = dataSource;
        this.props.form.resetFields();
        if (dataList.length > 0) {
            dataList.map(item => {
                if (item.submitStatus == 1) {
                    item.predictReceiveDate = editDatePickerDialog.dateVal;
                }
            })
            runInAction(() => {
                editInfoStore.isChanged = true
            })
        }
        runInAction(() => {
            editInfoStore.loading = true;
            editInfoStore.dataSource = dataList;
        })
        this.datePickerHandleCancel()
    }//日期弹框确定
    datePickerHandleCancel = () => {
        runInAction(() => {
            editInfoStore.loading = editDatePickerDialog.loading = editDatePickerDialog.visible = false;
        })
    }
    componentWillUnmount() {
        let pm = editInfoStore.searchPm;
        pm.materialPlanAttribute ? delete pm.materialPlanAttribute : null;
        pm.planMode ? delete pm.planMode : null;
        pm.submitStatus ? delete pm.submitStatus : null;
        for (var i in pm) {
            pm[i] = ''
        }
        runInAction(() => {
            editInfoStore.isChanged = false
        })
    }
    confirmPageChange = () => {
        // 确定不保存 修改和选择的数据， 离开当前页面
        editInfoStore.pageChangeHandle();
        this.cancelPageChange()
    }
    cancelPageChange = () => {
        confirmSaveStore.visible = false;
    }
    render() {
        let { getFieldDecorator } = this.props.form;
        let { filteredInfo } = this.state;
        filteredInfo = filteredInfo || {};
        let filterPlanWay = [
            { text: '标准采购', value: 1 },
            { text: '外协采购', value: 2 },
            { text: '外协加工', value: 3 },
            { text: '自制生产', value: 4 },
            { text: '无需求', value: 5 },
        ];
        let filterlAttributes = [
            { text: '外购件', value: 0 },
            { text: '自制件', value: 1 },
            { text: '外协件', value: 2 },
        ]
        let columns = [
            {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                fixed: 'left',
                width: 92,
                obj: {
                    render: {
                        wid: 84
                    }
                },
                filterDropdown: (
                    <div className="custom-filter-dropdown width-style">
                        <Form.Item>
                            {getFieldDecorator('materialName')(
                                <Input
                                    ref={ele => this.material_name = ele}
                                    onPressEnter={() => this.onSearch('materialName')}
                                />
                            )}
                        </Form.Item>
                        <Button type="primary" onClick={() => this.onSearch('materialName')}>搜索</Button>
                    </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.materialName ? '#108ee9' : '#aaa' }} />,
                filterDropdownVisible: this.state.f_v.materialName,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        f_v: Object.assign({}, this.state.f_v, { materialName: visible })
                    }, () => this.material_name.focus());
                }
            }, {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'materialCode',
                className: 'pl-materialCode',
                filterDropdown: (
                    <div className="custom-filter-dropdown width-style">
                        <Form.Item>
                            {getFieldDecorator('materialCode')(
                                <Input
                                    ref={ele => this.material_code = ele}
                                    onPressEnter={() => this.onSearch('materialCode')}
                                />
                            )}
                        </Form.Item>
                        <Button type="primary" onClick={() => this.onSearch('materialCode')}>搜索</Button>
                    </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.materialCode ? '#108ee9' : '#aaa' }} />,
                filterDropdownVisible: this.state.f_v.materialCode,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        f_v: Object.assign({}, this.state.f_v, { materialCode: visible })
                    }, () => this.material_code.focus());
                }
            }, {
                title: '物料分类',
                dataIndex: 'materialCategory',
                key: 'materialCategory',
                filterDropdown: (
                    <div className="custom-filter-dropdown width-style">
                        <Form.Item>
                            {getFieldDecorator('materialCategory', {
                            })(
                                <Input
                                    ref={ele => this.material_category = ele}
                                    onPressEnter={() => this.onSearch('materialCategory')}
                                />
                                )}
                        </Form.Item>
                        <Button type="primary" onClick={() => this.onSearch('materialCategory')}>搜索</Button>
                    </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.materialCategory ? '#108ee9' : '#aaa' }} />,
                filterDropdownVisible: this.state.f_v.materialCategory,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        f_v: Object.assign({}, this.state.f_v, { materialCategory: visible })
                    }, () => this.material_category.focus());
                }
            }, {
                title: '计划属性',
                dataIndex: 'materialPlanAttribute',
                key: 'materialPlanAttribute',
                className: 'edit-plan-submitStatus',
                filters: filterlAttributes,
                filterMultiple: false,
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.materialPlanAttribute ? '#108ee9' : '#aaa' }} />,
                obj: {
                    render: {
                        wid: 88
                    },
                    enumCode: "materialPlanAttribute"
                }
            }, {
                title: '代号',
                dataIndex: 'materialSymbol',
                key: 'materialSymbol',
                filterDropdown: (
                    <div className="custom-filter-dropdown width-style">
                        <Form.Item>
                            {getFieldDecorator('materialSymbol', {
                            })(
                                <Input
                                    ref={ele => this.material_symbol = ele}
                                    onPressEnter={() => this.onSearch('materialSymbol')}
                                />
                                )}
                        </Form.Item>
                        <Button type="primary" onClick={() => this.onSearch('materialSymbol')}>搜索</Button>
                    </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.materialSymbol ? '#108ee9' : '#aaa' }} />,
                filterDropdownVisible: this.state.f_v.materialSymbol,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        f_v: Object.assign({}, this.state.f_v, { materialSymbol: visible })
                    }, () => this.material_symbol.focus());
                },
                obj: {
                    render: {
                        wid: 88
                    }
                }
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                filterDropdown: (
                    <div className="custom-filter-dropdown width-style">
                        <Form.Item>
                            {getFieldDecorator('materialSpec', {
                            })(
                                <Input
                                    ref={ele => this.material_spec = ele}
                                    onPressEnter={() => this.onSearch('materialSpec')}
                                />
                                )}
                        </Form.Item>
                        <Button type="primary" onClick={() => this.onSearch('materialSpec')}>搜索</Button>
                    </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.materialSpec ? '#108ee9' : '#aaa' }} />,
                filterDropdownVisible: this.state.f_v.materialSpec,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        f_v: Object.assign({}, this.state.f_v, { materialSpec: visible })
                    }, () => this.material_spec.focus());
                },
                obj: {
                    render: {
                        wid: 88
                    }
                }
            }, {
                title: '材料',
                dataIndex: 'materialTexture',
                key: 'materialTexture',
                filterDropdown: (
                    <div className="custom-filter-dropdown width-style">
                        <Form.Item>
                            {getFieldDecorator('materialTexture', {
                            })(
                                <Input
                                    ref={ele => this.material_texture = ele}
                                    onPressEnter={() => this.onSearch('materialTexture')}
                                />
                                )}
                        </Form.Item>
                        <Button type="primary" onClick={() => this.onSearch('materialTexture')}>搜索</Button>
                    </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.materialTexture ? '#108ee9' : '#aaa' }} />,
                filterDropdownVisible: this.state.f_v.materialTexture,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        f_v: Object.assign({}, this.state.f_v, { materialTexture: visible })
                    }, () => this.material_texture.focus());
                },
                obj: {
                    render: {
                        wid: 88
                    }
                }
            }, {
                title: '描述',
                dataIndex: 'materialDesc',
                key: 'materialDesc',
                filterDropdown: (
                    <div className="custom-filter-dropdown width-style">
                        <Form.Item>
                            {getFieldDecorator('materialDesc', {
                            })(
                                <Input
                                    ref={ele => this.material_desc = ele}
                                    onPressEnter={() => this.onSearch('materialDesc')}
                                />
                                )}
                        </Form.Item>
                        <Button type="primary" onClick={() => this.onSearch('materialDesc')}>搜索</Button>
                    </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.materialDesc ? '#108ee9' : '#aaa' }} />,
                filterDropdownVisible: this.state.f_v.materialDesc,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        f_v: Object.assign({}, this.state.f_v, { materialDesc: visible })
                    }, () => this.material_desc.focus());
                },
                obj: {
                    render: {
                        wid: 88
                    }
                }
            }, {
                title: '单位用量',
                dataIndex: 'unitQty',
                key: 'unitQty',
                obj: {
                    render: (txt) => {
                        txt = Number(txt).toFixed(4);
                        return txt
                    }
                },
            }, {
                title: '单位',
                dataIndex: 'unitName',
                key: 'unitName',
            }, {
                title: '提交状态',
                dataIndex: 'submitStatus',
                key: 'submitStatus',
                obj: {
                    render: (txt) => {
                        txt = txt == 1 ? '未提交' : '已提交'
                        return txt
                    }
                },
                filters: [
                    { text: '未提交', value: '1' },
                    { text: '已提交', value: '2' }
                ],
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.submitStatus ? '#108ee9' : '#aaa' }} />,
                className: 'edit-plan-submitStatus',
                filterMultiple: false,
            }, {
                title: '提交人',
                dataIndex: 'submitByName',
                key: 'submitByName',
            }, {
                title: '库存数量',
                dataIndex: 'invQty',
                key: 'invQty',
                obj: {
                    render: (txt) => {
                        txt = Number(txt).toFixed(4);
                        return txt
                    }
                },
            }, {
                title: '工单单号',
                dataIndex: 'productRequirCode',
                key: 'productRequirCode',
                width: 92,
                obj: {
                    render: {
                        wid: 88
                    }
                }
            }, {
                title: '计划方式',
                dataIndex: 'planMode',
                key: 'planMode',
                width: 98,
                fixed: 'right',
                className: 'edit-plan-submitStatus edit-plan-planMode',
                obj: {
                    selectStore: '',
                    onChange: (value, dataIndex, index) => this.onChangeHandler(value, dataIndex, index)
                },
                filters: filterPlanWay,
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.planMode ? '#108ee9' : '#aaa' }} />,
                filterMultiple: false,
            }, {
                title: '采购数量',
                dataIndex: 'qty',
                key: 'qty',
                width: 106,
                fixed: 'right',
                obj: {
                    onChange: (value, dataIndex, index) => this.onChangeHandler(value, dataIndex, index),
                    rules: [
                        { type: 'gtEqZero', label: '采购数量', decimal: 4 },
                    ],
                    render: (txt) => {
                        txt = Number(txt).toFixed(4);
                        return txt
                    }
                },
            }, {
                title: '预计到货日期',
                dataIndex: 'predictReceiveDate',
                key: 'predictReceiveDate',
                width: 117,
                fixed: 'right',
                obj: {
                    onChange: (value, dataIndex, index) => this.onChangeHandler(value, dataIndex, index),
                    datePickerWid: 104,
                    /*rules: [
                        { required: true, message: '必填！' },
                    ],*/
                },
                filterDropdown: (
                    <div className="custom-filter-dropdown" id="custom-filter-dropdown-predictReceiveDate">
                        <Form.Item>
                            {getFieldDecorator('predictReceiveDate', {
                            })(
                                <RangePicker
                                    showTime
                                    format="YYYY-MM-DD"
                                    size='large'
                                    ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
                                    onChange={this.dateRangeHandler}
                                    onOk={() => { editInfoStore.setSearchPm(this.state.dateParams); this.onSearch(); }}
                                    style={{ display: this.state.f_v.preReceiveDateEnd ? 'block' : 'none' }}
                                    getCalendarContainer={() => {
                                        let dom = findDOMNode(this).getElementsByClassName('ant-dropdown-placement-bottomRight')[0];
                                        dom.parentNode.style.width = '250px';
                                        return dom
                                    }}
                                />
                                )}
                        </Form.Item>
                    </div>
                ),
                filterIcon: <span>
                    <Icon type="filter" style={{ color: this.state.f_s.preReceiveDateStart ? '#108ee9' : '#aaa' }} />
                    <Icon type="calendar" title='批量修改日期' onClick={() => this.datePickerShow()} />
                </span>,
                filterDropdownVisible: this.state.f_v.preReceiveDateStart,
                onFilterDropdownVisibleChange: (visible) => {
                    if (!editDatePickerDialog.visible) {
                        this.setState({
                            f_v: Object.assign({}, this.state.f_v, { preReceiveDateStart: visible, preReceiveDateEnd: visible })
                        });
                    }
                }
            }, {
                title: '计划工时(小时)',
                dataIndex: 'predictWorkhours',
                key: 'predictWorkhours',
                width: 104,
                fixed: 'right',
                obj: {
                    onChange: (value, dataIndex, index) => this.onChangeHandler(value, dataIndex, index),
                    rules: [
                        { type: 'gtEqZero', label: '计划工时', decimal: 2 },
                    ],
                    render: (txt) => {
                        txt = Number(txt).toFixed(2);
                        return txt
                    },
                },
            }
        ];
        columns.forEach((item) => {
            if (this.props.disableds.includes(item.dataIndex)) {
                item.render = this.textColRender(item.dataIndex, item.obj);
            } else if (this.props.inputCell.includes(item.dataIndex)) {
                item.render = this.inputColRender(item.dataIndex, item.obj);
            } else if (this.props.selectCell.includes(item.dataIndex)) {
                item.render = this.selectColRender(item.dataIndex, item.obj);
            } else if (this.props.datePickerCell.includes(item.dataIndex)) {
                item.render = this.datePickerColRender(item.dataIndex, item.obj);
            } else {
                item.render = this.textColRender(item.dataIndex, item.obj);
            }
        });
        columns[columns.length - 8].render = (text, record, index) => {
            return text == 1 ? "未提交" : "已提交"
        };
        return (
            <Form>
                <Table
                    {...this.props}
                    columns={columns}
                    onChange={this.handleChange}
                    selectedRowKeys={editInfoStore.selectedRowKeys.slice()}
                    scroll={{ x: 1800 }}
                />
                <DatePickerDialog
                    store={editDatePickerDialog}
                    handleSubmit={() => this.datePickerHandleSubmit()}
                    handleCancel={() => this.datePickerHandleCancel()}
                />
                <ConfirmDialog 
                    store={confirmSaveStore}
                    visible={confirmSaveStore.visible}
                    handleSubmit={() => this.confirmPageChange()}
                    handleCancel={() => this.cancelPageChange()}
                />
            </Form>
        )
    }
}
let options = {
    onValuesChange(props, values) {
        // props.setEditingRecord(values)
    }
}

let PlanTableEditComp = Form.create(options)(PlanTableEdit);
class ConfirmDialog extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = this.props.store;
    }
    getComp = () => {
        return <div>
            离开当前页，修改的数据或勾选的数据将丢失，是否要离开？
        </div>
    }
}
class DatePickerCell extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: props.value,
        }
    }
    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState({ value });
        }
    }

    handleChange = (dates, value) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }
    };

    render() {
        let { value } = this.state;
        return <DatePicker
            style={{ width: 100 }}
            format="YYYY-MM-DD"
            {...this.props}
            value={value ? moment(value) : null}
            onChange={this.handleChange}
        />;
    }
}
class TextCell extends Component {
    render() {
        let { value, enumCode, selectStore, isTrue, textStyle } = this.props;
        if (enumCode) {
            value = enumStore.getEnum(enumCode, value);
        } else if (selectStore) {
            value = selectStore.getLabelName(value);
        }
        if (isTrue != undefined) return <Radio checked={isTrue == value ? true : false} disabled style={textStyle} />
        else return <div style={textStyle}>{value}</div>
    }
}
class DatePickerDialog extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = this.props.store;
    }
    dateRangeHandler = (date, dateString) => {
        this.store.dateVal = dateString;
    }
    getComp = () => {
        return <div className='planDistribution-datepicker-dialog'>
            <Row>
                <Col span={7}>
                    选择时间：
                </Col>
                <Col span={8}>
                    <DatePicker
                        showTime
                        onChange={this.dateRangeHandler}
                        width='200px'
                    />
                </Col>
            </Row>
        </div>
    }
}
export default PlanTableEditComp
export { PlanTableEditComp }
