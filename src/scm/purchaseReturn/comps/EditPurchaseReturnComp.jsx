import React, { Component, PropTypes } from "react";
import moment from "moment";
import { AutoComplete, Form, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker, TreeSelect, Checkbox  } from '../../../base/components/AntdComp';
import FormComp from '../../../base/mobxComps/FormComp';
import { disabledBeforeDate, disabledAfterDate, debounce } from '../../../base/consts/Utils';

import EditPurReturnDetailComp from './EditPurReturnDetailComp';
import { AddPurchaseReturnComp } from './AddPurchaseReturnComp';
//mobx store  
import { purReturnEditStore, editPurReturnDetailStore, supplierStore, deptStore, purOrderStore, employeesStore, siteStore, warehouseStore, receivingAddressStore, receiverStore, invoiceTypeStore, paymentStore, settleMethodStore, currencyStore } from '../stores/EditPurchaseReturnStore';
import { purReturnListStore, searchBarStore } from '../stores/PurchaseReturnStore';
import { enumStore } from '../../../base/stores/EnumStore';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
const FormItem = Form.Item;
const Option = Select.Option;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
class EditPurchaseReturnComp extends AddPurchaseReturnComp {
    constructor(props, context) {
        super(props, context);
        this.title = '编辑采购退货单';
        this.store = purReturnEditStore;
        this.detailStore = editPurReturnDetailStore;
        this.supplierStore = supplierStore;
        this.deptStore = deptStore;
        this.purOrderStore = purOrderStore;
        this.employeesStore = employeesStore;
        this.siteStore = siteStore;
        this.warehouseStore = warehouseStore;
        this.receivingAddressStore = receivingAddressStore;
        this.receiverStore = receiverStore;
        this.invoiceTypeStore = invoiceTypeStore;
        this.paymentStore = paymentStore;
        this.settleMethodStore = settleMethodStore;
        this.currencyStore = currencyStore;
    }

    onMessage = () => {
        message.success('编辑成功');
        store.dispatch(TabsAct.TabRemove('editPurchaseReturn', 'purchaseReturn'));
        purReturnListStore.fetchTableList();
    }

    getDetailComp = () => (
        <div>
            <EditPurReturnDetailComp />
        </div>
    )
}

const options = {
    onValuesChange(props, values) {
        purReturnEditStore.setPurReturnDetail(values)
    }
}
export default Form.create(options)(EditPurchaseReturnComp);
