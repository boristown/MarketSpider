//
// Advinion Professional Chart (C)2014 Advinion ltd
// Change for build: 2.61.018 05/02/2014
//
//
// JScript File
// Flash Player Version Detection - Rev 1.6
// Detect Client Browser type
// Copyright(c) 2005-2006 Adobe Macromedia Software, LLC. All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
var IS_FF = (navigator.userAgent.indexOf("Firefox") >= 0);

//var strAdvinionFlashFolder = "http://chart.advinion.com/flash/";
var strAdvinionFlashFolder = "//advcharts.forexpros.com/advinion2012/";

var gid = 1;
var gidBS = 1;
var gidBar = 1;
var qtsid = 1;
var gCid = 1;
var blnAdvinionScrollViaJS = false;

// -----------------------------------------------------------------------------
// Globals
// Major version of Flash required
var requiredMajorVersion = 10;
// Minor version of Flash required
var requiredMinorVersion = 0;
// Minor version of Flash required
var requiredRevision = 0;
// -----------------------------------------------------------------------------
// -->

// Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
var hasProductInstall = DetectFlashVer(6, 0, 65);

// Version check based upon the values defined in globals
var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

//alert(hasProductInstall);

function ControlVersion()
{
	var version;
	var axo;
	var e;

	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}

	if (!version)
	{
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful. 
			
			// default to the first public version
			version = "WIN 6,0,21,0";

			// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
			axo.AllowScriptAccess = "always";

			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");

		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer(){
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");			
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}	
	return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];

        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}

function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
    var str = '';
    if (isIE && isWin && !isOpera)
    {
  		str += '<object ';
  		for (var i in objAttrs)
  			str += i + '="' + objAttrs[i] + '" ';
  		str += '>';
  		for (var i in params)
  			str += '<param name="' + i + '" value="' + params[i] + '" /> ';
  		str += '</object>';
    } else {
  		str += '<embed ';
  		for (var i in embedAttrs)
  			str += i + '="' + embedAttrs[i] + '" ';
  		str += '> </embed>';
    }
    document.write(str);
}

function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf?sid=A07102009a", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){	
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":	
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "id":
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}

