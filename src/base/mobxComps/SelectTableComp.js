import React, { Component, PropTypes } from "react";
import { Button, Icon, Table } from "../components/AntdComp";
import SearchBarComp from './SearchBarComp';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class SelectTableComp extends Component {
    @observable show = false;
    onShow = () => {
        if (!this.show) {
            this.props.store.onSelectChange([this.props.value]);
        }
        this.show = !this.show;
    };

    componentDidMount() {
        this.props.store.pageOnChange(1);
    }
    onSubmit = () => {
        let { handleSubmit, valueKey, rowKey } = this.props;
        let selectedRows = this.props.store.selectedRows.slice();
        let value = selectedRows[0] && selectedRows[0][valueKey || rowKey];
        this.props.onChange && this.props.onChange(value);
        this.props.onSubmit && this.props.onSubmit(selectedRows[0]);
        this.onShow();
    }
    onChange = (keys, rows) => {
        this.props.store.onSelectChange(keys, rows);
    }
    getCheckboxProps = (record) => ({
        disabled: this.props.store.excepts.slice().includes(record[this.props.rowKey]),
    })
    render() {
        let {
            value,
            style,
            contStyle,
            columns,
            searchText,
            subText,
            tableProps,
            btnProps,
            comps,
            type,
            rowKey
        } = this.props;
        let iconType = this.show ? 'up' : 'down';
        return (
            <div className="select-table-comp">
                <div style={{ position: 'relative' }} className="stc-btn-wrap">
                    <Button
                        className="ant-input ant-input-lg"
                        onClick={this.onShow}
                        style={{ width: '200px', height: '30px', display: 'flex', justifyContent: 'space-between', ...style }}
                        {...btnProps}
                    >
                        <span>{value}</span>
                        <Icon type={iconType} style={{ lineHeight: '20px', fontSize: '8px' }} />
                    </Button>
                </div>
                {
                    this.show ?
                        <div style={{
                            position: 'absolute',
                            zIndex: '1',
                            backgroundColor: '#fff',
                            width: '660px',
                            boxShadow: '0 1px 11px 0 rgba(150,149,149,0.50)',
                            borderRadius: '4px',
                            marginTop: '2px',
                            ...contStyle
                        }}
                            className="stc-table-wrap"
                        >
                            {
                                comps ? <SearchBarComp
                                    comps={comps}
                                    store={this.props.store.searchBarStore}
                                    style={{ borderBottom: '0', marginLeft: '20px' }}
                                /> : <div style={{ paddingBottom: '20px' }}></div>
                            }
                            <Table
                                {...this.props.store.Props}
                                columns={columns}
                                rowKey={rowKey}
                                style={{ padding: '0 20px' }}
                                rowSelection={{
                                    type: type || 'radio',
                                    onChange: this.onChange,
                                    getCheckboxProps: this.getCheckboxProps,
                                }}
                            />
                            <div style={{ padding: '0px 20px 20px', height: '48px' }} className="stc-btn">
                                <Button type="primary" style={{ float: 'right' }} onClick={this.onSubmit}>{subText}</Button>
                            </div>
                        </div>
                        : null
                }
            </div>
        );
    }
}

SelectTableComp.defaultProps = {
    searchText: '查询',
    subText: '确定',
    rowKey: 'name',
    columns: [],
}