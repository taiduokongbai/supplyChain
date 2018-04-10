import React, { Component, PropTypes } from "react";
import { Radio } from "../components/AntdComp";
const RadioGroup = Radio.Group;

export default class RadioComp extends Component {
    render() {
        let { value, children, style,...props } = this.props;
        return (
            <div className="base-radio" style={style}>
                <RadioGroup
                    {...props}
                    value={String(value)}
                />
                {children}
            </div>
        );
    }
}

RadioComp.defaultProps = {
    options: [],
}

// Example
// const options = [
//     { label: 'Apple', value: 'Apple' },
//     { label: 'Pear', value: 'Pear' },
//     { label: 'Orange', value: 'Orange' },
// ];
{/*<RadioComp
    options={options}
>
    <span>（建议税率17%）</span>
</RadioComp>*/}