// -----------------------------------------------------------------------------
//  Call this function first to initialize the Professional-Chart parameters.
//
//  Parameters
//      strKey:         The customer key you received from Advinion
//      strLanguage:    The language code. e.g. "eng" for english
//      strTimeFrame:   The timeframe. Available values:  "Tick", "1M", "5M", "10M", "15M", "30M", "60M", "2H", "4H", "1D" (1 Day), "1W" (1 Week) or "1MON" (1 Month)
//      strChartType:   The price chart type. Available values:  "CS", "OHLC","Area" or "Line"
//
//  Return Value
//      The initialized parameters container object. Use it in call to all other functions
// -----------------------------------------------------------------------------
function ADVINION_ProChartInit(strKey,strLanguage,strTimeFrame,strChartType)
{

    var objADVInit=new Object();
    objADVInit.advinionKey=strKey;
    objADVInit.TimeFrame=2;
    objADVInit.ExtendedRTFeed=0;
    if (strLanguage==null)
        objADVInit.Lang="eng";
    else
        objADVInit.Lang=strLanguage;
        
    objADVInit.UserID=null;
    objADVInit.UserName=null;
    objADVInit.Password=null;
    objADVInit.AdminName=null;
    
    objADVInit.NumViewableBars=100;
    objADVInit.NumBars=600;
    
    if (strTimeFrame==null) strTimeFrame="1m";
    
    switch(strTimeFrame.toLowerCase())
    {
        case "tick":    objADVInit.TimeFrame=-1; break;
        case "1m":      objADVInit.TimeFrame=0; break;
        case "5m":      objADVInit.TimeFrame=1; break;
        case "10m":     objADVInit.TimeFrame=2; break;
        case "15m":     objADVInit.TimeFrame=3; break;
        case "30m":     objADVInit.TimeFrame=4; break;
        case "60m":     objADVInit.TimeFrame=5; break;
        case "2h":      objADVInit.TimeFrame=6; break;
        case "4h":      objADVInit.TimeFrame=7; break;
        case "5h":      objADVInit.TimeFrame=8; break;
        case "8h":      objADVInit.TimeFrame=9; break;
        case "1d":      objADVInit.TimeFrame=10; break;
        case "1w":      objADVInit.TimeFrame=11; break;
        case "1mon":    objADVInit.TimeFrame=12; break;
        
        default:        objADVInit.TimeFrame=0; break;
    
    }
    
    
    if (strChartType==null) strChartType="cs";
    switch(strChartType.toLowerCase())
    {
        case "cs":      objADVInit.ChartType=1; break;
        case "ohlc":    objADVInit.ChartType=0; break;
        case "area":    objADVInit.ChartType=3; break;
        case "line":    objADVInit.ChartType=2; break;
        
        default:        objADVInit.ChartType=1; break;
    
    }
        
    objADVInit.ViewTooltip=0;
    objADVInit.TooltipDelay=3000;
    
    objADVInit.CSColorUP="#00FF00";
    objADVInit.CSColorDOWN="#FF0000";
    objADVInit.DrawColor="#000000";
    objADVInit.LineWidth=1;
    
    objADVInit.URL=null;
    
    objADVInit.DataMethod="AdvinionWS";
    objADVInit.WSURL="";
    objADVInit.SYSWSURL="";
    objADVInit.ShareWSURL="";
    objADVInit.MaxNumOfBars=350;
    objADVInit.ExtraUserData="";
    objADVInit.InitSystemID="";
    objADVInit.InitSystemName="";
    objADVInit.Tradable=false;
    
    objADVInit.RequestTimeout = 1;
    
    objADVInit.SupportCategories=false;
    objADVInit.FavoritesMode=false;
    objADVInit.ShowMoreButton=false;
    objADVInit.AlwaysShowMoreInInstrumentsMenu=false;
    
    objADVInit.ValueFieldType="bid";
    objADVInit.EnableValueFieldTypeUI=false;
    objADVInit.OtherFieldName="mid";
    objADVInit.DetachDoneByHost=false;

    objADVInit.LogoFileName="";
    objADVInit.LogoWidth=20;
    objADVInit.LogoHeight=20;
    objADVInit.LogoHAlign="center";
    objADVInit.LogoVAlign="middle";
    objADVInit.LogoHOffset=0;
    objADVInit.LogoVOffset=0;
    
    objADVInit.TimeScales=null;	//"Tick;1M;5M;10M;15M;30M;60M;2H;4H;5H;8H;1D;1W;1MON";
    objADVInit.TimeScalesButtons=null;	//"Tick;1M;5M;10M;15M;30M;60M;2H;4H;5H;8H;1D;1W;1MON";

	objADVInit.ToolbarImage="ToolbarV1.png";
	
	objADVInit.EnableGrid=false;

    objADVInit.ShareImageUpFileName=null;
    objADVInit.ShareImageOverFileName=null;
    objADVInit.ShareImagePressedFileName=null;
    objADVInit.ShareType="NONE";
    
	objADVInit.EnableAnnotations=false;
	objADVInit.AnnotationsImagesUrl=null;
	objADVInit.AnnotationsImagesIDs=null;
	objADVInit.FirstVGap=3;
	objADVInit.VGap=3;
	objADVInit.OnRefreshAnnotationCallbackName=null;

	objADVInit.EnableUIColors=false;
	objADVInit.MenuTextColor="#66FF66";
	objADVInit.MenuTextRollOverColor="#CCCCCC";
	objADVInit.MenuBorderColor="#FF4400";
	objADVInit.MenuFillColor1="#FF6666";
	objADVInit.MenuFillColor2="#441111";
	objADVInit.TimeRangeStrokeColor="#880000";
	objADVInit.TimeControlFillColor="#CC0000";
	objADVInit.TimeControlFillOpacity=0.5;
	objADVInit.PriceTitleTextColor="#DDDDDD";
	objADVInit.PriceTitleFillColor1="#FF6666";
	objADVInit.PriceTitleFillColor2="#662222";
	objADVInit.PriceTitleFillColor3="#eaedef";
	objADVInit.PriceTitleFillColor4="#eaedef";
	objADVInit.PriceTitleShowSecondFill=false;

	objADVInit.PriceTitleImageBkAlpha=0.8;
	
	//By default the custom color level2 is disabled
	//The current value gives a black theme
	objADVInit.EnableUIColorsLevel2=false;
	objADVInit.ColorLvl2ChartBkColor="#444444";
	objADVInit.ColorLvl2DateSelectBkColor="#444444";
    objADVInit.ColorLvl2PanelBkColor="#444444";
    objADVInit.ColorLvl2AppBkColor="#444444";
    objADVInit.ColorLvl2PriceColor="#CCCCCC";
    objADVInit.ColorLvl2AxisFontColor="#CCCCCC";
    objADVInit.CustomColorAxisFillColor="#444444";
    objADVInit.ColorLvl2TitleFontColor="#CCCCCC";
    objADVInit.ColorLvl2StudyBlackAlternateColor="#799ACE";
    objADVInit.ColorLvl2DateSelectMaskColor="#666666";
    objADVInit.ColorLvl2GridColor="#222222";
    objADVInit.ColorLvl2CrosshairColor="#999999";
    objADVInit.ColorLvl2ToolbarBkMode="black";
    objADVInit.ColorLvl2AxisFillColor="#444444";
    objADVInit.ColorLvl2ToolbarBkAsColor=true;
	objADVInit.customerName="Test";
    
    return objADVInit;

}

// -----------------------------------------------------------------------------
//  Call this function to enable / disable support for external feed (Change, change %, tick coming from the feed itself)
//
//  Parameters:
//  objADVInit:     The parameters container object
//  blnUse:         true to enable / false to disable the external feed support
// -----------------------------------------------------------------------------
function ADVINION_ProExtendedRTSupport(objADVInit,blnUse)
{
    if (blnUse)
        objADVInit.ExtendedRTFeed=1;
    else
        objADVInit.ExtendedRTFeed=0;
}

