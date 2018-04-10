import { Form } from 'antd';
import { AddPurReturnAddMatComp } from './AddPurReturnAddMatComp';
import { purReturnAddStore, addPurReturnDetailStore, editMaterialStore } from '../stores/AddPurchaseReturnStore';
import { measureStore } from '../../data/DropDownStore';
let { observer } = mobxReact;
@observer
class AddPurReturnEditMatComp extends AddPurReturnAddMatComp {
    constructor(props, context) {
        super(props, context);
        this.store = editMaterialStore;
        this.purReturnFormStore = purReturnAddStore;
        this.onMaterialSubmit = addPurReturnDetailStore.onMaterialEdit;
    }
}

const options = {
    onValuesChange(props, values) {
        editMaterialStore.setMaterialDetail(values)
    }
}
export default Form.create(options)(AddPurReturnEditMatComp);