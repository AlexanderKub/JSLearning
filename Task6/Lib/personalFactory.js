(function (exports) {
  
  var Personals = {
    createFixedPersonal: function (id,name,sum) {
      return new PersonalFixed(id,name,sum);
    },
    createRatePersonal: function (id,name,rate) {
      return new PersonalRate(id,name,rate);
    }
  };
  
  class Personal {
    constructor(id,name) {
      this.id = id;
      this.name = name;
      this.sum = 0;
    }
    
    get Sum() {
      return this.sum;
    }
    
    get ID() {
      return this.id;
    }
    
    get Name() {
      return this.name;
    }
  }
  
  class PersonalFixed extends Personal {
    constructor(id,name,sum) {
      super(id, name);
      this.sum = sum;
    }
  }
  
  class PersonalRate extends Personal {
    constructor(id,name,rate) {
      super(id, name);
      this.rate = rate;
      this.sum = 20.8*8*this.rate;
    }
  }
  
  exports.Personals = Personals;
  
})(typeof exports === "undefined" ? this["figuresFactory"] = {} : exports);