// -----------------------------------------------------------------------------
//  Call this function to enable / disable support for external feed (Change, change %, tick coming from the feed itself)
//
//  Parameters:
//  objADVInit:     The parameters container object
//  strSharedListName:      The name of the share system list user (e.g. your-site-name)
//  strUserID:              The id of the logged in user (to use for storing its data)
//  strUserName:            The name of the logged in user (to display it the open/save system form)
//  strPassword:            [Optional] The user Professional-Chart inner password. Incase one needed to protect the systems data
//  strExtraUserData:       [Optional] Additional user data for per user manipulation
//  strInitSystemID			[Optional] System to open when chart loads.
//  strInitSystemName		[Optional] Name of system to open when chart loads.
// -----------------------------------------------------------------------------
function ADVINION_ProSupportSystems(objADVInit,strSharedListName,strUserID,strUserName,strPassword,strExtraUserData,strInitSystemID,strInitSystemName)
{
    objADVInit.UserID=strUserID;
    objADVInit.UserName=strUserName;
    objADVInit.Password=strPassword;
    objADVInit.AdminName=strSharedListName;
    if (strExtraUserData!=null) objADVInit.ExtraUserData=strExtraUserData;
    if (strInitSystemID!=null) objADVInit.InitSystemID=strInitSystemID;
    if (strInitSystemName!=null) objADVInit.InitSystemName=strInitSystemName;
}

// -----------------------------------------------------------------------------
//  Call this function to set user specific data
//
//  Parameters:
//  objADVInit:     The parameters container object
//  strUserID:              The id of the logged in user (to use for storing its data)
//  strExtraUserData:       [Optional] Additional user data for per user manipulation
// -----------------------------------------------------------------------------
function ADVINION_ProUserSettings(objADVInit,strUserID,strExtraUserData)
{
    if (strUserID!=null) objADVInit.UserID=strUserID;
    if (strExtraUserData!=null) objADVInit.ExtraUserData=strExtraUserData;
}

// -----------------------------------------------------------------------------
//  Call this function to set the number of bars to get and number of bars to display initially
//
//  Parameters:
//  objADVInit:             The parameters container object
//  iNumBars:              The number of history bar to fetch from the server
//  iNumViewableBars:       The number of bars to display
//  iMaxNumOfBars:       	Maximum allowed number of bars
// -----------------------------------------------------------------------------
function ADVINION_ProZoomSettings(objADVInit,iNumBars,iNumViewableBars,iMaxNumOfBars)
{
    if (iNumViewableBars!=null) objADVInit.NumViewableBars=iNumViewableBars;
    if (iNumBars!=null) objADVInit.NumBars=iNumBars;
    if (iMaxNumOfBars!=null) objADVInit.MaxNumOfBars=iMaxNumOfBars;
}

// -----------------------------------------------------------------------------
//  Call this function to set the tooltip settings
//
//  Parameters:
//  objADVInit:             The parameters container object
//  blnViewTooltip:         Is tooltip enabled by default
//  iTooltipDelay:          Tooltip pre-display delay
// -----------------------------------------------------------------------------
function ADVINION_ProTooltipSettings(objADVInit,blnViewTooltip,iTooltipDelay)
{
    if (blnViewTooltip)
        objADVInit.ViewTooltip=1;
    else
        objADVInit.ViewTooltip=0;
        
    if (iTooltipDelay!=null && isNaN(iTooltipDelay)==false)
        objADVInit.TooltipDelay=iTooltipDelay;
}

// -----------------------------------------------------------------------------
//  Call this function to set the default colors (when user change colors via settings form, his changes will overwrite this values)
//
//  Parameters:
//  objADVInit:             The parameters container object
//  strCSColorUP:           Color of the UP candlestick body.   Example: "#00FF00"
//  strCSColorDOWN:         Color of the DOWN candlestick body. Example: "#FF0000"
//  strCSBorderColorUP:     Color of the UP candlestick border.   Example: "#006600"
//  strCSBorderColorDOWN:   Color of the DOWN candlestick border. Example: "#660000"
// -----------------------------------------------------------------------------
function ADVINION_ProColors(objADVInit,strCSColorUP,strCSColorDOWN,strCSBorderColorUP,strCSBorderColorDOWN)
{
    if (strCSColorUP!=null) objADVInit.CSColorUP=strCSColorUP;
    if (strCSColorDOWN!=null) objADVInit.CSColorDOWN=strCSColorDOWN;
    if (strCSBorderColorUP!=null && strCSBorderColorDOWN!=null) objADVInit.CSBorderColorUP=strCSBorderColorUP;
    if (strCSBorderColorUP!=null && strCSBorderColorDOWN!=null) objADVInit.CSBorderColorDOWN=strCSBorderColorDOWN;
}

// -----------------------------------------------------------------------------
//  Call this function to set the drawing definitions
//
//  Parameters:
//  objADVInit:             The parameters container object
//  strDrawColor:           Default draw color.                 Example: "#000000"
//	iLineWidth:				Line width 1-5
// -----------------------------------------------------------------------------
function ADVINION_ProDrawSettings(objADVInit,strDrawColor,iLineWidth)
{
    if (strDrawColor!=null) objADVInit.DrawColor=strDrawColor;
    if (iLineWidth!=null) objADVInit.LineWidth=iLineWidth;
}



