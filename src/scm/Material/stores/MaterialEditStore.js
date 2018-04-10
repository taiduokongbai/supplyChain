import { message } from '../../../base/components/AntdComp'
import { MaterialFetch } from '../../../base/consts/BusinessUrls';
import { MaterialBaseStore } from './MaterialAddStore';
import MeasureStore from '../../../base/stores/MeasureStore';
let { observable, action, computed, runInAction, toJS } = mobx;
import TabsAct from '../../actions/TabsAct';
import { store } from '../../data/StoreConfig';
const measurestoreSize = new MeasureStore();
const measurestoreBase = new MeasureStore();
const measurestoreVolume = new MeasureStore();
const measurestoreWeight = new MeasureStore();
export class MaterialEditStore extends MaterialBaseStore {
    constructor(props, context) {
        super(props, context);
        this.measurestoreSize = measurestoreSize;
        this.measurestoreBase = measurestoreBase;
        this.measurestoreVolume = measurestoreVolume;
        this.measurestoreWeight = measurestoreWeight;
    }
    // @action
    // initData() {
    //     this.measurestore.initData();
    // }
    @action.bound
    fetchMaterialDetail(pm) {
        this.loading = true;
        this.setMaterialDetail();
        return MaterialFetch.materialDetail(pm).then(json => {
            if (json.status === 2000) {
                let { baseUnitCode, baseUnitSystem, baseDimensionality } = json.data;
                runInAction(() => {
                    this.detail = { ...this.detail, ...json.data }
                })
            }else if(json.status === 6000){
                message.error(`操作记录不存在`);
                store.dispatch(TabsAct.TabRemove("detailMaterial", "materialList"));
                store.dispatch(TabsAct.TabRemove("editMaterial", "materialList"));
                store.dispatch(TabsAct.TabInsert("materialList"));
            }
            runInAction(() => {
                this.loading = false
            })
        })
    }
    @action
    fetchMaterialSubmit(pm) {
        this.loading = true;
        return MaterialFetch.materialEdit(pm).then(this.clearForm)
    }
}
let materialEditStore = new MaterialEditStore();
// let measurestore = materialEditStore.measurestore;
export { materialEditStore,  measurestoreSize ,measurestoreBase,measurestoreVolume,measurestoreWeight}
