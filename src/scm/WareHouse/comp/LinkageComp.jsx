import React, { Component } from "react";
import { Select, Col, Spin } from '../../../base/components/AntdComp';
import { shouldComponentUpdate } from '../../../base/consts/Utils';
import { ReqApi } from '../../../base/services/ReqApi'
import AddressUrls from '../../../base/consts/AddressUrls';
import update from 'react/lib/update';
import MapComp from '../../../base/components/MapComp';
import Cascader from "antd/lib/cascader";   // AntdComp中没有
const Option = Select.Option;

class LinkageComp extends Component {
    constructor(prop) {
        super(prop);
        const value = this.props.value || {};
        this.state = {
            value: {
                countryCode: '',
                provinceCode: '',
                cityCode: '',
                countyCode: '',
                address: '',    // 国家  省市区名称
            },
            countrys: [],
            provinces: [],
            citys: [],
            countys: [],
            loading: true,
            options: [],   // cascader 
            inputValue: '',
        };

        this.countryName = '';
        this.provinceName = '';
        this.cityName = '';
        this.countyName = '';

        this.newState = {};   // for myself  存储newstate
        this.chooseVal = {}
    }

    initData = (value) => {
        let newState = update(this.state, { value: { $merge: value || {} } });  // 与 this.state 不同
        this.getCountrys(value, newState);
    }
    componentWillMount() {
        this.initData(this.props.value);   // const value
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && nextProps.value !== this.props.value) {
            // 合并 state.value
            let a = Object.assign({}, this.state.value, nextProps.value);
            this.setState({ value: a })
        }
    }

    getCountrys = (value, newState) => {
        if (this.state.countrys.length < 1) {   // 请求国家列表
            ReqApi.get({
                url: AddressUrls.COUNTRY_SELECTED,
                pm: {},
            }).then((json) => {
                if (json.status === 2000) {
                    json.data.list.map(item => {
                        item.label = item.countryName;
                        item.value = item.countryCode;
                        /*if (item.countryCode == 'CN') {
                            item.isLeaf = false;
                        } else {
                            item.isLeaf = true;
                        }*/
                        item.isLeaf = false;
                    })
                    this.setState({
                        options: json.data.list
                    })
                    this.newState = { ...newState, countrys: json.data.list };
                    return this.newState   // 把countries的list填充给state.countrys[]
                }
                return newState;
            })
        } else {
            // this.getProvinces(value, newState);
            console.log('country  length > 1 ')
        }
    }

    getProvinces = (targetOption = {}) => {
        let newState = this.newState;
        let { countryCode } = targetOption || {}//this.chooseVal || {};   // 获取国家编码
        if (countryCode && countryCode !== '') {  // 有国家code 的情况下  获取 对应的province code
            if (countryCode !== this.state.value.countryCode || newState.provinces.length < 1) {   // 确定只选中了一个国家
                targetOption.loading = true;
                ReqApi.get({
                    url: AddressUrls.PROVINCE_SELECTED,
                    pm: { countryCode }
                }).then((json) => {
                    if (json.status === 2000) {  // 获得省份列表
                        json.data.list.map(item => {
                            item.label = item.provinceName;
                            item.value = item.provinceCode;
                            item.isLeaf = false;
                        })
                        targetOption.loading = false;
                        targetOption.children = json.data.list;
                        this.setState({
                            options: [...this.state.options],
                        });
                        this.newState = { ...newState, countrys: json.data.list };
                        return this.newState;
                    }
                    return newState;
                })
            } else {
                // this.getCitys(value, newState);
            }
        } else {
            this.setState({ ...newState, loading: false });
        }
    }

    getCitys = (targetOption = {}) => {
        let newState = this.newState;
        let { provinceCode } = targetOption || {}//this.chooseVal || {};   // 获取省份编码
        if (provinceCode && provinceCode !== '') {
            if (provinceCode !== this.state.value.provinceCode || newState.citys.length < 1) {
                ReqApi.get({
                    url: AddressUrls.CITY_SELECTED,
                    pm: { provinceCode }
                }).then((json) => {
                    if (json.status === 2000) {
                        json.data.list.map(item => {
                            item.label = item.cityName;
                            item.value = item.cityCode;
                            item.isLeaf = false;
                        })
                        targetOption.loading = false;
                        targetOption.children = json.data.list;
                        this.setState({
                            options: [...this.state.options],
                        });
                        this.newState = { ...newState, countrys: json.data.list };
                        return this.newState;
                    }
                    return newState;
                })
            } else {
                // this.getCountys(value, newState);
            }
        } else {
            this.setState({ ...newState, loading: false });
        }
    }

    getCountys = (targetOption = {}) => {
        let newState = this.newState;
        let { cityCode } = targetOption || {}//this.chooseVal || {};
        if (cityCode && cityCode !== '') {
            if (cityCode !== this.state.value.cityCode || newState.countys.length < 1) {
                ReqApi.get({
                    url: AddressUrls.COUNTY_SELECTED,
                    pm: { cityCode }
                }).then((json) => {
                    if (json.status === 2000) {
                        json.data.list.map(item => {
                            item.label = item.countyName;
                            item.value = item.countyCode;
                            item.isLeaf = true;
                        })
                        targetOption.loading = false;
                        targetOption.children = json.data.list;
                        this.setState({
                            options: [...this.state.options],
                        });
                        this.newState = { ...newState, countys: json.data.list };
                        // return this.newState;
                    }
                    return newState;
                })
            } else {
                this.setState({ ...newState, loading: false });
            }
        } else {
            this.setState({ ...newState, loading: false });
        }
    }

    onChange = (value, selectedOptions) => {
        if (selectedOptions && selectedOptions.length > 0) {
            const targetOption = selectedOptions[selectedOptions.length - 1];
            let curChoose;
            if (targetOption.countyCode) {
                curChoose = { countyCode: targetOption.countyCode };
                this.changeStateValue(curChoose);
                return;
            } else if (targetOption.cityCode) {
                curChoose = { cityCode: targetOption.cityCode };
                this.changeStateValue(curChoose);
                return;
            } else if (targetOption.provinceCode) {
                curChoose = { provinceCode: targetOption.provinceCode };
                this.changeStateValue(curChoose);
                return;
            } else if (targetOption.countryCode) {
                curChoose = { countryCode: targetOption.countryCode };
                this.changeStateValue(curChoose);
                return;
            }
            this.chooseVal = curChoose;
        }
        // this.setState({
        //     inputValue: selectedOptions.map(o => o.label).join(', '),
        // });
    }

    changeStateValue = (value) => {
        const onChange = this.props.onChange;
        this.setState({ loading: true });
        if (onChange) {
            let address = this.countryName + this.provinceName;
            if (this.cityName != '') {
                address = this.cityName + this.countyName;
            }
            onChange(Object.assign({}, this.state.value, value, { address }));
        }
    }

    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        /*if (targetOption.countryCode && targetOption.countryCode != '') {
            this.countryName = targetOption.countryName;   // 选择省份
            this.getProvinces(targetOption)
        } else if (targetOption.provinceCode && targetOption.provinceCode != '') {
            this.provinceName = targetOption.provinceName;  // 选择城市
            this.getCitys(targetOption)
        } else if (targetOption.cityCode && targetOption.cityCode != '') {
            this.cityName = targetOption.cityName;         // 选择区
            this.getCountys(targetOption)
        } else if (targetOption.countyCode && targetOption.countyCode != '') {
            this.countyName = targetOption.countyName
        }*/
        if (targetOption.countyCode && targetOption.countyCode != '') {
            this.countyName = targetOption.countyName  
            return;
        } else if (targetOption.cityCode && targetOption.cityCode != '') {
            this.cityName = targetOption.cityName;         
            this.getCountys(targetOption);
            return;
        } else if (targetOption.provinceCode && targetOption.provinceCode != '') {
            this.provinceName = targetOption.provinceName; 
            this.getCitys(targetOption);
            return;
        } else if (targetOption.countryCode && targetOption.countryCode != '') {
            this.countryName = targetOption.countryName;  
            this.getProvinces(targetOption) 
            return;
        }
    }

    render() {
        let { value, countrys, provinces, citys, countys, loading } = this.state;
        return (
            <div>
                <Cascader
                    options={this.state.options}
                    loadData={this.loadData}
                    onChange={this.onChange}
                    changeOnSelect
                />
            </div>
        )
    }

}

export default LinkageComp;