// -----------------------------------------------------------------------------
//  Call this function to set the default colors (when user change colors via settings form, his changes will overwrite this values)
//
//  Parameters:
//  objADVInit:             The parameters container object
//	strMarket:				The default market to show if needed (Stocks, CFDs)
//  strSymbol:      		The symbol code to watch. e.g. EUR/USD or GOOG etc...
//  strSymbolName:			The symbol name if needed (Stocks, CFDs)
//  blnShowOnlyName:        Show only the name (e.g. Show only symbol name and not its code, like CFDs)
//  strIgnoreCharsOnSearch:	Use it to help symbol search by ignoring a char. e.g. when strIgnoreCharsOnSearch="/" in search USD/ILS can be found by typing USDILS or USDI etc...
//  blnShowMoreButton		Show or hide the more button
//	blnForceMoreInMajorsMnu	Always show the more button at the end of Majors menu
//  iDecimalPlaces			How many decimal places after the doc. Must happen together with server side support
//  blnHideMoreSeparateMenu   When true, along with blnShowMoreButton & mblnForceMoreInMajorsMnu shows "More" only in Majors menu.
// -----------------------------------------------------------------------------
function ADVINION_ProSymbolSettings(objADVInit,strMarket,strSymbol,strSymbolName,blnShowOnlyName,strIgnoreCharsOnSearch,
		blnSupportCategories,blnFavoritesMode,blnShowMoreButton,blnForceMoreInMajorsMnu,iDecimalPlaces,blnHideMoreSeparateMenu)
{
    if (blnShowOnlyName==null) blnShowOnlyName=true;

    objADVInit.ShowOnlySymbolName=(blnShowOnlyName==true ? 1:0);
    if (strMarket!=null) objADVInit.DefaultMarket=strMarket;
    if (strSymbol!=null) objADVInit.Symbol=strSymbol;
    if (strSymbolName!=null) objADVInit.SymbolName=strSymbolName;
    if (strIgnoreCharsOnSearch!=null) objADVInit.IgnoreCharsOnSearch=strIgnoreCharsOnSearch;
    if (blnSupportCategories!=null) objADVInit.SupportCategories=blnSupportCategories;
    if (blnFavoritesMode!=null) objADVInit.FavoritesMode=blnFavoritesMode;
    if (blnShowMoreButton!=null) objADVInit.ShowMoreButton=blnShowMoreButton;
    if (blnForceMoreInMajorsMnu!=null) objADVInit.ForceMoreInMajorsMnu=blnForceMoreInMajorsMnu;
    if (iDecimalPlaces!=null) objADVInit.DecimalPlaces=iDecimalPlaces;
    if (blnHideMoreSeparateMenu!=null) objADVInit.HideMoreSeparateMenu=blnHideMoreSeparateMenu;
}


// -----------------------------------------------------------------------------
//  Call this function to set the default data source.
//
//  Updated to versio 2.60.010
//
//  Parameters:
//  objADVInit:             The parameters container object
//	strDataMethod:			The way the component recieve data: "ExternalWS","JSPush","AdvinionWS" 
//  strWSURL:      			The webservice data source in case of external web-service for the data
//  strSYSWSURL				The webservice data source in case of external web-service for saving systems
//  strShareWSURL			The webservice data source in case of external web-service for shareing data
// -----------------------------------------------------------------------------
function ADVINION_ProDataSettings(objADVInit,strDataMethod,strWSURL,strSYSWSURL,strShareWSURL)
{
    if (strDataMethod!=null) objADVInit.DataMethod=strDataMethod;
    if (strWSURL!=null) objADVInit.WSURL=strWSURL;
    if (strSYSWSURL!=null) objADVInit.SYSWSURL=strSYSWSURL;
    if (strShareWSURL!=null) objADVInit.ShareWSURL=strShareWSURL;
}


// -----------------------------------------------------------------------------
//  Call this function to enable / disable trading from the Charte.
//
//  Parameters:
//  objADVInit:             The parameters container object
//	blnEnable:				True to enable or False to disable 
// -----------------------------------------------------------------------------
function ADVINION_ProTradableSettings(objADVInit,blnEnable)
{
    if (blnEnable!=null) objADVInit.Tradable=blnEnable;
}

// -----------------------------------------------------------------------------
//  Call this function to set the request timeout. the minimum is 1 minute
//
//  Parameters:
//  objADVInit:             The parameters container object
//	iRequestTimeout:		The request timeout
// -----------------------------------------------------------------------------
function ADVINION_ProRequestSettings(objADVInit,iRequestTimeout)
{
    if (iRequestTimeout!=null) objADVInit.RequestTimeout=iRequestTimeout;
}

function ADVINION_Internal_GenrateFlashVars(objADVInit)
{
    var strKey;
    var strVARS="";
    
    for (strKey in objADVInit)
    {
        if (strKey!=null && objADVInit[strKey]!=null)
        {
            if (strVARS.length==0)
                strVARS=strKey+"="+objADVInit[strKey];
            else
                strVARS=strVARS+"&"+strKey+"="+objADVInit[strKey];
        }
    }
        
    return strVARS;
}

// -----------------------------------------------------------------------------
//  Call this function to set the value field (BID/ASK/Other) configuration 
//
//  Parameters:
//  objADVInit:             	The parameters container object
//	strValueFieldType:			With which field to work? (BID, ASK or OTHER)
//	blnEnableValueFieldTypeUI:	Should the user have access to changing this field (in the View menu)
//	strOtherFieldName:			What label to give the OTHER field in the UI. e.g. "MID"
// -----------------------------------------------------------------------------
function ADVINION_ProValueFieldSettings(objADVInit,strValueFieldType,blnEnableValueFieldTypeUI,strOtherFieldName)
{
    if (strValueFieldType!=null) objADVInit.ValueFieldType=strValueFieldType;
    if (blnEnableValueFieldTypeUI!=null) objADVInit.EnableValueFieldTypeUI=blnEnableValueFieldTypeUI;
    if (strOtherFieldName!=null) objADVInit.OtherFieldName=strOtherFieldName;
}

