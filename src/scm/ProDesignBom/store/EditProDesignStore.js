import moment from "moment";
import { message } from '../../../base/components/AntdComp';
let { observable, action, computed, runInAction, toJS } = mobx;
import { ProDesignBomFetch } from '../../consts/ProDesignBomUrls';
import TableStore from '../../../base/stores/TableStore';
import TableEditStore from '../../../base/stores/TableEditStore';
//import {StdUnitStore} from '../../data/DropDownStore';
import TreeSelectStore from '../../../base/stores/TreeSelectStore';
import SelectStore from '../../../base/stores/SelectStore';
import { AddProDesignBomStore} from './AddProDesignBomStore';
import MeasureStore from '../../../base/stores/MeasureStore';
const measurestore = new MeasureStore();

export class EditProDesignStore extends AddProDesignBomStore {
    constructor() {
        super();
        this.measurestore = measurestore;
    }
}

export {

    measurestore
};