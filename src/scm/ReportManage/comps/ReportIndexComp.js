import { render } from "react-dom";
import React, { Component } from "react";
import { Button, Spin } from '../../../base/components/AntdComp';
import ReportStore from "../stores/ReportStore";
import { setTimeout } from "timers";
let { observer } = mobxReact;
@observer
export default class ReportIndexComp extends Component {
    constructor(props, context) {
        super(props, context);
        this.type = "REPORT_INDEX";
        this.store = new ReportStore({ type: this.type});
    }
    componentDidMount() {
        if (window.BigDigit){
            this.store.setToken();
            window.onresize = this.setHeight;
        }
    }
    setHeight = () => {
        this.store.height = document.body.clientHeight - 80;
    }
    onOpen = (e) => {
        var scnWidth = screen.availWidth;
        var scnHeight = screen.availHeight;
        window.open(this.store.url, "", `toolbar=no,menubar=no,location=no,resizable=no,scrollbars=yes,top=300,left=300,width=${scnWidth},height=${scnHeight}`);
    }
    render() {
        return (
            <Spin spinning={this.store.loading}>
                {
                    this.type == "REPORT_INDEX" ? <Button
                        type="primary"
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '-34px',
                        }}
                        onClick={this.onOpen} >全屏</Button>
                    :null    
                }  
                {
                    window.BigDigit ? <iframe src={this.store.url}
                        width="100%"
                        id="thisFrameId"
                        style={{
                            height: this.store.height,
                            minHeight: 800,
                            border: 0
                        }}
                        onLoad={this.setHeight}
                    /> : null
                }
            </Spin>
        )
    }
}