// -----------------------------------------------------------------------------
//  Call this function to enable hosting site handling the detach process.
//  Studies and draw will be saved to cookie and reload after detach 
//
//  Parameters:
//  objADVInit:             	The parameters container object
//	blnDetachDoneByHost:		Should the hosting site handle detach process
// -----------------------------------------------------------------------------
function ADVINION_ProDetachSettings(objADVInit,blnDetachDoneByHost)
{
    if (blnDetachDoneByHost!=null) objADVInit.DetachDoneByHost=blnDetachDoneByHost;
}

// -----------------------------------------------------------------------------
//  Call this function to customize displayed time-scales
//  Studies and draw will be saved to cookie and reload after detach 
//
//  Parameters:
//  objADVInit:             	The parameters container object
//	strTimeScales:				Required time-scales id's separated by semicolon. Full list - "Tick;1M;5M;10M;15M;30M;60M;2H;4H;5H;8H;1D;1W;1MON"
//	strTimeScalesButtons:		Required time-scales buttons id's separated by semicolon. Full list - "Tick;1M;5M;10M;15M;30M;60M;2H;4H;5H;8H;1D;1W;1MON"
// -----------------------------------------------------------------------------
function ADVINION_ProTimeScalesSettings(objADVInit,strTimeScales,strTimeScalesButtons)
{
    if (strTimeScales!=null) objADVInit.TimeScales=strTimeScales;
    if (strTimeScalesButtons!=null) objADVInit.TimeScalesButtons=strTimeScalesButtons;
}

// -----------------------------------------------------------------------------
//  Call this function to customize toolbar look
//  Available from version: 2.6 
//
//  Parameters:
//  objADVInit:             	The parameters container object
//	strToolbarImage:			File name of the image located in the SWF folder
// -----------------------------------------------------------------------------
function ADVINION_ProToolbarSettings(objADVInit,strToolbarImage)
{
    if (strToolbarImage!=null) objADVInit.ToolbarImage=strToolbarImage;
}


// -----------------------------------------------------------------------------
//  Call this function to set the Chart's grid
//  Available from version: 2.60.008 
//
//  Parameters:
//  objADVInit:             	The parameters container object
//	blnEnableGrid:				Should grid be visible true/false
// -----------------------------------------------------------------------------
function ADVINION_ProGridSettings(objADVInit,blnEnableGrid)
{
    if (blnEnableGrid!=null) objADVInit.EnableGrid=blnEnableGrid;
}

// -----------------------------------------------------------------------------
//  Call this function to enable logo watermark in the Chart. The logo function should 
//  also be enabled via the license in order for the API to work.
//
//  Parameters:
//  objADVInit:             The parameters container object
//	strFileName:			Logo file name. Only filename + extension. File should exist in SWF folder 
//	iWidth:					Logo width in pixels 
//	iHeight:				Logo hight in pixels 
//	strHAlign:				Horizontal align. Values: "left", "center" or "middle"
//	strVAlign:				Vertical align. Values: "top", "middle" or "bottom"
//	iHOffset:				Horizontal Offset from the top-left edge in intger values.
//	iVOffset:				Vertical Offset from the top-left edge in intger values.
// -----------------------------------------------------------------------------
function ADVINION_ProLogoSettings(objADVInit,strFileName,iWidth,iHeight,strHAlign,strVAlign,iHOffset,iVOffset)
{
    if (strFileName!=null) objADVInit.LogoFileName=strFileName;
    if (iWidth!=null) objADVInit.LogoWidth=iWidth;
    if (iHeight!=null) objADVInit.LogoHeight=iHeight;
    if (strHAlign!=null) objADVInit.LogoHAlign=strHAlign;
    if (strVAlign!=null) objADVInit.LogoVAlign=strVAlign;
    if (iHOffset!=null) objADVInit.LogoHOffset=iHOffset;
    if (iVOffset!=null) objADVInit.LogoVOffset=iVOffset;
}

// -----------------------------------------------------------------------------
//  Call this function to enable sharing data by user with other users. Need server side support.
//
//  Parameters:
//  objADVInit:             The parameters container object
//	strShareType:			One of the following "WS", "JS" or "NONE". WS=WebService JS=JavaScript callback NONE=Disabled
//	strUpFileName:			Share button Up-state inage file name. filename + extension if in SWF folder or full URL 
//	strOverFileName:		Share button Over-state inage file name. filename + extension if in SWF folder or full URL
//	strPressedFileName:		Share button Pressed-state inage file name. filename + extension if in SWF folder or full URL
// 	strCallbackName:		If type is "JS" then this parameter will contain the name of the JavaScript callback function
// -----------------------------------------------------------------------------
function ADVINION_ProShareSettings(objADVInit,strShareType,strUpFileName,strOverFileName,strPressedFileName,strCallbackName)
{
    if (strUpFileName!=null) objADVInit.ShareImageUpFileName=strUpFileName;
    if (strOverFileName!=null) objADVInit.ShareImageOverFileName=strOverFileName;
    if (strPressedFileName!=null) objADVInit.ShareImagePressedFileName=strPressedFileName;
    if (strShareType!=null) objADVInit.ShareType=strShareType;
    if (strCallbackName!="") objADVInit.ShareCallbackName=strCallbackName;
}


