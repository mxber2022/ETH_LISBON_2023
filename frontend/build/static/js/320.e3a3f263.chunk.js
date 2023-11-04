"use strict";(self.webpackChunkETHLisbon2023=self.webpackChunkETHLisbon2023||[]).push([[320],{6320:(i,e,t)=>{t.r(e),t.d(e,{OpenloginAdapter:()=>g,getOpenloginDefaultOptions:()=>l});var n=t(13453),o=t(4942),r=t(28779),s=t(12169),a=t(57381),h=t.n(a);const l=()=>({adapterSettings:{network:n.dr.MAINNET,clientId:"",uxMode:n.$e.POPUP},loginSettings:{}});function c(i,e){var t=Object.keys(i);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(i);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(i,e).enumerable}))),t.push.apply(t,n)}return t}function p(i){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?c(Object(t),!0).forEach((function(e){(0,o.Z)(i,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(i,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(e){Object.defineProperty(i,e,Object.getOwnPropertyDescriptor(t,e))}))}return i}class g extends r.J5{constructor(){let i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};super(i),(0,o.Z)(this,"name",r.rW.OPENLOGIN),(0,o.Z)(this,"adapterNamespace",r.yk.MULTICHAIN),(0,o.Z)(this,"type",r.hN.IN_APP),(0,o.Z)(this,"openloginInstance",null),(0,o.Z)(this,"status",r.MP.NOT_READY),(0,o.Z)(this,"currentChainNamespace",r.EN.EIP155),(0,o.Z)(this,"openloginOptions",void 0),(0,o.Z)(this,"loginSettings",{loginProvider:""}),(0,o.Z)(this,"privKeyProvider",null),this.setAdapterSettings(p(p({},i.adapterSettings),{},{chainConfig:i.chainConfig,clientId:i.clientId||"",sessionTime:i.sessionTime,web3AuthNetwork:i.web3AuthNetwork,useCoreKitKey:i.useCoreKitKey})),this.loginSettings=i.loginSettings||{loginProvider:""}}get chainConfigProxy(){return this.chainConfig?p({},this.chainConfig):null}get provider(){var i;return(null===(i=this.privKeyProvider)||void 0===i?void 0:i.provider)||null}set provider(i){throw new Error("Not implemented")}async init(i){if(super.checkInitializationRequirements(),!this.clientId)throw r.Ty.invalidParams("clientId is required before openlogin's initialization");if(!this.openloginOptions)throw r.Ty.invalidParams("openloginOptions is required before openlogin's initialization");let e=!1;if(this.openloginOptions.uxMode===n.$e.REDIRECT||this.openloginOptions.uxMode===n.$e.SESSIONLESS_REDIRECT){const i=(0,n.Gv)();Object.keys(i).length>0&&i._pid&&(e=!0)}this.openloginOptions=p(p({},this.openloginOptions),{},{replaceUrlOnRedirect:e}),this.openloginInstance=new n.ZP(p(p({},this.openloginOptions),{},{clientId:this.clientId,network:this.openloginOptions.network||this.web3AuthNetwork||n.dr.MAINNET})),r.cM.debug("initializing openlogin adapter init"),await this.openloginInstance.init(),this.status=r.MP.READY,this.emit(r.n2.READY,r.rW.OPENLOGIN);try{r.cM.debug("initializing openlogin adapter");this._getFinalPrivKey()&&(i.autoConnect||e)&&(this.rehydrated=!0,await this.connect())}catch(t){r.cM.error("Failed to connect with cached openlogin provider",t),this.emit("ERRORED",t)}}async connect(){let i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{loginProvider:""};super.checkConnectionRequirements(),this.status=r.MP.CONNECTING,this.emit(r.n2.CONNECTING,p(p({},i),{},{adapter:r.rW.OPENLOGIN}));try{return await this.connectWithProvider(i),this.provider}catch(e){if(r.cM.error("Failed to connect with openlogin provider",e),this.status=r.MP.READY,this.emit(r.n2.ERRORED,e),null!==e&&void 0!==e&&e.message.includes("user closed popup"))throw r.RM.popupClosed();throw r.RM.connectionError("Failed to login with openlogin")}}async disconnect(){let i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{cleanup:!1};if(this.status!==r.MP.CONNECTED)throw r.RM.notConnectedError("Not connected with wallet");if(!this.openloginInstance)throw r.Ty.notReady("openloginInstance is not ready");await this.openloginInstance.logout(),i.cleanup?(this.status=r.MP.NOT_READY,this.openloginInstance=null,this.privKeyProvider=null):this.status=r.MP.READY,this.rehydrated=!1,this.emit(r.n2.DISCONNECTED)}async authenticateUser(){if(this.status!==r.MP.CONNECTED)throw r.RM.notConnectedError("Not connected with wallet, Please login/connect first");return{idToken:(await this.getUserInfo()).idToken}}async getUserInfo(){if(this.status!==r.MP.CONNECTED)throw r.RM.notConnectedError("Not connected with wallet");if(!this.openloginInstance)throw r.Ty.notReady("openloginInstance is not ready");return await this.openloginInstance.getUserInfo()}setAdapterSettings(i){super.setAdapterSettings(i);const e=l();r.cM.info("setting adapter settings",i),this.openloginOptions=p(p(p({},e.adapterSettings),this.openloginOptions),i),i.web3AuthNetwork&&(this.openloginOptions.network=i.web3AuthNetwork),void 0!==i.useCoreKitKey&&(this.openloginOptions.useCoreKitKey=i.useCoreKitKey)}_getFinalPrivKey(){var i;if(!this.openloginInstance)return"";let e=this.openloginInstance.privKey;return null!==(i=this.openloginOptions)&&void 0!==i&&i.useCoreKitKey&&this.openloginInstance.coreKitKey&&(e=this.openloginInstance.coreKitKey),e}async connectWithProvider(){var i;let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{loginProvider:""};if(!this.chainConfig)throw r.Ty.invalidParams("chainConfig is required before initialization");if(!this.openloginInstance)throw r.Ty.notReady("openloginInstance is not ready");if(this.currentChainNamespace===r.EN.SOLANA){const{SolanaPrivateKeyProvider:i}=await Promise.all([t.e(201),t.e(945),t.e(833)]).then(t.bind(t,57945));this.privKeyProvider=new i({config:{chainConfig:this.chainConfig}})}else if(this.currentChainNamespace===r.EN.EIP155){const{EthereumPrivateKeyProvider:i}=await Promise.all([t.e(454),t.e(755)]).then(t.bind(t,58454));this.privKeyProvider=new i({config:{chainConfig:this.chainConfig}})}else{if(this.currentChainNamespace!==r.EN.OTHER)throw new Error("Invalid chainNamespace: ".concat(this.currentChainNamespace," found while connecting to wallet"));this.privKeyProvider=new s.FL}if(!this._getFinalPrivKey()||null!==(i=e.extraLoginOptions)&&void 0!==i&&i.id_token){var o;if(this.loginSettings.curve||(this.loginSettings.curve=this.currentChainNamespace===r.EN.SOLANA?n.x7.ED25519:n.x7.SECP256K1),!e.loginProvider&&!this.loginSettings.loginProvider)throw r.Ty.invalidParams("loginProvider is required for login");await this.openloginInstance.login(h()(this.loginSettings,e,{extraLoginOptions:p(p({},e.extraLoginOptions||{}),{},{login_hint:e.login_hint||(null===(o=e.extraLoginOptions)||void 0===o?void 0:o.login_hint)})}))}let a=this._getFinalPrivKey();if(a){if(this.currentChainNamespace===r.EN.SOLANA){const{getED25519Key:i}=await Promise.all([t.e(201),t.e(274)]).then(t.bind(t,42240));a=i(a).sk.toString("hex")}await this.privKeyProvider.setupProvider(a),this.status=r.MP.CONNECTED,this.emit(r.n2.CONNECTED,{adapter:r.rW.OPENLOGIN,reconnected:this.rehydrated})}}}}}]);
//# sourceMappingURL=320.e3a3f263.chunk.js.map