/**
 * 计划分配 可编辑表格
 */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Table, Button, Input, Popconfirm, message, Form, Row, Col, Icon, DatePicker, Select, Menu, Dropdown, } from '../../../base/components/AntdComp';
import { _add_PlanDispatch_Store, _pdEditTableStore, _saleOrderListStore, _datePickerDialogStore, _confirmStore } from "../store/AddPlanDispatchStore";
import { TableEditComp } from '../../../base/mobxComps/TableEditComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import SaleOrderListComp from "./SaleOrderListComp";
import Validate from "../../../base/consts/ValidateList";
import ModalComp from '../../../base/mobxComps/ModalComp';
import FormComp from '../../../base/mobxComps/FormComp';
import { enumStore } from '../../../base/stores/EnumStore';
import moment from 'moment';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class PDEditTable extends FormComp {
    constructor(props) {
        super(props);
        _pdEditTableStore.thisComp = this;
        this.state = {
            f_s: {  // filter status
                materialCode: false,
                materialCategory: false,     // 物料分类
                materialPlanAttribute: false,   // 计划属性
                materialSymbol: false,     // 物料代号
                materialName: false,       // 物料名称
                materialSpec: false,       // 物料规格
                materialTexture: false,    // 材料
                materialDesc: false,        // 描述
                planMode: false,         // 计划方式
                preReceiveDateStart: false,  // 预计到货日期
                preReceiveDateEnd: false,
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
                preReceiveDateStart: false,  // 预计到货日期
                preReceiveDateEnd: false,
                submitStatus: false,      // 提交状态
            },
            filteredInfo: null,      // 计划方式 过滤
            params: {},
        }
    };

    inputColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, render, onChange, inputWid, ...inputProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = dataIndex == 'qty' ? record.submitStatus == 1 : (dataIndex == 'predictWorkhours' ? record.planMode == '4' && record.submitStatus == 1 : false)
        if (show) {
            let changeEvent = (e) => {
                if (onChange) {
                    let value = e.target.value;
                    onChange(value, dataIndex, index, record.materialCode)
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex + '_' + record.id, {
                            initialValue: dataIndex == 'predictWorkhours' ? Number(record[dataIndex]).toFixed(2) : Number(record[dataIndex]).toFixed(4),
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <Input
                                style={{ width: inputWid }}
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
        let { textStyle, rules, render, onChange, datePickerWid, ...dateProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = record.submitStatus == 1;
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    onChange(value, dataIndex, index, record.materialCode)
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex + '_' + record.id, {
                            initialValue: record[dataIndex],
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <DatePickerCell
                                style={{ width: datePickerWid }}
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
        let { textStyle, rules, selectStore, enumCode, onChange, selectWid, ...selectProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = record.submitStatus == 1;
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    onChange(value, dataIndex, index, record.materialCode)
                    this.onChangeHandler(0.00, 'predictWorkhours', index, record.materialCode)
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex + '_' + record.id, {
                            initialValue: String(record[dataIndex]),
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <Select
                                style={{ width: selectWid }}
                                {...selectProps}
                            >
                                {
                                    window.ENUM.getEnum("planMode").map(planMode => {
                                        return <Select.Option value={planMode.catCode} key={planMode.catCode}>{planMode.catName}</Select.Option>
                                    })
                                }
                            </Select>
                            )}
                    </FormItem>
                </div>
            )
        } else {
            return <div style={textStyle}>{enumStore.getEnum('planMode', text + '')}</div>
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
        } else if (dataIndex == 'materialPlanAttribute') {
            return window.ENUM.getEnum("materialPlanAttribute", text + '')
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }
    onSearch = (dataIndex) => {
        const { searchPm, changedFlag, setSearchPm } = _pdEditTableStore;
        let params = { ...searchPm };
        /**
         * 将当前的筛选条件和原有的searchPm合并
         * 对表格筛选按钮的样式 更新
         * 确定没有更改数据情况下，发送请求
         */
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                for (var i in params) {
                    if (i == dataIndex) {
                        params[i] = values[dataIndex];
                    }
                }
                let pm = Object.assign({}, searchPm, params);
                if (!changedFlag) {
                    setSearchPm(pm);
                    let visible = this.state.f_v;
                    let filterStatus = this.state.f_s;
                    for (var s in filterStatus) {
                        pm[s] == '0' ? filterStatus[s] = true : filterStatus[s] = !!pm[s];
                    }
                    for (var v in visible) {
                        visible[v] = false
                    }
                    this.setState({ f_s: filterStatus, f_v: visible })
                    _pdEditTableStore.fetchTableList(pm).then(json => {
                        if (json.status === 2000) {
                            runInAction(() => {
                                _pdEditTableStore.changedFlag = false;
                            })
                        }
                    })
                } else {
                    message.info('表格数据有更改，请先保存！')
                }
            }
        });
    }
    onChangeHandler = (value, dataIndex, index, materialCode) => {
        if (dataIndex == 'planMode') {  // 计划方式
            value = value * 1;
        }
        runInAction(() => {
            _pdEditTableStore.dataSource[index][dataIndex] = value;
            _pdEditTableStore.changedFlag = true;
        })
    }
    handleChange = (pagination, filters, sorter) => {
        let { pages } = _pdEditTableStore, 
            isPageChange = (pagination.page != pages.page || pagination.pageSize != pages.pageSize);
        if (!isPageChange) {
            let pm = {};
            for (var i in filters) {
                if (filters[i] || filters[i][0] == '0') {
                    pm[i] = filters[i][0] * 1;
                }
            }
            _pdEditTableStore.setSearchPm(pm)
            this.onSearch()
        }else{  }
    }
    dateRangeHandler = (date, dateString) => {
        let params = {};
        params.preReceiveDateStart = dateString[0];
        params.preReceiveDateEnd = dateString[1];
        if (dateString[0] && dateString[1]) {
            this.setState({ params })
        } else {
            /**
             * 清空预计到货日期筛选条件
             */
            _pdEditTableStore.setSearchPm(params);
            this.onSearch()
        }
    }
    datePickerShow = () => {
        runInAction(() => {
            _datePickerDialogStore.visible = true;
        })
        this.setState({
            f_v: Object.assign({}, this.state.f_v, { preReceiveDateStart: false }),
        })
    }
    componentWillReceiveProps = (nextProps) => {
        /**
         * 当 再次点击固定/重新新建计划分配时，(当前版本固定后不能重新选择销售订单)
         * 计划分配表格的所有筛选条件样式初始化
         */
        if (_add_PlanDispatch_Store.fixedFlag || _add_PlanDispatch_Store.newCreateFlag) {
            let { f_s } = this.state;
            for (var i in f_s) {
                f_s[i] = false;
            }
            this.setState({ f_s: f_s })
        }
        _add_PlanDispatch_Store.fixedFlag = _add_PlanDispatch_Store.newCreateFlag = false;
    }
    confirmPageChange = () => {
        // 确定不保存 修改和选择的数据， 离开当前页面
        _pdEditTableStore.pageChangeHandle();
        this.cancelPageChange()
    }
    cancelPageChange = () => {
        _confirmStore.visible = false;
    }
    render() {
        const filter_options = [
            { text: '标准采购', value: 1 },
            { text: '外协采购', value: 2 },
            { text: '无需求', value: 5 },
            { text: '外协加工', value: 3 },
            { text: '自制生产', value: 4 },
        ];
        const filter_planAmount = [
            { text: '外购件', value: 0 },
            { text: '自制件', value: 1 },
            { text: '外协件', value: 2 },
        ]
        let { filteredInfo } = this.state;
        filteredInfo = filteredInfo || {};
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                fixed: 'left',
                width: 106,
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
                className: 'pd-table-materialCode',
                filterDropdown: (
                    <div className="custom-filter-dropdown width-style">
                        <Form.Item>
                            {getFieldDecorator('materialCode', {
                            })(
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
                filters: filter_planAmount,
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.materialPlanAttribute ? '#108ee9' : '#aaa' }} />,
                filterMultiple: false,
            }, {
                title: '代号',
                dataIndex: 'materialSymbol',
                key: 'materialSymbol',
                obj: {
                    render: {
                        wid: 88
                    }
                },
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
                }
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                obj: {
                    render: {
                        wid: 88
                    }
                },
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
                }
            }, {
                title: '材料',
                dataIndex: 'materialTexture',
                key: 'materialTexture',
                obj: {
                    render: {
                        wid: 88
                    }
                },
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
                }
            }, {
                title: '描述',
                dataIndex: 'materialDesc',
                key: 'materialDesc',
                obj: {
                    render: {
                        wid: 88
                    }
                },
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
                className: 'submitStatus',
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.submitStatus ? '#108ee9' : '#aaa' }} />,
                filterMultiple: false,
            }, {
                title: '计划方式',
                dataIndex: 'planMode',
                key: 'planMode',
                className: 'planMode',
                width: 98,
                fixed: 'right',
                obj: {
                    selectStore: '',
                    onChange: (value, dataIndex, index, materialCode) => this.onChangeHandler(value, dataIndex, index, materialCode),
                    selectWid: 88,
                },
                filters: filter_options,
                filterIcon: <Icon type="filter" style={{ color: this.state.f_s.planMode ? '#108ee9' : '#aaa' }} />,
                filterMultiple: false,
            }, {
                title: '采购数量',
                dataIndex: 'qty',
                key: 'qty',
                width: 106,
                fixed: 'right',
                obj: {
                    onChange: (value, dataIndex, index, materialCode) => this.onChangeHandler(value, dataIndex, index, materialCode),
                    rules: [
                        { type: 'gtEqZero', label: '采购数量', decimal: 4 },
                    ],
                    inputWid: 100,
                    render: (txt) => {
                        txt = Number(txt).toFixed(4);
                        return txt
                    }
                },
            }, {
                title: '预计到货日期',
                dataIndex: 'predictReceiveDate',
                key: 'predictReceiveDate',
                className: 'predictReceiveDate',
                width: 117,
                fixed: 'right',
                obj: {
                    onChange: (value, dataIndex, index, materialCode) => this.onChangeHandler(value, dataIndex, index, materialCode),
                    datePickerWid: 104,
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
                                    onOk={() => {
                                        _pdEditTableStore.setSearchPm(this.state.params);
                                        this.onSearch();
                                    }}
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
                    <Icon type="calendar" title='批量修改日期' style={{ color: this.state.f_s.unidiedTime ? '#108ee9' : '#aaa' }} onClick={() => this.datePickerShow()} />
                </span>,
                filterDropdownVisible: this.state.f_v.preReceiveDateStart,
                onFilterDropdownVisibleChange: (visible) => {
                    if (!_datePickerDialogStore.visible) {
                        this.setState({
                            f_v: Object.assign({}, this.state.f_v, { preReceiveDateStart: visible })
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
                    onChange: (value, dataIndex, index, materialCode) => this.onChangeHandler(value, dataIndex, index, materialCode),
                    rules: [
                        { type: 'gtEqZero', label: '计划工时', decimal: 2 },
                    ],
                    inputWid: 100,
                    render: (txt) => {
                        txt = Number(txt).toFixed(2);
                        return txt
                    }
                }
            }
        ]
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
        return (
            <div>
                <Form className="formInTable">
                    <Table
                        {...this.props}
                        columns={columns}
                        onChange={this.handleChange}
                        selectedRowKeys={_add_PlanDispatch_Store.selectedRowKeys.slice()}
                        scroll={{ x: 1800 }}
                    />
                </Form>
                <ConfirmDialog 
                    store={_confirmStore}
                    visible={_confirmStore.visible}
                    handleSubmit={() => this.confirmPageChange()}
                    handleCancel={() => this.cancelPageChange()}
                />
            </div>
        );
    }
}

let PDEditTableComp = PDEditTable;
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


export { PDEditTableComp }


