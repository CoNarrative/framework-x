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
import React, { Component } from 'react';
import { Context, subs } from './context';
import { shallowEqual } from '../util';
var connectFn = function (name, config, renderFn) {
    var _a;
    var devTools = config.devTools, debug = config.debug, subscribe = config.subscribe, makeSubscribe = config.makeSubscribe;
    var selector = subscribe;
    var SyntheticComponentBasedOnRenderFunction = /** @class */ (function (_super) {
        __extends(SyntheticComponentBasedOnRenderFunction, _super);
        function SyntheticComponentBasedOnRenderFunction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SyntheticComponentBasedOnRenderFunction.prototype.shouldComponentUpdate = function (newProps) {
            // new props are only received if shallow equality already failed
            return this.props._v !== newProps._v;
        };
        SyntheticComponentBasedOnRenderFunction.prototype.render = function () {
            debug && console.log('component RENDER:', name, this.props);
            return renderFn(this.props);
        };
        SyntheticComponentBasedOnRenderFunction.displayName = name;
        return SyntheticComponentBasedOnRenderFunction;
    }(Component));
    return _a = /** @class */ (function (_super) {
            __extends(ComponentSubscriptionWrapper, _super);
            function ComponentSubscriptionWrapper() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._sub = {
                    ownProps: null,
                    extractedProps: null,
                    appState: null,
                    merged: null,
                    v: 0
                };
                /* END SUBSCRIPTION TRACKING */
                /*
                 * The render function is called whenever it receives new props or when it receives new
                 * This goes counter to normal React in which a sCU checks first before hitting the render function
                 * There appears to be no problem; but if I'm wrong we may possibly have to handle props changes more efficiently using sCU & cWRP
                 */
                _this.innerConsumerRender = function (consumerValue) {
                    if (consumerValue == null) {
                        throw new Error("Framework-x component \"" + name + "\" did not receive a store from Provider context");
                    }
                    var appState = consumerValue.appState, dispatch = consumerValue.dispatch;
                    if (!appState)
                        throw new Error('App state was not initialized before rendering component.');
                    var didAppStateChange = appState !== _this._sub.appState;
                    var didOwnPropsChange = !shallowEqual(_this.props, _this._sub.ownProps);
                    var didExtractedPropsChange = false;
                    if (didAppStateChange) {
                        selector = (function () {
                            if (subscribe)
                                return subscribe;
                            if (!selector)
                                return makeSubscribe(null, _this.props, null);
                            if (didOwnPropsChange)
                                return makeSubscribe(_this._sub.ownProps, _this.props, selector);
                            return selector;
                        })();
                        var newExtractedProps = selector(appState, _this.props);
                        didExtractedPropsChange = !shallowEqual(_this._sub.extractedProps, newExtractedProps);
                        _this._sub.extractedProps = newExtractedProps;
                    }
                    if (didOwnPropsChange) {
                        // @ts-ignore
                        _this._sub.ownProps = _this.props;
                    }
                    if (didOwnPropsChange || didExtractedPropsChange) {
                        _this._sub.v++;
                        _this._sub.merged = Object.assign({ dispatch: dispatch }, _this.props, _this._sub.extractedProps, { _v: _this._sub.v });
                    }
                    debug && console.log('component CHECK:', name, {
                        version: _this._sub.v,
                        didChange: didOwnPropsChange || didExtractedPropsChange,
                        didOwnPropsChange: didOwnPropsChange,
                        didExtractedPropsChange: didExtractedPropsChange
                    });
                    // @ts-ignore
                    return <SyntheticComponentBasedOnRenderFunction {..._this._sub.merged}/>;
                };
                return _this;
            }
            /* FOR DEBUGGING INSTRUMENTATION WE TRACK ACTIVE SUBSCRIPTIONS (for now) */
            ComponentSubscriptionWrapper.prototype.componentDidMount = function () {
                if (!debug && !devTools)
                    return;
                subs[name] = subs[name] || [];
                subs[name].push(this._sub);
            };
            ComponentSubscriptionWrapper.prototype.componentWillUnmount = function () {
                if (!debug && !devTools)
                    return;
                var i = subs[name].indexOf(this._sub);
                // console.log('Removing sub watcher', {subs,name, i})
                subs[name].splice(i, 1);
            };
            ComponentSubscriptionWrapper.prototype.render = function () {
                return (<Context.Consumer>
          {this.innerConsumerRender}
        </Context.Consumer>);
            };
            return ComponentSubscriptionWrapper;
        }(Component)),
        _a.displayName = "FxComponent(" + name + ")",
        _a;
};
export var component = function (name, mapStateOrConfigBag, renderFn) {
    var _a, _b;
    if (renderFn == null) {
        renderFn = mapStateOrConfigBag;
        mapStateOrConfigBag = {};
    }
    if (typeof (renderFn) !== 'function') {
        throw new Error('This component wrapper is for pure functional components only.');
    }
    var explicitConfig = typeof (mapStateOrConfigBag) === 'function'
        ? { subscribe: mapStateOrConfigBag }
        : mapStateOrConfigBag;
    // apply defaults
    var config = Object.assign({}, {
        skipProps: []
    }, explicitConfig);
    var makeSubscribe = config.makeSubscribe, subscribe = config.subscribe;
    // convert classes to render fns
    renderFn = (renderFn.prototype && renderFn.prototype.isReactComponent)
        // @ts-ignore
        ? function (props) { return React.createElement(renderFn, props); } : renderFn;
    // connected component
    if (makeSubscribe || subscribe)
        return connectFn(name, config, renderFn);
    // Not connected so make just pure-render (which uses a shallow compare)
    if (config.injectDispatch) {
        return _a = /** @class */ (function (_super) {
                __extends(Pure, _super);
                function Pure() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Pure.prototype.render = function () {
                    var _this = this;
                    return (<Context.Consumer>
            {function (_a) {
                        var dispatch = _a.dispatch;
                        // @ts-ignore
                        return renderFn(Object.assign({ dispatch: dispatch }, _this.props));
                    }}
          </Context.Consumer>);
                };
                return Pure;
            }(React.PureComponent)),
            _a.displayName = name,
            _a;
    }
    return _b = /** @class */ (function (_super) {
            __extends(Pure, _super);
            function Pure() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Pure.prototype.render = function () {
                // @ts-ignore
                return renderFn(this.props);
            };
            return Pure;
        }(React.PureComponent)),
        _b.displayName = name,
        _b;
};
