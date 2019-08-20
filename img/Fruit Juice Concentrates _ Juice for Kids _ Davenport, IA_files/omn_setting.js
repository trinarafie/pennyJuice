var OmnitureSetting = new function(){
    var _self=this;
    var _config={};

    this.init=function(config){
        _config={
            prodSKU: config.prodSKU,
            assetID: config.assetID,
            customerID: config.customerID,
            location: "US"
        };
        _config.siteType=getSiteType();

        HAF.config.global.assetID = _config.assetID;
        HAF.config.global.siteType = _config.siteType;
        
        // Do not track preview pages
        var trackingDisableParam = HAF.config.global.trackingDisableParam || "preview";
        var trackingDisabled = s.Util.getQueryParam(trackingDisableParam);
        if (trackingDisabled && trackingDisabled.toLowerCase() == "true") {
        	HAF.config.omniture.enabled = false;
        	console.log("Tracking disabled");
        } else {
        	_self.setProps(_config);
        }
    };

    this.setProps=function (config){
      
        var pageViewEvent = {};
        pageViewEvent.key = 'OMT_1';
        pageViewEvent.value = {};
        pageViewEvent.value[YellProps.PROD_SKU.omniture] = config.prodSKU;
        pageViewEvent.value[YellProps.GEO_LOCATION.omniture] = config.location;
        pageViewEvent.value[YellProps.SITE_TYPE.omniture] = config.siteType;
        pageViewEvent.value[YellProps.ASSET_ID.omniture] = config.assetID;
        pageViewEvent.value[YellProps.CUSTOMER_ID.omniture] = config.customerID;
        pageViewEvent.value[YellEvars.ASSET_ID.omniture] = config.assetID;
        pageViewEvent.value[YellEvars.SITE_TYPE.omniture] = config.siteType;
        
        // check InSITE-VIEW enabled
        //var inSite = s.Util.getQueryParam(YellEvars.INSITE_VIEW.param);
        //if (inSite.toLowerCase() == "true") {
    	//   pageViewEvent.value[YellEvars.INSITE_VIEW.omniture] = YellEvars.INSITE_VIEW.name;
        //}
        
        
        // @Note: We do track inSiteView events via DuDa JS API, this is no longer needed. C.T.
        //$.each(_dm_insite, function(idx, rule) {
        //	pageViewEvent.value[YellEvars.INSITE_VIEW.omniture] = YellEvars.INSITE_VIEW.name + "_" + rule.ruleType + '__' + rule.ruleId + '_old';
       	//});
        
        var keyWord = s.Util.getQueryParam(YellEvars.CAMPAIGN_KEYWORD.param);
        var adGroup = s.Util.getQueryParam(YellEvars.CAMPAIGN_ADGROUP.param);
        if (keyWord) {
            pageViewEvent.value[YellEvars.CAMPAIGN_KEYWORD.omniture] = keyWord;
        }
        if (adGroup) {
            pageViewEvent.value[YellEvars.CAMPAIGN_ADGROUP.omniture] = adGroup;
        }
        var clickAttribution = s.Util.getQueryParam(YellEvars.CLICK_ATTRIBUTION.param);
        if (clickAttribution) {
        	pageViewEvent.value[YellEvars.CLICK_ATTRIBUTION.omniture] = clickAttribution;
        }
        
        HAF.OmTracking.onView(pageViewEvent);
    }

    function getSiteType () {
        var siteType="web";
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            siteType="mobile";
        }
        return siteType;
    }

};

//put this here to make sure it runs after above code been loaded
dmAPI.runOnReady('omni-analytics', function(){
    OmnitureSetting.init(hibuWebsiteConfig);
});
