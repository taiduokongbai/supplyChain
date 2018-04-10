import React, { Component, PropTypes } from 'react';
import { Cascader } from '../components/AntdComp';
import MeasureStore from '../stores/MeasureStore';

let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;


@observer
export default class MeasureComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.store = props.store || new MeasureStore();
        this.store.value = Object.values(props.value);
    }

    componentDidMount() {
        this.store.initData(this.props.status);
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && nextProps.value != this.props.value) {
            this.store.setValue(Object.values(nextProps.value));
        }
    }
    onChange = (value, selectedOptions) => {
        this.store.setValue(value);
        let measureList = selectedOptions.map((item, index) => {
            let labelName = this.store.Level.slice()[index].labelName;
            return item[labelName];
        });
        let measure;
        if (measureList.length <= 1) {
            measure = measureList.join('');
        } else {
            measure = measureList.slice(1).join('')
        }
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.store.changeData(value), { measure }));
        }
    }
    handleAreaClick = (e, label, option) => {
        e.stopPropagation();
    }
    displayRender = (labels, selectedOptions) => labels.map((label, i) => {
        const option = selectedOptions[i];
        if (i === labels.length - 1 && option.isLeaf) {
            return (
                <span key={option.value}>{label} {option.symbol?<a>{"["+option.symbol+"]"}</a>:null}</span>
            );
        }
        return null;
    });
    render() {
        let { value, store, ...props } = this.props;
        return (
            <Cascader
                className="base-linkage"
                {...this.store.Props}
                {...props}
                displayRender={this.displayRender}
                onChange={this.onChange}
            />
        )
    }
}