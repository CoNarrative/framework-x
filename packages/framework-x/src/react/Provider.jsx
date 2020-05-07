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
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Context } from './context';
var Provider = /** @class */ (function (_super) {
    __extends(Provider, _super);
    function Provider(props) {
        var _this = _super.call(this, props) || this;
        var _a = _this.props, subscribeToState = _a.subscribeToState, dispatch = _a.dispatch, getState = _a.getState;
        if (!subscribeToState || !dispatch || !getState)
            throw new Error('Must provide subscribeToState, dispatch, and getState');
        _this.state = { appState: getState() };
        _this.value = {
            appState: _this.state.appState,
            dispatch: dispatch
        };
        subscribeToState(function (state) { return _this.setState({ appState: state }); });
        return _this;
    }
    Provider.prototype.render = function () {
        if (this.state.appState !== this.value.appState) {
            // Force a new object (required to trigger propagation)
            this.value = {
                appState: this.state.appState,
                dispatch: this.value.dispatch
            };
        }
        return (<Context.Provider value={this.value}>
        {this.props.children}
      </Context.Provider>);
    };
    Provider.propTypes = {
        getState: PropTypes.func.isRequired,
        subscribeToState: PropTypes.func.isRequired,
        dispatch: PropTypes.func
    };
    return Provider;
}(Component));
export { Provider };
