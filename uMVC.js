var uMVC = {};
uMVC.Model = function() {
    this._observers = [];
};
uMVC.Model.prototype.observe = function(observer) {
    this._observers.push(observer);
};
uMVC.Model.prototype.unobserve = function(observer) {
    for (var i = 0, ilen = this._observers.length; i < ilen; i++) {
        if (this._observers[i] === observer) {
            this._observers.splice(i, 1);
            return;
        }
    }
};
uMVC.Model.prototype.notify = function(data) {
    var observers = this._observers.slice(0);
    for (var i = 0, ilen = observers.length; i < ilen; i++) {
        observers[i].update(data);
    }
};
uMVC.View = function() {
    this._subViews = [];
};
uMVC.View.prototype.update = function() {};
uMVC.View.prototype.getModel = function() {
    return this._model;
};
uMVC.View.prototype.setModel = function(model) {
    this._setModelAndController(model, this.getController());
};
uMVC.View.prototype.getDefaultController = function() {
    return new uMVC.Controller();
};
uMVC.View.prototype.getController = function() {
    if (!this._controller) this.setController(this.getDefaultController());
    return this._controller;
};
uMVC.View.prototype.setController = function(controller) {
    this._setModelAndController(this._model, controller);
};
uMVC.View.prototype._setModelAndController = function(model, controller) {
    if (this._model !== model) {
        if (this._model) this._model.unobserve(this);
        if (model) model.observe(this);
        this._model = model;
    }
    if (controller) {
        controller.setView(this);
        controller.setModel(model);
    }
    this._controller = controller;
};
uMVC.View.prototype.getSubViews = function() {
    return this._subViews.slice(0);
};
uMVC.View.prototype.addSubView = function(subView) {
    var previousSuperView = subView.getSuperView();
    if (previousSuperView) previousSuperView.removeSubView(subView);
    this._subViews.push(subView);
    subView.setSuperView(this);
};
uMVC.View.prototype.removeSubView = function(subView) {
    for (var i = 0, ilen = this._subViews.length; i < ilen; i++) {
        if (this._subViews[i] === subView) {
            this._subViews[i].setSuperView(null);
            this._subViews.splice(i, 1);
            return;
        }
    }
};
uMVC.View.prototype.setSuperView = function(superView) {
    this._superView = superView;
};
uMVC.View.prototype.getSuperView = function() {
    return this._superView;
};
uMVC.View.prototype.destroy = function() {
    if (this._model) {
        this._model.unsubscribe(this);
        this._model = null;
    }
    if (this._controller) {
        this._controller.destroy();
        this._controller = null;
    }
    for (var i = 0, ilen = this._subViews.length; i < ilen; i++) {
        this._subViews[i].destroy();
    }
    this._subViews = null;
    this._superView = null;
};
uMVC.Controller = function() {};
uMVC.Controller.prototype.getModel = function() {
    return this._model;
};
uMVC.Controller.prototype.setModel = function(model) {
    this._model = model;
};
uMVC.Controller.prototype.getView = function() {
    return this._view;
};
uMVC.Controller.prototype.setView = function(view) {
    this._view = view;
};
uMVC.Controller.prototype.destroy = function() {
    this._model = null;
    if (this._view) {
        this._view.setController(null);
        this._view = null;
    }
};