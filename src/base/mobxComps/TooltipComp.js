import React, { Component } from 'react'
import { Tooltip } from '../components/AntdComp';
import { formatNullStr } from '../consts/Utils'

export default class TooltipComp extends Component {
    render() {
        let { attr } = this.props;
        let txt = formatNullStr(attr.text);
        return (
            <Tooltip title={txt} placement={attr.placement || 'top'}>
                <div className='table-tooltip' style={{ width: attr.wid }} >{txt}</div>
            </Tooltip>
        )
    }
}

//<TooltipComp attr={{text:text, wid: 70, placement: 'left'}}/>