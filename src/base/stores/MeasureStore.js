import { ReqApi } from '../services/ReqApi'
import MeasureUrls from '../consts/MeasureUrls';
let { observable, action, computed, runInAction, createTransformer } = mobx;
export default class MeasureStore {
  Level = [
    {
      valueName: 'dimensionality',
      labelName: 'dimensionalityName',
      isLeaf: false,
      fetchFunction: () => ReqApi.get({
        url: MeasureUrls.GET_LISTOFDIMENSIONALITY,
        pm: {}
      })
    }, {
      valueName: 'meaSystem',
      labelName: 'meaSystemName',
      isLeaf: false,
      fetchFunction: (dimensionality) => ReqApi.get({
        url: MeasureUrls.GET_LISTOFMEASYSTEM,
        pm: { dimensionality }
      })
    }, {
      valueName: 'meaCode',
      labelName: 'meaName',
      code: 'symbol',
      isLeaf: true,
      fetchFunction: (meaSystem) => ReqApi.get({
        url: MeasureUrls.GET_LIST,
        pm: this.value.slice()[0] == 0 || this.value.slice()[0] == 1 ?
          { dimensionality: this.value.slice()[0], status: 1 } :
          { dimensionality: this.value.slice()[0], meaSystem: meaSystem, status: 1 }
      })
    }
  ];
  @observable loading = false;
  @observable options = [];
  @observable value = [];
  changeOnSelect = true;
  placeholder = "请选择";
  notFoundContent = "暂无数据";
  type;
  @action
  setValue(value) {
    if (value[0] === '' || value[0] === undefined) {
      this.value = [];
    } else {
      this.value = value;
    }
  }
  @action
  changeData(value) {
    let obj = {};
    this.Level.forEach(item => {
      obj[item.valueName] = ''
    });
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        obj[this.Level[index].valueName] = item;
      })
    }
    return obj;
  }
  @observable init = false;
  @action.bound
  initData(status) {
    if (this.value.slice()[0] !== undefined) {
      this.getDimensionality(this.value);
    }
  }
  @action.bound
  getDimensionality(value) {
    let dimensionalityIndex;
    let dimensionalitys = this.options;
    let p = {};
    if (this.type == 'all') {
      p = {}
    } else {
      if (this.value.slice()[0] === 2 || this.value.slice()[0] === 3 || this.value.slice()[0] === 4) {
        p = { dimensionality: this.value.slice()[0] }
      }
    }
    dimensionalitys = dimensionalitys ? dimensionalitys.slice() : [];
    if (dimensionalitys.length < 1) {
      ReqApi.get({
        url: MeasureUrls.GET_LISTOFDIMENSIONALITY,
        pm: p
      }).then(json => {
        if (json.status === 2000) {
          json.data.list.map(item => {
            item.label = item.dimensionalityName;
            item.value = item.dimensionality;
            item.isLeaf = false;
            return item;
          });
          this.options = json.data.list;
        }
        return json.data.list;
      }).then((list) => {
        if (value[0] || value[0] == 0) {
          dimensionalityIndex = list.map(i => i.dimensionality).indexOf(value[0]);
          if (value[0] == 1 || value[0] == 0) {
            this.getMeasureNew(value, dimensionalityIndex)
          } else {
            this.getMea_system(value, dimensionalityIndex);
          }
        }
      });
    } else {
      if (value[0] || value[0] == 0) {
        dimensionalityIndex = dimensionalitys.map(i => i.dimensionality).indexOf(value[0]);
        if (value[0] == 1 || value[0] == 0) {
          this.getMeasureNew(value, dimensionalityIndex)
        } else {
          this.getMea_system(value, dimensionalityIndex);
        }
      }
    }
  }
  @action.bound
  getMea_system(value, dimensionalityIndex) {
    if (value[0] == '') {
      return;
    }
    let mea_systemIndex;
    let mea_systems = this.options[dimensionalityIndex].children;
    mea_systems = mea_systems ? mea_systems.slice() : [];
    if (mea_systems.length < 1) {
      ReqApi.get({
        url: MeasureUrls.GET_LISTOFMEASYSTEM,
        pm: { dimensionality: value[0] }
      }).then(json => {
        if (json.status === 2000) {
          json.data.list.map(item => {
            item.label = item.meaSystemName;
            item.value = item.meaSystem;
            item.isLeaf = false;
            return item;
          });
          mea_systemIndex = json.data.list.map(i => i.meaSystem).indexOf(value[1]);
          this.options[dimensionalityIndex].children = json.data.list;
          this.options = [...this.options.slice()];
        }
        return json.data.list;
      }).then(list => {
        if (value[1] || value[1] == 0) {
          mea_systemIndex = list.map(i => i.meaSystem).indexOf(value[1]);
          this.getMeasure(value, dimensionalityIndex, mea_systemIndex)
        }
      })
    } else {
      if (value[1] || value[1] == 0) {
        mea_systemIndex = mea_systems.map(i => i.meaSystem).indexOf(value[1]);
        this.getMeasure(value, dimensionalityIndex, mea_systemIndex)
      }
    }
  }
  @action.bound
  getMeasureNew(value, dimensionalityIndex) {
    if (value[0] == '') {
      return;
    }
    let measures = this.options[dimensionalityIndex].children;
    measures = measures ? measures.slice() : [];
    if (measures.length < 1) {
      ReqApi.get({
        url: MeasureUrls.GET_LIST,
        pm: { dimensionality: value[0], status: 1 }
      }).then(json => {
        if (json.status === 2000) {
          json.data.list.map(item => {
            item.label = item.meaName;
            item.value = item.meaCode;
            item.isLeaf = true;
            return item;
          });
          this.options[dimensionalityIndex].children = json.data.list;
          this.options = [...this.options.slice()];
        }
      })
    }
  }
  @action.bound
  getMeasure(value, dimensionalityIndex, mea_systemIndex) {
    if (value[0] == '') {
      return;
    }
    let measures = this.options[dimensionalityIndex].children[mea_systemIndex].children;
    measures = measures ? measures.slice() : [];
    if (measures.length < 1) {
      ReqApi.get({
        url: MeasureUrls.GET_LIST,
        pm: { meaSystem: value[1], dimensionality: value[0], status: 1 }
      }).then(json => {
        if (json.status === 2000) {
          json.data.list.map(item => {
            item.label = item.meaName;
            item.value = item.meaCode;
            item.isLeaf = true;
            return item;
          });
          this.options[dimensionalityIndex].children[mea_systemIndex].children = json.data.list;
          this.options = [...this.options.slice()];
        }
      })
    }
  }
  @action.bound
  loadData(selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.meaCode && targetOption.meaCode != '') {
      return;
    } else if (targetOption.meaSystem !== undefined && targetOption.meaSystem !== '') {
      this.setOptions(targetOption, 1, 2);
      return;
    } else if (targetOption.dimensionality == 0 || targetOption.dimensionality == 1) {
      this.setOptions(targetOption, 0, 2);
      return;
    } else if (targetOption.dimensionality && targetOption.dimensionality != '' && targetOption.dimensionality !== 0 || targetOption.dimensionality !== 1) {
      this.setOptions(targetOption, 0, 1);
      return;
    }
  }
  @action.bound
  setOptions(targetOption, index, nextIndex) {
    targetOption.loading = true;
    let item = this.Level.slice()[index];
    let nextItem = this.Level.slice()[nextIndex];

    nextItem.fetchFunction(targetOption[item.valueName]).then(json => {
      if (json.status === 2000) {
        json.data.list.map(i => {
          i.label = i[nextItem.labelName];
          i.value = i[nextItem.valueName];
          i.isLeaf = nextItem.isLeaf;
          return i;
        });
        targetOption.children = json.data.list;
      }
      targetOption.loading = false;
      this.options = [...this.options.slice()];
    })
  }
  constructor() {
    this.transformer = createTransformer((store) => ({
      value: store.value.slice(),
      options: store.options.slice(),
      loadData: store.loadData,
      changeOnSelect: store.changeOnSelect,
      placeholder: store.placeholder,
      notFoundContent: store.notFoundContent,
    }));
  }
  get Props() {
    return this.transformer(this);
  }
}
