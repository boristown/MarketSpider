// File: indexComponents.js
function indexComponentsSubmit(a,b,c,d){var e=[],f=Math.random(),g=$("#"+a),h=$(".js-stockfiltertype.toggled").attr("type"),i=urlFolder||"indices";g.find("th").each(function(){e.push($(this).data("col-name")||"")}),ga("allSitesTracker.send","event","Tables",h,"Download Data"),window.savedDownloadParams={pairid:c,sid:f,smlID:b,category:h,download:!0,sort_col:e[window.dataCurrentSort[0]],sort_ord:e[window.dataCurrentSort[1]]?"d":"a"},h+=d,siteData.userLoggedIn?document.location.href="/"+i+"/service/"+h+"?"+$.param(window.savedDownloadParams):(overlay.overlayLogin(),overlay.authCompleteAction={type:signupAction||"indiceComponentsData",actionData:window.savedDownloadParams})}