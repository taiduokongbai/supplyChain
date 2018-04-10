import React, { Component, PropTypes } from 'react';
import { Cascader } from '../components/AntdComp';
import LinkAgeStore from '../stores/LinkAgeStore';

let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
@observer
export default class LinkAgeComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = props.store || new LinkAgeStore();
        this.store.value = Object.values(props.value);
    }

    componentDidMount() {
        this.store.initData();
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && nextProps.value != this.props.value) {
            this.store.setValue(Object.values(nextProps.value));
        }
    }
    onChange = (value, selectedOptions) => {
        let addressList = selectedOptions.map((item, index) => {
            let labelName = this.store.Level.slice()[index].labelName;
            return item[labelName];
        });
        let address;
        if (addressList.length <= 2) {
            address = addressList.join('');
        } else {
            address = addressList.slice(2).join('')
        }
        const onChange = this.props.onChange;
        
        this.store.detailAddress = selectedOptions.map(o => o.label).join('');
        if (onChange) {
            onChange(Object.assign(
                {}, 
                this.store.changeData(value), 
                { 
                    address,
                    detailAddress: this.store.DetailAddress
                }
            ));
        }
    }
    render() {
        let { value, store, ...props } = this.props;
        return (
            <Cascader
                className="base-linkage"
                {...this.store.Props}
                {...props}
                onChange={this.onChange}
            />
        )
    }
}