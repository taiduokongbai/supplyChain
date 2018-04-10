import { SupplierStore, MaterialStore } from '../../data/DropDownStore';
let { observable, action, computed, runInAction, toJS } = mobx;
import { SupplierGoodsFetch } from '../../consts/SupplierGoodsUrls';


export class SupGoodsFormStore {
    title = '新建供应商商品目录';
    width = 740;
    className = "supGoodsModal";
    
    @observable loading = false;
    @observable visible = false;

    initDetail = {
        id: "",
        status: 0,
        supplierCode: "",
        supplierFull: "",
        materialCode: "",
        materialName: "",
        materialModel: "",
        materialSpec: "",
        materialTexture: "",
        brand: "",
        materialCodeName: "",
        materialQty: "0.00",
        materialUnitCode: "",
        materialUnitName: "",
        convertFactor: 0,
        goodsCode: "",
        goodsName: "",
        goodsModel: "",
        goodsSpec: "",
        goodsTexture: "",
        goodsBrand: "",
        goodsCodeName: "",
        goodsQty: "0.00",
        goodsUnitCode: "",
        goodsUnitName: "",
    };
    @observable detail = this.initDetail;

    @action
    setVisible(value) {
        this.visible = value;
    }
    @action
    resetDetail() {
        this.detail = { ...this.initDetail };
    }
    @action
    setDetail(detail) {
        let data = Object.assign({}, this.detail, detail);
        let {
            materialQty,
            goodsQty,
        } = data;
        let convertFactor = Number(materialQty) / Number(goodsQty);
        
        if (isNaN(convertFactor) || convertFactor == Infinity) {
            data.convertFactor = 0;
        } else {
            data.convertFactor = convertFactor.toFixed(2);
        };
        this.detail = data;
    }
}

export class AddSupGoodsStore extends SupGoodsFormStore {
    constructor() {
        super();
        this.supplierStore = new SupplierStore();
        this.materialStore = new MaterialStore();
    }
    @action
    initData() {
        this.supplierStore.fetchSelectList('');
        this.materialStore.fetchSelectList('');
    }
    fetchSubmit(pm) {
        this.loading = true;
        return SupplierGoodsFetch.supGoodsAddEdit(pm).then(json => {
            this.loading = false;
            return json;
        })
    }
}


const addSupGoodsStore = new AddSupGoodsStore();
const supplierStore = addSupGoodsStore.supplierStore;
const materialStore = addSupGoodsStore.materialStore;

export {
    addSupGoodsStore,
    supplierStore,
    materialStore,
};