//-----------------------------------------------------------------------------
//Call this function to enable sharing data by user with other users. Need server side support.
//
//Parameters:
//objADVInit:             				The parameters container object
//blnEnable:							Enable/Disable annotations
//arrImagesUrl:							Array of URL to images. 
//arrImagesID:							Array of unique ids per image URL
//strOnRefreshAnnotationCallbackName:	Name of JavaScript callback function. The Chart will call it each time there is a need to refresh the on chart annotations.
//iFirstVGap:							Vertical Gap between price and first marker
//iVGap:								Vertical Gap between the markers
//-----------------------------------------------------------------------------
function ADVINION_ProAnnotationSettings(objADVInit,blnEnable,arrImagesUrl,arrImagesID,strOnRefreshAnnotationCallbackName,iFirstVGap,iVGap)
{
	if (blnEnable!=null) objADVInit.EnableAnnotations=blnEnable;
	if (arrImagesUrl!=null) objADVInit.AnnotationsImagesUrl=arrImagesUrl.join('|');
	if (arrImagesID!=null) objADVInit.AnnotationsImagesIDs=arrImagesID.join('|');
	if (iFirstVGap!=null)  objADVInit.FirstVGap=iFirstVGap;
	if (iVGap!=null)  objADVInit.VGap=iVGap;
	if (strOnRefreshAnnotationCallbackName!=null) objADVInit.OnRefreshAnnotationCallbackName=strOnRefreshAnnotationCallbackName;
}


//-----------------------------------------------------------------------------
//Call this function to enable custom colors for several UI components.
//
//Parameters:
//objADVInit:             				The parameters container object
//blnEnable:             				Enable/Disable this feature
//strMenuTextColor:             		The menu bar text color. E.G. #66FF66
//strMenuTextRollOverColor:             The menu bar text color when mouse hover it. E.G. #0000FF
//strMenuBorderColor:             		The menu bar border color. E.G. #FF4400
//strMenuFillColor1:             		The menu bar starting fill color. E.G. #FF6666
//strMenuFillColor2:             		The menu bar ending fill color. E.G. #441111
//strTimeRangeStrokeColor:             	The time select component background chart's stroke (line) color. E.G. #880000
//strTimeControlFillColor:              The time select component background chart's fill color. E.G. #CC0000
//strPriceTitleTextColor:             	The price panel title graphics Text color. E.G. #0000FF
//strPriceTitleFillColor1:             	The price panel title graphics starting fill color. E.G. #FF6666
//strPriceTitleFillColor2:             	The price panel title graphics ending fill color. E.G. #441111
//-----------------------------------------------------------------------------
function ADVINION_ProCustomUIColors(objADVInit,blnEnable,strMenuTextColor,strMenuTextRollOverColor,strMenuBorderColor,strMenuFillColor1,strMenuFillColor2,
									strTimeRangeStrokeColor,strTimeControlFillColor,strPriceTitleTextColor,strPriceTitleFillColor1,strPriceTitleFillColor2)
{
	if (blnEnable!=null) objADVInit.EnableUIColors=blnEnable;
	if (strMenuTextColor!=null) objADVInit.MenuTextColor=strMenuTextColor;
	if (strMenuTextRollOverColor!=null) objADVInit.MenuTextRollOverColor=strMenuTextRollOverColor;
	if (strMenuBorderColor!=null) objADVInit.MenuBorderColor=strMenuBorderColor;
	if (strMenuFillColor1!=null) objADVInit.MenuFillColor1=strMenuFillColor1;
	if (strMenuFillColor2!=null) objADVInit.MenuFillColor2=strMenuFillColor2;
	if (strTimeRangeStrokeColor!=null) objADVInit.TimeRangeStrokeColor=strTimeRangeStrokeColor;
	if (strTimeControlFillColor!=null) objADVInit.TimeControlFillColor=strTimeControlFillColor;
	if (strPriceTitleTextColor!=null) objADVInit.PriceTitleTextColor=strPriceTitleTextColor;
	if (strPriceTitleFillColor1!=null) objADVInit.PriceTitleFillColor1=strPriceTitleFillColor1;
	if (strPriceTitleFillColor2!=null) objADVInit.PriceTitleFillColor2=strPriceTitleFillColor2;
}

//-----------------------------------------------------------------------------
//Call this function to configurate time signiture.
//
//Parameters:
//objADVInit:             				The parameters container object
//fDefaultTimeZone:             		The GMT offset in seconds. e.g. 120=GMT+2  -60=GMT-1 	0=GMT etc...
//-----------------------------------------------------------------------------
function ADVINION_ProTime(objADVInit,fDefaultTimeZone)
{
	if (fDefaultTimeZone!=null) objADVInit.DefaultTimeZone=fDefaultTimeZone;
}

//-----------------------------------------------------------------------------
//Call this function to set your callback function. The chart will call it 
//whenever a symbol changes via user input.
//
//Parameters:
//objADVInit:             				The parameters container object
//strCallback:             				The callback function name
//-----------------------------------------------------------------------------
function ADVINION_ProOnSymbolChangeCallback(objADVInit,strCallback)
{
	if (strCallback!=null) objADVInit.OnSymbolChangeCallback=strCallback;
}


