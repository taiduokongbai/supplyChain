import React, { Component, PropTypes } from "react";
import { AutoComplete, Form, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker } from '../../../base/components/AntdComp';
let { observer } = mobxReact;
const FormItem = Form.Item;

import { saleDeliveryNoticeStore } from '../stores/SaleDeliveryNoticeStore';
import { editSaleDeliveryNoticeStore, sourceOrderStore, siteStore, wareHouseStore, contactsStore, recSiteStore, editSaleDeliveryNoticeDetailStore } from '../stores/EditSaleDeliveryNoticeStore';
import { AddSaleDeliveryNoticeComp } from './AddSaleDeliveryNoticeComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import EditSaleDeliveryNoticeDetailComp from './EditSaleDeliveryNoticeDetailComp';

@observer
class EditSaleDeliveryNoticeComp extends AddSaleDeliveryNoticeComp {
    constructor(props, context) {
        super(props, context);
        this.title = '编辑发货通知单';
        this.type = 'edit';
        this.store = editSaleDeliveryNoticeStore;
        this.sourceOrderStore = sourceOrderStore;
        this.siteStore = siteStore;
        this.wareHouseStore = wareHouseStore;
        this.contactsStore = contactsStore;
        // this.recSiteStore = recSiteStore;
        this.detailStore = editSaleDeliveryNoticeDetailStore;
    }

    onMessage = () => {
        message.success('编辑成功');
        store.dispatch(TabsAct.TabRemoveAdd('editSaleDeliveryNotice', 'saleDeliveryNoticeList'));
        saleDeliveryNoticeStore.fetchTableList();
    }

    getDetailComp = () => <EditSaleDeliveryNoticeDetailComp />
    
}

const options = {
    onValuesChange(props, values) {
        editSaleDeliveryNoticeStore.setDetail(values)
    }
}
export default Form.create(options)(EditSaleDeliveryNoticeComp);
