import { SupplierStore, MaterialStore } from '../../data/DropDownStore';
import { EditSupGoodsStore } from './EditSupGoodsStore';
let { observable, action, computed, runInAction, toJS } = mobx;

export class SupGoodsViewStore extends EditSupGoodsStore {
    title = '供应商商品目录详情';
}
const supGoodsViewStore = new SupGoodsViewStore();

export {
    supGoodsViewStore
};
