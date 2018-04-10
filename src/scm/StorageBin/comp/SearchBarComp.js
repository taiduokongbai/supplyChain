import React, { Component, PropTypes } from 'react';
import { Select, Input, Button, DatePicker,Spin } from '../../../base/components/AntdComp';
import moment from "moment";
const { RangePicker } = DatePicker;
const Option = Select.Option;

let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

let defaultIcon = {
    '查询':'c2mfont c2m-search1',
    '新建':'c2mfont c2m-jia',
    '导入':'c2mfont c2m-daoru_nor',
    '导出':'c2mfont c2m-daochu',
};

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
                    style={{ ...localStyle.left.input, ...item.style }}
                    onChange={this.onChange}
                />
            case "enumSelect":
                return <Select
                    value={String(value)}
                    style={{ ...localStyle.left.input, ...item.style }}
                    onChange={this.onSelectChange}
                >
                    {this.props.store.enumStore.getOptions(item.enumCode)}    
                </Select>    
            case "dateRange":   
                return <RangePicker
                    {...item}
                    value={(value || []).map(d => moment(d))}
                    format="YYYY-MM-DD"
                    style={{ ...localStyle.left.range, ...item.style }}
                    onChange={this.onPickerChange}
                />
            default:
                return <span></span>;
        }
    }

    onChange = (e) => this.props.store.setSearchVal(e.target.value);
    onSelectChange = (value) => this.props.store.setSearchVal(value);
    onPickerChange = (date, dateString) => this.props.store.setSearchVal(dateString);
    onSelect = (value, option) => {
        let item = option.props.data;
        this.props.store.setSearchKey(value, item);
        if (item.defaultValue != undefined) {
            this.props.store.setSearchVal(item.defaultValue);
        }
    }

    
    render() {
        let { data, ...props } = this.props;
        let list = data.select && data.select.list || [];
        let button = data.button;
        let value = this.props.store.searchKey;
        let loading = this.props.store.loading;
        return (
            <div className="base-search-bar-left">
                {
                    list && <Select
                        value={value}
                        onSelect={this.onSelect}
                        style={{
                            ...localStyle.left.select,
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
                    {button? <Button
                        type={button.type||"default"}
                        style={{
                            ...localStyle.left.button,
                            ...button.style
                        }}
                        onClick={button.fn}
                        loading={loading}
                    >
                        {defaultIcon[button.label] ? <i className={defaultIcon[button.label]} style={{ paddingRight: '7px', fontSize: '10px' }} /> : null}
                    {button.label}
                    </Button>:null
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
                                return <Button
                                    key={index}
                                    type={item.type || "default"}
                                    onClick={item.fn}
                                    style={{
                                        ...localStyle.right,
                                        ...item.style
                                    }}
                                >
                                    {defaultIcon[item.label] ? <i className={defaultIcon[item.label]} style={{ paddingRight: '7px', fontSize: '10px' }} /> : null}
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
                <RightComp data={comps.right}  {...props }/>
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
    left: {
        input: { width: 220, marginTop: '20px' },
        range: { width: 220 },
        select: {
            width: '160px',
            margin: '20px 20px 0px 20px',
        },
        button: {
            margin: "0 20px",
            color: "#fff",
            backgroundColor: "#4C80CF",
            borderColor: "#4C80CF",
        }
    },
    right: {
        margin: "0 20px",
        color: "#fff",
        backgroundColor: "#4C80CF",
        borderColor: "#4C80CF",
    }
};