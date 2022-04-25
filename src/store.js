import {  makeAutoObservable, toJS } from "mobx";
class ConversionsStore {
  conversions = [];

  constructor(conversions) {
    // Call it here
    makeAutoObservable(this)
  }

  setConversions(conversions) {
    this.conversions = conversions;
    console.log(toJS(this.conversions))
  }
}

export { ConversionsStore };