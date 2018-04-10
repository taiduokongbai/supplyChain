import { Form, Input, Spin, Button, Modal, Row, Col, message, Select } from '../../../base/components/AntdComp';
import { AddSupGoodsComp } from './AddSupGoodsComp';
import { editSupGoodsStore, supplierStore, materialStore } from '../stores/EditSupGoodsStore';
let { observer } = mobxReact;

@observer
class EditSupGoodsComp extends AddSupGoodsComp {
    constructor(props, context) {
        super(props, context);
        this.store = editSupGoodsStore;
        this.supplierStore = supplierStore;
        this.materialStore = materialStore;
    }

    onMessage = () => {
        message.success("编辑成功！")
    }
}

const options = {
    onValuesChange(props, values) {
        editSupGoodsStore.setDetail(values)
    }
}
export default Form.create(options)(EditSupGoodsComp);