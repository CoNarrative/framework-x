var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { Component, PureComponent } from 'react';
import { Context } from './context';
// import hoistStatics from 'hoist-non-react-statics'
var getNonChildProps = function (props) {
    var otherProps = Object.assign({}, props);
    delete otherProps.children;
    return otherProps;
};
var Prevent = /** @class */ (function (_super) {
    __extends(Prevent, _super);
    function Prevent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Prevent.prototype.render = function () {
        // @ts-ignore
        var _a = this.props, _children = _a._children, rest = __rest(_a, ["_children"]);
        return _children()(rest);
    };
    return Prevent;
}(PureComponent));
var Subscribe = /** @class */ (function (_super) {
    __extends(Subscribe, _super);
    function Subscribe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // We do this so the shouldComponentUpdate of Prevent will ignore the children prop
        _this._children = function () { return _this.props.children; };
        _this.prevent = function (_a) {
            var appState = _a.appState, dispatch = _a.dispatch;
            // @ts-ignore
            var _b = _this.props, otherProps = _b.otherProps, selector = _b.selector;
            return (<Prevent dispatch={dispatch} {...selector(appState, otherProps)} {...otherProps} _children={_this._children}/>);
        };
        return _this;
    }
    Subscribe.prototype.render = function () {
        return (<Context.Consumer>
        {this.prevent}
      </Context.Consumer>);
    };
    return Subscribe;
}(Component));
export { Subscribe };
/**
 * for wrapping full classes AND inlining via subscription
 * very simple use/abuse of Context for ordered state propagation,
 * but results in deeper nesting than ideal
 */
export var connect = function (selector) { return function (WrappedComponent) {
    var ConnectedComponent = function (props) {
        // @ts-ignore
        return <Subscribe selector={selector} otherProps={getNonChildProps(props)}>
      {function (injectedProps) { return <WrappedComponent {...props} {...injectedProps}/>; }}
    </Subscribe>;
    };
    ConnectedComponent.displayName = "FxConnect(" + (WrappedComponent.displayName ||
        WrappedComponent.name || '-') + ")";
    return ConnectedComponent;
}; };
