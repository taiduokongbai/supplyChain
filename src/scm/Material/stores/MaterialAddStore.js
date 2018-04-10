import moment from "moment";
import SelectTableStore from '../../../base/stores/SelectTableStore';
import SearchBarStore from '../../../base/stores/SearchBarStore';
import TableStore from '../../../base/stores/TableStore';
import { MaterialFetch } from '../../../base/consts/BusinessUrls';
import { MaterialMeasureStore } from '../../data/DropDownStore';
import MeasureStore from '../../../base/stores/MeasureStore';
//measurestore
let { observable, action, computed, runInAction, toJS } = mobx;
const measurestoreSize = new MeasureStore();
const measurestoreBase = new MeasureStore();
const measurestoreVolume = new MeasureStore();
const measurestoreWeight = new MeasureStore();
export class MaterialBaseStore {
    @observable loading = false;
    initDetail = {
        materialCode: '',
        materialName: '',
        model: '',
        materialSpec: '',
        materialType: '',
        materialDesc: '',
        simpleCode: '',
        categoryCode: '',
        categoryName: '',
        type: '',
        baseDimensionality:null,//基本单位
        baseUnitSystem:null,
        baseUnitCode:'',
        sizeDimensionality:null,//尺寸单位
        sizeUnitSystem:null,
        sizeUnit:'',
        volumeDimensionality:null,//体积单位
        volumeUnitSystem:null,
        volumeUnit:'',
        weightDimensionality:null,//重量单位
        weightUnitSystem:null,
        weightUnit:'',
        // meaSystem:'',
        // meaCode:'',
        brand: '',
        sizeLength: '',
        sizeWidth: '',
        sizeHeight: '',
        sizeVolume: '',
        roughWeight: '',
        netWeight: '',
        
    };

    @observable detail = { ...this.initDetail };
    @computed get getDetail() {
        return this.detail;
    }
    @action resetDetail() {
        this.detail = { ...this.initDetail };
    }
    @action
    setMaterialDetail(detail) {
        this.detail = Object.assign({}, this.detail, detail);
    };
    @action.bound clearFrom(json) {
        if (json.status === 2000) {
            runInAction(() => {
                this.resetDetail();
            })
        };
        runInAction(() => {
            this.loading = false;
        })
        return json;
    }
}
export class MaterialAddStore extends MaterialBaseStore {
    constructor(props,context) {
        super(props,context);
        this.measurestoreSize = measurestoreSize;
        this.measurestoreBase = measurestoreBase;
        this.measurestoreVolume = measurestoreVolume;
        this.measurestoreWeight = measurestoreWeight;
    }
    @observable loading = false;
    @observable defaultMeasureList=[];
    @action
    initData() {
        // this.materialMeasureStore.fetchSelectList('');
    }
    @action
    fetchMaterialSubmit(pm) {
        this.loading = true;
        return MaterialFetch.materialAdd(pm).then(this.clearFrom)
    }
    @action.bound
    fetchMaterialDefaultMeasure(pm){
        return MaterialFetch.materialDefaultMeasure(pm).then(json=>{
            if(json.status===2000){
                let {list} = json.data;
                runInAction(()=>{
                    this.defaultMeasureList = list;
                })
            }
        }).then(()=>{
            measurestoreBase.initData();
            measurestoreVolume.initData();
            measurestoreSize.initData();
            measurestoreWeight.initData();
        })
    }
}
let materialAddStore = new MaterialAddStore();
// let measurestore = materialAddStore.Measurestore;
export { materialAddStore, measurestoreSize ,measurestoreBase,measurestoreVolume,measurestoreWeight};