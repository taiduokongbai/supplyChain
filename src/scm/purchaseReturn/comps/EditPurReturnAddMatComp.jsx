import { Form } from 'antd';
import { AddPurReturnAddMatComp } from './AddPurReturnAddMatComp';
import { purReturnEditStore, editPurReturnDetailStore, addMaterialStore } from '../stores/EditPurchaseReturnStore';
import { measureStore } from '../../data/DropDownStore';
let { observer } = mobxReact;
@observer
class EditPurReturnAddMatComp extends AddPurReturnAddMatComp {
    constructor(props, context) {
        super(props, context);
        this.store = addMaterialStore;
        this.purReturnFormStore = purReturnEditStore;
        this.onMaterialSubmit = editPurReturnDetailStore.onMaterialAdd;
    }
}

const options = {
    onValuesChange(props, values) {
        addMaterialStore.setMaterialDetail(values)
    }
}
export default Form.create(options)(EditPurReturnAddMatComp);