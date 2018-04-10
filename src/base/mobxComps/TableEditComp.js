import React, { Component, PropTypes } from "react";
import { InputNumber, AutoComplete, Table, Input, Radio, Select, Form, DatePicker, message } from '../components/AntdComp';
import moment from 'moment';
import TooltipComp from './TooltipComp';
import OperationsComp from './OperationsComp';
import FormComp from './FormComp';
import { enumStore } from '../../base/stores/EnumStore';
const FormItem = Form.Item;

let { runInAction } = mobx;
let { observer } = mobxReact;


@observer
class TableEditComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.columns = props.columns;
        this.columns.forEach((item) => {
            if (props.disableds.includes(item.dataIndex)) {
                item.render = this.textColRender(item.dataIndex, item.obj);
            } else if (props.inputCell.includes(item.dataIndex)) {
                item.render = this.inputColRender(item.dataIndex, item.obj);
            } else if (props.inputNumberCell.includes(item.dataIndex)) {
                item.render = this.inputNumberColRender(item.dataIndex, item.obj);
            } else if (props.selectCell.includes(item.dataIndex)) {
                item.render = this.selectColRender(item.dataIndex, item.obj);
            } else if (props.autoCompleteCell.includes(item.dataIndex)) {
                item.render = this.autoCompleteColRender(item.dataIndex, item.obj);
            } else if (props.radioCell.includes(item.dataIndex)) {
                item.render = this.radioColRender(item.dataIndex, item.obj);
            } else if (props.datePickerCell.includes(item.dataIndex)) {
                item.render = this.datePickerColRender(item.dataIndex, item.obj);
            } else {
                item.render = item.render || this.textColRender(item.dataIndex, item.obj);
            }

        });
        this.columns[this.columns.length - 1].render = this.optColRender;
    }

    //默认使用文本列
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
        } else if (isTrue){
            return <Radio checked={isTrue == text ? true : false} disabled style={textStyle}/>
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

    //输入框类型的列使用的Render
    inputColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, render, onChange, ...inputProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let changeEvent = (e) => {
                if (onChange) {
                    let value = e.target.value;
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex, {
                            initialValue: editingRecord[dataIndex],
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
                return <TooltipComp attr={{ text: text,  ...render }} />
            }
            if (typeof render == 'function') {
                return render(text, record, index);
            }
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }

    //数值输入框类型的列使用的Render
    inputNumberColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, render, onChange, ...inputProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex, {
                            initialValue: editingRecord[dataIndex],
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <InputNumber
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
    
    //下拉列表类型的列使用的Render
    selectColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, selectStore, enumCode, onChange, ...selectProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex, {
                            initialValue: String(editingRecord[dataIndex]),
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <Select
                                style={{ width: 100 }}
                                {...selectProps}
                            >
                            {
                                enumCode ?
                                    enumStore.getOptions(enumCode)
                                    : (selectStore && selectStore.options)
                            }
                            </Select>
                            )}
                    </FormItem>
                </div>
            )
        } else {
            text = enumCode ? enumStore.getEnum(enumCode, text) : selectStore.getLabelName(text);
            return <div style={textStyle}>{text}</div>
        }
    }

    //自动搜索列表类型的列使用的Render
    autoCompleteColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, autoCompStore, keyName, onSelect, ...selectProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let selectEvent = (value, option) => {
                if (onSelect) {
                    let data = option.props.data;
                    this.setFdv(onSelect(data))
                };
            }
            let searchEvent = (value) => {
                autoCompStore.loading = true;
                return autoCompStore.fetchSelectList(value).then(json => {
                    this.forceUpdate();
                    return json;
                });
            }
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex, {
                            initialValue: editingRecord[dataIndex],
                            rules: [
                                {
                                    type: "autoselect",
                                    list: autoCompStore.selectList.slice(),
                                    keyName,
                                    message: "请从下拉列表中选择一项！",
                                },
                                ...(rules || [])
                            ]
                        })(
                            <AutoComplete
                                {...autoCompStore.Props}
                                {...selectProps}
                                onSelect={selectEvent}
                                onSearch={searchEvent}
                            />
                        )}
                    </FormItem>
                </div>
            )
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }

    //Radio类型的列使用的Render
    radioColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, onChange, ...radioProps } = obj;
        let {editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex, {
                            initialValue: editingRecord[dataIndex],
                            rules: rules || [],
                            onChange: changeEvent,
                        })(
                            <RadioCell 
                                {...radioProps}
                            />
                            )}
                    </FormItem>
                </div>
                )
        } else {
            return <Radio checked={obj.isTrue == text ? true : false} disabled style={textStyle}/>;
        }
    }
    //DatePicker日期选择框的列使用的Render
    datePickerColRender = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, render, onChange, ...dateProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        if (show) {
            let changeEvent = (value) => {
                if (onChange) {
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD(dataIndex, {
                            initialValue: editingRecord[dataIndex],
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
    //操作列使用的Render
    optColRender = (txt, record, index) => {
        let { editingRecord, editingIndex, recordKey, disableds,
            handleSave, onCancel, onEdit, onDelete
        } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        let opts = [
            {
                title: '确定',
                fun: () => this.validateFds((err, data) => {
                    if (!err) {
                        handleSave();
                    }
                }),
                show,
            },
            {
                title: '取消',
                fun: () => onCancel(),
                show,
            },
            {
                title: '编辑',
                fun: () => onEdit(record, index),
                show: editingIndex == null,
            },
            {
                title: "删除",
                titleText: ['确认要删除该明细项吗？'],
                fun: () => onDelete(index),
                show: editingIndex == null,
            },
        ];
        return <OperationsComp operations={opts} />;
    }

    render() {
        return (
            <Form className="formInTable">
                <Table
                    {...this.props}
                    columns = {this.columns}
                />
            </Form>
        );
    }
}

const options = {
    onValuesChange(props, values) {
        props.setEditingRecord(values)
    }
}
export default Form.create(options)(TableEditComp);
export { TableEditComp }


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
class RadioCell extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: this.changeData(props.value),
        }
    }
    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = this.changeData(nextProps.value);
            this.setState({ value });
        }
    }

    handleChange = (e) => {
        let { isTrue, isFalse } = this.props;
        const value = e.target.value == true ? isFalse : isTrue;

        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }
    };

    changeData = (value) => this.props.isTrue == value ? true : false

    render() {
        let { value } = this.state;
        return <Radio
            {...this.props}
            checked={value}
            value={value}
            onChange={e => this.handleChange(e)}
        />;
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
