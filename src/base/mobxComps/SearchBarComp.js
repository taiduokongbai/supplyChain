import React, { Component, PropTypes } from 'react';
import { Select, Input, Button, DatePicker, Spin } from '../components/AntdComp';
import moment from "moment";
const { RangePicker } = DatePicker;
const Option = Select.Option;

let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
let defaultIcon = {
    '查询': 'c2mfont c2m-search1',
    '新建': 'c2mfont c2m-jia',
    '导入': 'c2mfont c2m-daoru_nor',
    '导出': 'c2mfont c2m-daochu',
}
@observer
class LeftComp extends Component {
    componentWillMount() {
        let item = this.props.data.select.list[0];
        this.props.store.setSearchKey(item.key, item);
        if (item.defaultValue != undefined) {
            this.props.store.setSearchVal(item.defaultValue);
        }
    }
    getSearchComp = () => {
        let item = this.props.store.item || {};
        let value = this.props.store.searchVal;
        switch (item.type) {
            case "string":
                return <Input
                    value={value}
                    placeholder={`请输入${item.label}`}
                    style={{ ...localStyle.input, ...item.style }}
                    onChange={this.onChange}
                    onPressEnter={this.onSearch}
                />
            case "select":
                return <Select
                    size='large'
                    value={String(value)}
                    style={{ ...localStyle.input, ...item.style }}
                    onChange={this.onSelectChange}
                >
                    {item.store.options}
                </Select>
            case "enumSelect":
                return <Select
                    size='large'
                    value={String(value)}
                    style={{ ...localStyle.input, ...item.style }}
                    onChange={this.onSelectChange}
                >
                    {this.props.store.enumStore.getOptions(item.enumCode)}
                </Select>
            case "dateRange":
                return <RangePicker
                    {...item}
                    size='large'
                    value={(value || []).map(d => moment(d))}
                    format={item.format || "YYYY-MM-DD"}
                    style={{ ...localStyle.range, ...item.style }}
                    onChange={this.onPickerChange}
                />
            default:
                return <span></span>;
        }
    }

    onChange = (e) => this.props.store.setSearchVal(e.target.value);
    onSelectChange = (value) => this.props.store.setSearchVal(value);
    onPickerChange = (date, dateString) => {
        if (dateString[0] == '' && dateString[1] == '') {
            this.props.store.setSearchVal('');
        }
        else this.props.store.setSearchVal(dateString);
    }
    onSelect = (value, option) => {
        let item = option.props.data;
        this.props.store.setSearchKey(value, item);
        if (item.defaultValue != undefined) {
            this.props.store.setSearchVal(item.defaultValue);
        }
    }
    onSearch = () => {
        let { data } = this.props;
        let { fn } = data.button;
        if (fn) {
            fn();
        };
    }

    render() {
        let { data, ...props } = this.props;
        let list = data.select && data.select.list || [];
        let button = data.button;
        let icon = button.icon || defaultIcon[button.label];
        let value = this.props.store.searchKey;
        let loading = this.props.store.loading;
        return (
            <div className="base-search-bar-left">
                {
                    list && <Select
                        size='large'
                        value={value}
                        onSelect={this.onSelect}
                        style={{
                            ...localStyle.select,
                            ...data.select.style
                        }}>
                        {
                            (Array.isArray(list) && list.length > 0) ?
                                list.map(i => {
                                    return <Option
                                        key={i.key}
                                        value={i.key}
                                        data={i}
                                    >
                                        {i.label}
                                    </Option>
                                })
                                : <Option key=''></Option>
                        }
                    </Select>
                }
                {this.getSearchComp(this.props.store.item)}
                {button ? <Button
                    type={button.type || "default"}
                    style={{
                        ...localStyle.button,
                        ...button.style
                    }}
                    onClick={button.fn}
                    loading={loading}
                >
                    {icon ? <i className={icon} style={localStyle.icon} /> : null}
                    {button.label}
                </Button> : null
                }
            </div>
        )
    }
}

@observer
class RightComp extends Component {
    render() {
        let { data, ...props } = this.props;
        return (
            <div className="base-search-bar-right">
                {
                    Array.isArray(data) ?
                        data.map((item, index) => {
                            if (item.type == 'button') {
                                let icon = item.icon || defaultIcon[item.label];
                                return <Button
                                    key={index}
                                    type={item.type || "default"}
                                    onClick={item.fn}
                                    style={{
                                        ...localStyle.button,
                                        ...item.style
                                    }}
                                >
                                    {icon ? <i className={icon} style={localStyle.icon} /> : null}
                                    {item.label}
                                </Button>
                            }
                        }) : null
                }
            </div>
        )
    }
}

@observer
export default class SearchBarComp extends Component {
    render() {
        let { comps, style, ...props } = this.props;
        return (
            <div className="base-search-bar"
                style={{
                    ...localStyle.cont,
                    ...style,
                }}
            >
                <LeftComp data={comps.left} {...props } />
                <RightComp data={comps.right}  {...props } />
            </div>
        )
    }
}


let localStyle = {
    cont: {
        lineHeight: "68px",
        borderBottom: "2px solid #e5e8ec",
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    select: {
        width: 200,
        marginTop: 20,
        marginRight: 20,
    },
    input: {
        width: 200,
        marginTop: 20,
        height: 32
    },
    range: {
        width: 200,
    },
    button: {
        marginLeft: 10,
        color: "#fff",
        backgroundColor: "#6d8ec1",
        borderColor: "#6d8ec1",
        height: 32,
        color: 'rgb(251, 252, 253)',
        backgroundColor: 'rgb(76, 128, 207)',
        border: 'none',
    },
    icon: {
        paddingRight: '7px',
        fontSize: '10px'
    }
};

// Example

// this.searchComps = {
//     left: {
//         select: {
//             style: {},
//             list: [
//                 {
//                     key: "orderCode",
//                     label: "订单编号",
//                     type: "string",
//                     defaultValue: '订单编号'
//                 },
//                 {
//                     key: "orderStatus",
//                     label: "单据状态",
//                     type: "enumSelect",
//                     enumCode: "purchaseOrderStatus",
//                     style: { width: 200 },
//                     defaultValue: 0
//                 },
//                 {
//                     key: "orderStatus",
//                     label: "类型",
//                     type: "select",
//                     store: selectStore,
//                     style: { width: 200 },
//                     defaultValue: 0
//                 },
//                 {
//                     key: "orderDate",
//                     label: "订单日期",
//                     type: "dateRange"
//                 },
//                 {
//                     key: "pldDate",
//                     label: "计划收货日期",
//                     defaultValue: ['2011-01-02'],
//                     type: "dateRange"
//                 },
//                 {
//                     key: "siteName",
//                     label: "收货站点",
//                     type: "string"
//                 }
//             ]
//         },
//         button: {
//             label: "查询",
//             fn: this.onSearch,
//             className: "",
//             style: {},
//         }
//     },
//     right: [{
//         type: "button",
//         label: "新建",
//         fn: this.onAdd,
//         className: "",
//         style: {},
//     }, {
//         type: "button",
//         label: "导出",
//         fn: null,
//         url: '',
//         style: {}
//     }]
// }