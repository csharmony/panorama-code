'use strict';

var NewsPanel = (function () {

    var _Init = function() {
        var elBlogHTML = $.GetContextPanel().FindChildTraverse('HarmonyBlogHTML');
        if (elBlogHTML) {
            elBlogHTML.SetURL('https://harmony.heapy.xyz/blog');
        }
    };

    function _InjectCSS() {
        var elBlogHTML = $.GetContextPanel().FindChildTraverse('HarmonyBlogHTML');
        if (elBlogHTML) {
            elBlogHTML.RunJavascript(`
                var style = document.createElement('style');
                style.textContent = \`
                    nav.sticky.top-0.z-50.flex.items-center.gap-1.border-b.border-border.px-4.py-2.backdrop-blur-sm {
                        display: none !important;
                    }
                    h1.text-2xl.font-semibold {
                        display: none !important;
                    }
                \`;
                document.head.appendChild(style);
            `);
        }
    }

	function _HTMLFinishRequest() {
        _InjectCSS();
    }

	function _HTMLOpenPopupTab(objHtmlEventTarget, objHtml, sUrl) {
		// Add custom command later here if needed, for now we allow only to open external links in 'developer 2'
        if(GameInterfaceAPI.GetSettingString("developer") == 2) {
			UiToolkitAPI.ShowGenericPopupYesNo( 'External Link', 'This link will open ' + sUrl + ' externally in your Browser.\n\nAre you sure that you want to open this link?', '', function() { SteamOverlayAPI.OpenUrlInOverlayOrExternalBrowser(sUrl); }, function() { } )
		} else {
			UiToolkitAPI.ShowGenericPopupOk( 'External Links', 'Due to security measure\'s, you cannot open any links externally from within CS Harmony unless it\'s enabled specifically in your game settings.', '', function() { } )
		}
    }


	return {
		Init: _Init,
		HTMLFinishRequest: _HTMLFinishRequest,
		HTMLOpenPopupTab: _HTMLOpenPopupTab
	};
})();


( function()
{
	NewsPanel.Init();
    $.RegisterEventHandler("HTMLFinishRequest", $.GetContextPanel(), NewsPanel.HTMLFinishRequest);
	$.RegisterEventHandler("HTMLOpenPopupTab", $.GetContextPanel(), NewsPanel.HTMLOpenPopupTab);
})();