// -----------------------------------------------------------------------------
//  Call this function to actually create the chart
//
//  Parameters:
//  objADVInit:        	The parameters container object
//  strWidth:          	Width of chart.   	Example: 300
//  strHeight:         	Height of chart. 	Example: 400
//	blnWMode:			Does the component have to support WMODE (example: when menu might open above it)
// -----------------------------------------------------------------------------
function CreateAdvinionProfessionalChartEx(objADVInit,strWidth,strHeight,blnWMode,strBKColor)
{
    var strGraphID="AdvinionPro"+gid;
    var strVars=ADVINION_Internal_GenrateFlashVars(objADVInit);	//Get parameters
    gid++;
   
    if (strWidth==null) strWidth="300px";
    if (strHeight==null) strHeight="300px";
    if (strBKColor==null) strBKColor="#FFFFFF";
    
    if ( hasProductInstall && !hasRequestedVersion ) 
    {
        // DO NOT MODIFY THE FOLLOWING FOUR LINES
        // Location visited after installation is complete if installation is required
        var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
        var MMredirectURL = window.location;
        document.title = document.title.slice(0, 47) + " - Flash Player Installation";
        var MMdoctitle = document.title;

        AC_FL_RunContent(
            "src", strAdvinionFlashFolder+"playerProductInstall",
            "FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+MMdoctitle+"",
            "width", "100%",
            "height", "100%",
            "align", "middle",
            "id", strGraphID,
            "quality", "high",
            "bgcolor", "#B7D2FF",
            "name", strGraphID,
            "allowScriptAccess","sameDomain",
            "type", "application/x-shockwave-flash",
            "pluginspage", "http://www.adobe.com/go/getflashplayer");
    } 
    else if (hasRequestedVersion) 
    {
        // if we've detected an acceptable version
        // embed the Flash Content SWF when all tests are passed
        if (blnWMode==true)
        {
            AC_FL_RunContent(
	            "src", strAdvinionFlashFolder+"AdvinionProfessionalChart_2.63.1",
	            "width", strWidth,//"300px",
	            "height", strHeight,//"300px",
	            "align", "middle",
	            "id", strGraphID,
	            "quality", "high",
	            "bgcolor", strBKColor,
	            "wmode", "opaque",	//"transparent",
	            "name", strGraphID,
	            //"allowScriptAccess","sameDomain",
	            "allowScriptAccess","always",
	            "type", "application/x-shockwave-flash",
	            "flashvars",strVars,
	            "pluginspage", "http://www.adobe.com/go/getflashplayer",
	            "allowFullScreen", "true"
	            );
	            
	            //if(IS_FF && !(document.attachEvent)) 
	            //
	            //Firefox and IE ignore mousewheel while flash's WMODE is transparent or opaque. 
	            //This flag enables JavaScript override to handle mousewheel
	            blnAdvinionScrollViaJS=true;
        }
        else
        {
            AC_FL_RunContent(
	            "src", strAdvinionFlashFolder+"AdvinionProfessionalChart_2.63.1",
	            "width", strWidth,//"300px",
	            "height", strHeight,//"300px",
	            "align", "middle",
	            "id", strGraphID,
	            "quality", "high",
	            "bgcolor", strBKColor,
	            "wmode", (IS_FF ? "direct":"opaque"),
	            "name", strGraphID,
	            //"allowScriptAccess","sameDomain",
	            "allowScriptAccess","always",
	            "type", "application/x-shockwave-flash",
	            "flashvars",strVars,
	            "pluginspage", "http://www.adobe.com/go/getflashplayer",
	            "allowFullScreen", "true"
	            );
	            
           blnAdvinionScrollViaJS=(!IS_FF);
        }
     } 
     else 
     {  // flash is too old or we can't detect the plugin
        var alternateContent = 'Advinion Charts - Cannot display Professional Chart. '
        + 'This content requires the Adobe Flash Player. '
        + '<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
        document.write(alternateContent);  // insert non-flash content
     }
}


/*
    Prevent Scrolling
*/
  	function ADVINION_Internal_HookEvent(element, eventName, callback)
    {
        if (typeof(element) == "string")
            element = document.getElementById(element);
        if (element == null)
            return;
        if (element.addEventListener)
        {
            if (eventName == 'mousewheel')
                element.addEventListener('DOMMouseScroll', callback, false);
            element.addEventListener(eventName, callback, false);
        }
        else if (element.attachEvent())
            element.attachEvent("on" + eventName, callback);
    }

    function ADVINION_Internal_UnHookEvent(element, eventName, callback)
    {
        if (typeof(element) == "string")
            element = document.getElementById(element);
        if (element == null)
            return;
        if (element.removeEventListener)
        {
            if (eventName == 'mousewheel')
                element.removeEventListener('DOMMouseScroll', callback, false);
            element.removeEventListener(eventName, callback, false);
        }
        else if (element.detachEvent)
            element.detachEvent("on" + eventName, callback);
    }

    function ADVINION_Internal_CancelEvent(e)
    {
    	if (blnAdvinionScrollViaJS==true)
    	{
	    	var app = ADVINION_Internal_GetProObject();
	        if (app) 
	        {
	            var o = {x: e.screenX, y: e.screenY,
	                delta: (e.wheelDelta ? -e.wheelDelta/40 : e.detail),
	                ctrlKey: e.ctrlKey, altKey: e.altKey,
	                shiftKey: e.shiftKey}
	           
	            app.HandleWheel(o);
	        }
    	}
    
        e = e ? e : window.event;
        if (e.stopPropagation)
            e.stopPropagation();
        if (e.preventDefault)
            e.preventDefault();
        e.cancelBubble = true;
        e.cancel = true;
        e.returnValue = false;
        return false;
    }
    
    
    function ADVINION_Internal_GetProObject()
    {
    	if(navigator.appName.indexOf("Microsoft") != -1)
    	{
			return window["AdvinionPro1"];
		} 
		else 
		{
			return document.getElementById("AdvinionPro1");
		}
    }

