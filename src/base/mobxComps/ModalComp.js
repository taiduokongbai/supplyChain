import React, { Component, PropTypes } from "react";
import { Modal, Spin, Button } from '../components/AntdComp';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
export default class ModalComp extends Component {
    @observable newKey = Math.random();
    
    handleSubmit = () => {
        this.props.handleSubmit && this.props.handleSubmit();
    }
    handleCancel = (e) => {
        e.preventDefault();
        if (!this.store.loading) {
            this.props.handleCancel && this.props.handleCancel(e);
        }
    }
    getFooter = () => ([
        <Button key="submit" type="primary" size="large"
            loading={this.store.loading}
            onClick={this.handleSubmit}
        >
            {this.props.okText || "确定"}
        </Button>,
        <Button key="cancel" type="ghost" size="large"
            loading={this.store.loading}
            onClick={this.handleCancel}
        >
            {this.props.cancelText || "取消"}
        </Button>,
    ])
    getComp = () => { }

    render() {
        const loading = this.store.loading || false;
        let visible = this.store.visible;
        return (
            visible ?
            <Modal {...this.store} 
                key={this.newKey}
                onCancel={this.handleCancel}
                footer={this.getFooter()}
            >
                <Spin spinning={loading}>
                    {this.getComp()}
                </Spin>
            </Modal>:null
        );
    }
}