// -----------------------------------------------------------------------------
//  Call this function to prevent mouse-wheel change inside the chart to scroll the whole page
//
//  Parameters:
//  strContainer:        	The name of the SPAN containing the Chart element
// -----------------------------------------------------------------------------
  	function ADVINION_PreventPageScroll(strContainer)
  	{
  		ADVINION_Internal_HookEvent(strContainer,'mousewheel', ADVINION_Internal_CancelEvent);
  	}
  	
  	function ADVINION_GetProChartObject()
    {
    	if(navigator.appName.indexOf("Microsoft") != -1)
    	{
			return window["AdvinionPro1"];
		} 
		else 
		{
			return document.getElementById("AdvinionPro1");
		}
    }
  	
  	
  			/*
		 * Date Format 1.2.3
		 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
		 * MIT license
		 *
		 * Includes enhancements by Scott Trenda <scott.trenda.net>
		 * and Kris Kowal <cixar.com/~kris.kowal/>
		 *
		 * Accepts a date, a mask, or a date and a mask.
		 * Returns a formatted version of the given date.
		 * The date defaults to the current date/time.
		 * The mask defaults to dateFormat.masks.default.
		 */
		
		var dateFormat = function () {
			var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
				timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
				timezoneClip = /[^-+\dA-Z]/g,
				pad = function (val, len) {
					val = String(val);
					len = len || 2;
					while (val.length < len) val = "0" + val;
					return val;
				};
		
			// Regexes and supporting functions are cached through closure
			return function (date, mask, utc) {
				var dF = dateFormat;
		
				// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
				if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
					mask = date;
					date = undefined;
				}
		
				// Passing date through Date applies Date.parse, if necessary
				date = date ? new Date(date) : new Date;
				if (isNaN(date)) throw SyntaxError("invalid date");
		
				mask = String(dF.masks[mask] || mask || dF.masks["default"]);
		
				// Allow setting the utc argument via the mask
				if (mask.slice(0, 4) == "UTC:") {
					mask = mask.slice(4);
					utc = true;
				}
		
				var	_ = utc ? "getUTC" : "get",
					d = date[_ + "Date"](),
					D = date[_ + "Day"](),
					m = date[_ + "Month"](),
					y = date[_ + "FullYear"](),
					H = date[_ + "Hours"](),
					M = date[_ + "Minutes"](),
					s = date[_ + "Seconds"](),
					L = date[_ + "Milliseconds"](),
					o = utc ? 0 : date.getTimezoneOffset(),
					flags = {
						d:    d,
						dd:   pad(d),
						ddd:  dF.i18n.dayNames[D],
						dddd: dF.i18n.dayNames[D + 7],
						m:    m + 1,
						mm:   pad(m + 1),
						mmm:  dF.i18n.monthNames[m],
						mmmm: dF.i18n.monthNames[m + 12],
						yy:   String(y).slice(2),
						yyyy: y,
						h:    H % 12 || 12,
						hh:   pad(H % 12 || 12),
						H:    H,
						HH:   pad(H),
						M:    M,
						MM:   pad(M),
						s:    s,
						ss:   pad(s),
						l:    pad(L, 3),
						L:    pad(L > 99 ? Math.round(L / 10) : L),
						t:    H < 12 ? "a"  : "p",
						tt:   H < 12 ? "am" : "pm",
						T:    H < 12 ? "A"  : "P",
						TT:   H < 12 ? "AM" : "PM",
						Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
						o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
						S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
					};
		
				return mask.replace(token, function ($0) {
					return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
				});
			};
		}();
		
		// Some common format strings
		dateFormat.masks = {
			"default":      "ddd mmm dd yyyy HH:MM:ss",
			shortDate:      "m/d/yy",
			mediumDate:     "mmm d, yyyy",
			longDate:       "mmmm d, yyyy",
			fullDate:       "dddd, mmmm d, yyyy",
			shortTime:      "h:MM TT",
			mediumTime:     "h:MM:ss TT",
			longTime:       "h:MM:ss TT Z",
			isoDate:        "yyyy-mm-dd",
			isoTime:        "HH:MM:ss",
			isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
			isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
		};
		
		// Internationalization strings
		dateFormat.i18n = {
			dayNames: [
				"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
				"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			],
			monthNames: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
			]
		};
		
		// For convenience...
		Date.prototype.format = function (mask, utc) {
			return dateFormat(this, mask, utc);
		};

		
	function ADVINION_JSProChangeSize(strWidth,strHeight)
  	{
		var element = ADVINION_Internal_GetProObject();
  		
  		element.style.width=strWidth;
  		element.style.height=strHeight;	
  	}
  	
  	function ADVINION_JSProChangeSymbol(strMarket,strSymbolId,strSymbolName)
  	{
		var element = ADVINION_Internal_GetProObject();
  		element.ChangeSymbolNoPush(strMarket,strSymbolId,strSymbolName);
  	}